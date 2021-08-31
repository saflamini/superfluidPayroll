import React, {Component} from "react";
import Web3 from "web3";
import SuperfluidSDK from "@superfluid-finance/js-sdk";
import detectEthereumProvider from '@metamask/detect-provider';
import { ERC20abi } from "./abis/ERC20abi";
import { fUSDCxabi } from "./abis/fUSDCxabi";
import { calculateStream } from "./config";
import { fUSDC_address } from "./config"
import { fUSDCx_address } from "./config";
import ConnectWallet from "./ConnectWallet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card"
import Balances from "./Balances";
import "./Master.css"
import BigNumber from "bignumber.js";
import { calculateFlowRate } from "./config";
import StreamList from "./StreamList";
import CreateEmployee from "./CreateEmployee";
import { toDecimal } from "web3-utils";
import EditEmployee from "./EditEmployee";
import { calculateSalPerSecond } from "./config";
import { calculateEndDate } from "./config";

class Master extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: '',
            provider: '',
            sf: {},
            connected: true,
            account: '',
            fUSDC: {},
            fUSDCx: {},
            fUSDCxBal: 0,
            creatingEmployee: false,
            editingEmployee: false,
            deletingEmployee: false,
            editingAddress: "",
            outFlows: [],
            totalOutflows: 0,
            netFlow: 0,
            endDate: ""
        }

        this.initWeb3= this.initWeb3.bind(this);
        this.getAccount = this.getAccount.bind(this)
        // this.connected = this.connected.bind(this);
        this.isConnected = this.isConnected.bind(this);
        this.getBalances = this.getBalances.bind(this);
        this.addFunding = this.addFunding.bind(this);
        this.withdrawFunding = this.withdrawFunding.bind(this);
        this.createStream = this.createStream.bind(this);
        this.toggleCreateModal = this.toggleCreateModal.bind(this);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.listOutFlows = this.listOutFlows.bind(this);
        this.getNetFlow = this.getNetFlow.bind(this);
        this.editStream = this.editStream.bind(this);
        this.deleteStream = this.deleteStream.bind(this);
        this.getTotalOutflows = this.getTotalOutflows.bind(this);
        this.getEndDate = this.getEndDate.bind(this);
    }

    
    async initWeb3() {

        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider)

        if (provider) {

        const sf = new SuperfluidSDK.Framework({
        web3: new Web3(provider)
        });

        
        await sf.initialize()

        const fUSDC = new web3.eth.Contract(ERC20abi, fUSDC_address);
        const fUSDCx = new web3.eth.Contract(fUSDCxabi, fUSDCx_address);

        
        this.setState({
            web3: web3,
            provider: provider,
            sf: sf,
            fUSDC: fUSDC,
            fUSDCx: fUSDCx
        })

        //call this.getAccounts once we load contracts and set them to state
        
        await this.getAccount();
        if (this.state.account.length > 0) {
        await this.getBalances();
        await this.listOutFlows();
        await this.getTotalOutflows();
        await this.getNetFlow();
        await this.getEndDate();
        }
    
    }
    else {
        console.log('You should consider MetaMask!');
      }
    }

    async isConnected() {
        let accts = window.ethereum._state.accounts;
    
        if (accts.length === 0) {
            console.log('not connected')
            this.setState({
                connected: false
            })
        } else {
            console.log('connected')
            this.setState({
                account: accts[0],
                connected: true
            })
            this.initWeb3();
        }
    }

    async getAccount() {

      const acct = await window.ethereum.request({ method: 'eth_accounts' })
          
          if (acct.length > 0) {
              this.setState({
                  connected: true, 
                  account: acct[0]
                })
          }
          else if (acct.length === 0) {
              this.setState({
                  connected: false,
                  account: ""
              })
          }
          
          let currentAccount = acct;
            window.ethereum
            .request({ method: 'eth_accounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                // Some unexpected error.
                // For backwards compatibility reasons, if no accounts are available,
                // eth_accounts will return an empty array.
                console.error(err);
            });

            //handles a change in connected accounts
            function handleAccountsChanged(accounts) {
                if (accounts.length === 0) {
                    // MetaMask is locked or the user has not connected any accounts
                    console.log('Please connect to MetaMask.');
               
                } else if (accounts[0] !== currentAccount) {
                    currentAccount = accounts[0];
                }
            }
            
            window.ethereum.on('accountsChanged', this.isConnected, handleAccountsChanged);

    }


    async getBalances() {
        
        const fUSDCxBal = await this.state.fUSDCx.methods.balanceOf(this.state.account).call({from: this.state.account});
        
        const adjustedfUSDCx = Number(new BigNumber(fUSDCxBal).shiftedBy(-18)).toFixed(6);
     
        this.setState({
            fUSDCxBal: adjustedfUSDCx
        })

    }

    async listOutFlows() {
        const flows = await this.state.sf.cfa.listFlows({
            superToken: fUSDCx_address,
            account: this.state.account
        })
        
        const outFlowArray = [];

        for (let i = 0; i < flows.outFlows.length; i++) {
            outFlowArray.push(flows.outFlows[i]);
        }
        
        this.setState({
            outFlows: outFlowArray
        })
    }

    async getNetFlow() {
        const netFlow = await this.state.sf.cfa.getNetFlow({
            superToken: fUSDCx_address,
            account: this.state.account
        })

        this.setState({
            netFlow: netFlow
        })
    }

    async getTotalOutflows() {
        let totalOutflows = 0;
        let outFlows = this.state.outFlows;
        for (let i = 0; i <= outFlows.length; i++) {
            if (outFlows[i] !== undefined) { 
                let stream = calculateStream(outFlows[i].flowRate)
                totalOutflows = totalOutflows - Number(stream);
            }
        }
        
        this.setState({
            totalOutflows: totalOutflows
        })
    }

    getEndDate() {
        let end = calculateEndDate(this.state.fUSDCxBal, this.state.totalOutflows);
        console.log(end);
        this.setState({
            endDate: end
        })
    }

    //superfluid operations

    async addFunding(amount) {
        await this.state.fUSDC.methods.approve(fUSDCx_address,amount).send({from: this.state.account}).then(console.log)
        .then(
            await this.state.fUSDCx.methods.upgrade(amount).send({from: this.state.account}).then(console.log))
        .then(
            await this.getBalances()
        );
    }

    async withdrawFunding(amount) {
        await this.state.fUSDCx.methods.downgrade(amount).send({from: this.state.account}).then(console.log)
        .then(
            await this.getBalances()
        )
    }

    async createStream(employee) {

        let salary = (new BigNumber(employee.employee_salary).shiftedBy(18));
        let address = Web3.utils.toChecksumAddress(employee.employee_address);
        let _flowRate = calculateFlowRate(salary);
        
        const sf = this.state.sf;
        const tx = (sf.cfa._cfa.contract.methods
            .createFlow(
                fUSDCx_address.toString(),
                address.toString(),
                _flowRate.toString(),
                "0x"
            )
            .encodeABI())

        await sf.host.contract.methods.callAgreement(
            sf.cfa._cfa.address.toString(), tx.toString(), "0x").send({from: this.state.account, type: "0x2"})
        .then(console.log)
    }

    async editStream(employee) {
        let address = employee.address;
        let newFlowRate = calculateFlowRate(employee.salary);

        const sf = this.state.sf;
        const tx = (sf.cfa._cfa.contract.methods
            .updateFlow(
                fUSDCx_address.toString(),
                address.toString(),
                newFlowRate.toString(),
                "0x"
            )
            .encodeABI())
            await sf.host.contract.methods.callAgreement(
                sf.cfa._cfa.address.toString(), tx.toString(), "0x").send({from: this.state.account, type: "0x2"})
            .then(console.log)
            .then(await this.listOutFlows())   
    }   

    async deleteStream(address) {
        
        const sf = this.state.sf;
        const tx = (sf.cfa._cfa.contract.methods
            .deleteFlow(
                fUSDCx_address.toString(),
                this.state.account.toString(),
                address.toString(),
                "0x"
            )
            .encodeABI())
            await sf.host.contract.methods.callAgreement(
                sf.cfa._cfa.address.toString(), tx.toString(), "0x").send({from: this.state.account, type: "0x2"})
            .then(console.log)   
            .then(await this.listOutFlows())
    } 

    //modal operations

    toggleCreateModal() {
        this.setState({
            creatingEmployee: true
        })
    }

    closeCreateModal() {
        this.setState({
            creatingEmployee: false
        })
    }

    showCreateModal() {
        return (
            <CreateEmployee
            createStream={this.createStream}
            closeCreateModal={this.closeCreateModal}
            />
        )
    }

    toggleEditModal(employeeAddress) {

        this.setState({
            editingEmployee: !this.state.editingEmployee,
            editingAddress: employeeAddress
        })

        console.log(this.state.editingEmployee)
        if (!this.state.editingEmployee) {
            this.showEditModal(employeeAddress)
        }
    }

    showEditModal(employeeAddress) {
        let stream;
        
        let outFlows = this.state.outFlows;
        for (let i = 0; i <= outFlows.length; i++) {
            if (outFlows[i].receiver === employeeAddress) {
                let stream = calculateStream(this.state.outFlows[i].flowRate);
                break;
            }
        }
        return (
            <EditEmployee
            address={employeeAddress}
            stream={stream}
            toggleEditModal={this.toggleEditModal}
            toggleDeleteModal={this.toggleDeleteModal}
            editStream={this.editStream}
            deleteStream={this.deleteStream}
            />
        )
    }

    toggleDeleteModal() {
        this.setState({
            deletingEmployee: !this.state.deletingEmployee
        })
    }

    async componentDidMount() {
        await this.getAccount();
        await this.initWeb3();
    }

    render() {
        return (
            <div>
            
            <Row className="top">
            <Container>
                <Row>
                <Col>
                <h3 className="title">Superfluid Dashboard</h3>
                </Col>
                <Col>
                {!this.state.connected || this.state.account == "" || this.state.account == undefined?
                <ConnectWallet
                getAccount={this.getAccount}
                />
                :
                <Card className="connectWallet">{`${this.state.account.toString().substring(0, 4)}...${this.state.account.toString().substring(38)}`}</Card>
                }
                </Col>
                </Row>
            </Container>

            </Row>

            <Row>

            <Container>
               
                <Balances
                fUSDCxBal={this.state.fUSDCxBal}
                funding={this.addFunding}
                withdraw={this.withdrawFunding}
                outflows={this.state.totalOutflows}
                endDate={this.state.endDate}
                />
                
                
            </Container>
            </Row>

            <Container>
            
                <StreamList 
                toggleCreateModal={this.toggleCreateModal}
                toggleEditModal={this.toggleEditModal}
                toggleDeleteModal={this.toggleDeleteModal}
                streams={this.state.outFlows}
                fUSDCx={this.state.fUSDCx}
                />
            
            </Container>

            <Container>
                {this.state.creatingEmployee? this.showCreateModal(): console.log('not creating an employee')}
                {this.state.editingEmployee? this.showEditModal(this.state.editingAddress): console.log('not editing')}

            </Container>
            </div>
        )
    }
}

export default Master;