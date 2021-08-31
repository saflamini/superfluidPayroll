import React, {Component} from "react";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Row from "react-bootstrap/esm/Row";
import "./StreamList.css";
import Table from "react-bootstrap/Table";
import Stream from "./Stream";

class EmployeeList extends Component {
    constructor(props) {
        super(props);

        this.toggleCreateModal = this.toggleCreateModal.bind(this);
        this.renderStreams = this.renderStreams.bind(this)
    }

    toggleCreateModal() {
        this.props.toggleCreateModal();
    }

    renderStreams() {
        console.log(this.props)
        return (
            this.props.streams.map(stream => (
                <tbody key={Number(stream.flowRate + Math.floor((Math.random() * 10)))}>{
                    <Stream className="e"
                    address={stream.receiver}
                    flowRate={stream.flowRate}
                    fUSDCx={this.props.fUSDCx}
                    handleEditing={this.props.toggleEditModal}
                    />}
                    </tbody>
            ))
        )
    }

    render() {
        return (
            
            <div className="streamList">
                <Container>
                    <Row>
               
                        <Card className="streamListTitle">
                            <h3>Active Streams</h3>
                        </Card>
                        <Button className="addStream" onClick={this.toggleCreateModal}>
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
                        {this.renderStreams()}
                        </Table> 
                    </Row>
                </Container>
            </div>
        )
    }
}

export default EmployeeList; 