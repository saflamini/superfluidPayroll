import React, {Component} from "react";
import { calculateSalPerSecond } from "./config";
import Card from "react-bootstrap/esm/Card";
import "./DisplayBalance.css";

class DisplayBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: "$0.00"
        }

        this.loadBalance = this.loadBalance.bind(this);
        
    }

    loadBalance() {
        console.log(this.props)
        if (Number(this.props.fUSDCxBal) > 0) {
            this.setState({balance: this.props.fUSDCxBal})
            setInterval(() => {
                this.setState({
                    balance: (Number(this.state.balance) + (calculateSalPerSecond(this.props.outflows) / 10)).toFixed(5)
                })
            }, 
            100)
        }
    }

    componentDidMount() {
        this.interval = this.loadBalance();        
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        console.log('timer unmounted')
      }

render() {

    return (
        <div >
        <h5>SuperToken USDCx Balance </h5>
        <h2>{this.props.outflows === 0? '$0.00'
        : `$${this.state.balance}` }</h2>
        </div>
    )       
    }
}

export default DisplayBalance;