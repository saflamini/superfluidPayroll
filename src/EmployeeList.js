import React, {Component} from "react";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import "./EmployeeList.css";
import Table from "react-bootstrap/Table";
import Employee from "./Employee";
import { calculateSalary } from "./config";

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
                            <h3>Employee Roster</h3>
                        </Card>
                        <Button className="addEmployee" onClick={this.toggleCreateModal}>
                            Add Employee
                        </Button>
                        
                        <Table className="employees"responsive bordered hover>
                        <thead>
                            <tr>
                            <th>Address</th>
                            <th>Salary</th>
                            {/* <th>Balance</th> */}
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