import React, {Component} from "react";
import Button from 'react-bootstrap/Button';
import "./ConnectWallet.css";
// import detectEthereumProvider from '@metamask/detect-provider';



class ConnectWallet extends Component {
    constructor(props) {
        super(props);
        this.enableWallet = this.enableWallet.bind(this)
    }

    async enableWallet() {
        window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        })
        .then
        (window.ethereum.request({ 
            method: 'eth_accounts'
        }))
       
        const acct = await window.ethereum.request({ method: 'eth_accounts' });
        this.props.connected(acct)

    }

    render() {
            return (
                <Button onClick={this.enableWallet} className="connectWallet">Connect Wallet</Button>
            )
        }
    }

export default ConnectWallet;