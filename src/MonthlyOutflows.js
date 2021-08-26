import React, {Component} from "react";

class MonthlyOutflows extends Component {
    constructor(props) {
        super(props);
    }

    render() {
    
        return (
            <div>
                <h2><strong>Total Monthly Outflows</strong></h2>
                <h3>{`$${this.props.outflows.toFixed(2)}`}</h3>
          
                <h5><strong>Your Balance Will Hit Zero On:</strong></h5>
                <h6>{this.props.endDate}</h6>
          
            </div>
        )
    }
}

export default MonthlyOutflows;