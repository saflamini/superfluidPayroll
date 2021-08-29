import React, {Component} from "react";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Row from "react-bootstrap/esm/Row";
import "./EmployeeList.css";
import Table from "react-bootstrap/Table";
import Employee from "./Employee";

class EmployeeList extends Component {
    constructor(props) {
        super(props);

        this.toggleCreateModal = this.toggleCreateModal.bind(this);
        this.renderEmployees = this.renderEmployees.bind(this)
    }

    toggleCreateModal() {
        this.props.toggleCreateModal();
    }

    renderEmployees() {
        return (
            this.props.flows.map(flow => (
                <tbody key={Number(flow.flowRate)}>{
                    <Employee className="e"
                    address={flow.receiver}
                    flowRate={flow.flowRate}
                    fUSDCx={this.props.fUSDCx}
                    handleEditing={this.props.toggleEditModal}
                    />}
                    </tbody>
            ))
        )
    }

    render() {
        return (
            
            <div className="employeeList">
                <Container>
                    <Row>
               
                        <Card className="employeeListTitle">
                            <h3>Active Streams</h3>
                        </Card>
                        <Button className="addEmployee" onClick={this.toggleCreateModal}>
                            Add Stream
                        </Button>
                        
                        <Table className="employees"responsive bordered hover>
                        <thead>
                            <tr>
                            <th>Address</th>
                            <th>Amount/Month</th>
                            <th>Edit</th>
                            </tr>
                        </thead>
                        {this.renderEmployees()}
                        </Table> 
                    </Row>
                </Container>
            </div>
        )
    }
}

export default EmployeeList; 