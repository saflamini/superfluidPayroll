import React, {Component} from "react";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import BigNumber from "bignumber.js";
import { calculateSalary } from "./config";

class Employee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fUSDCxBalance: 0
        }

        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.getBalance = this.getBalance.bind(this);
    }  

    componentDidMount() {
        this.getBalance();
    }


    toggleEditModal() {
        this.props.handleEditing(this.props.address)
    }

    toggleDeleteModal() {
        this.props.handleDeleting(this.props.address)
    }

    async getBalance() {
        const bal = await this.props.fUSDCx.methods.balanceOf(this.props.address).call();
        this.setState({
            fUSDCxBalance: new BigNumber(bal).shiftedBy(-18).toFixed(2)
        })
    }

    render() {
     
        const employeeObject = {
            address: this.props.address,
            salary: `$${calculateSalary(this.props.flowRate)}/month`, 
            balance: `$${this.state.fUSDCxBalance}`,   
        }

            let result;
            result = (
      
            <tr>
                <td>{employeeObject.address}</td>
                <td>{employeeObject.salary}</td>
                <td><Button variant="primary" onClick={this.toggleEditModal}>Edit</Button></td>
            </tr>
        )

        return result;
        
    }
}

export default Employee;