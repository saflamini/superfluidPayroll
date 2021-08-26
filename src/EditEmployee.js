import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {assets, decimals, assetSymbols} from "./config";
import { BigNumber } from "bignumber.js";



class EditEmployee extends Component {
constructor(props) {
    super(props);
    this.state = {
        placeholderSalary: this.props.salary,
        salary: "",
        salaryEditing: false,
        deleting: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleDeleteStream = this.handleDeleteStream.bind(this);
    this.salaryEdit = this.salaryEdit.bind(this);
    this.deletingEmployee = this.deletingEmployee.bind(this);
    this.updateEmployeeObject = this.updateEmployeeObject.bind(this);
    this.updateSal = this.updateSal.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
}

handleChange(evt) {
    this.setState({
        [evt.target.name]: evt.target.value
    })
}

handleDeleteStream(evt) {
    evt.preventDefault();
    this.props.deleteStream(this.props.address);
}

salaryEdit() {
    this.setState({salaryEditing: !this.state.salaryEditing})
}

deletingEmployee() {
    this.setState({deleting: !this.state.deleting})
}

salaryEdited() {
    this.setState({salary: this.state.employeeObject.salary})
    this.setState({salaryEditing: !this.state.salaryEditing})
}


updateEmployeeObject() {
    this.setState({
        address: this.props.address,
        salary: this.props.salary,
    })
}

sendUpdate() {
    let adjustedEmployeeObject = {
        address: this.props.address,
        salary: new BigNumber(this.state.salary).shiftedBy(18),
    }
    this.props.editStream(adjustedEmployeeObject);
}

updateSal() {
    this.setState({
        placeholderSalary: this.state.salary,
        salaryEditing: false
    })
}


render() {
    console.log(this.props)

if (this.state.salaryEditing) {
    let salaryDisplay;
    salaryDisplay = (

        <Container>
            <Modal show={true} onHide={this.props.toggleEditModal}>
                <Modal.Header closeButton onClick={this.props.toggleEditModal}>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                <Form >
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="salary">Edit Salary </Form.Label>
                    <Form.Control type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></Form.Control>
                </Form.Group>
                <Button variant="primary" onClick={this.updateSal}>Done</Button>
                <Button className="goBack" variant="secondary" onClick={this.salaryEdit}>Cancel</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleEditModal}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
      </Container>
    )
    return salaryDisplay;
}

if (this.state.deleting) {
    let deletionDisplay;
    deletionDisplay = (

        <Container>
            <Modal show={true} onHide={this.props.toggleEditModal}>
                <Modal.Header closeButton onClick={this.props.toggleEditModal}>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                <Form >
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="salaryEdit">Are you sure you want to delete this employee? </Form.Label>
                    <p>
                    <Button variant="danger" onClick={this.handleDeleteStream}>Yes</Button>
                    <Button className="goBack" variant="secondary" onClick={this.deletingEmployee}>No</Button>
                    </p>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleEditModal}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
      </Container>
    )
    return deletionDisplay;
}

else {
    return (
    <Container>
         <Modal show={true} onHide={this.props.toggleEditModal}>
                <Modal.Header closeButton onClick={this.props.toggleEditModal}>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
        <p>
            <strong>Address</strong>: {this.props.address}
        </p>
        <p>
            <strong>Salary</strong>: {`$${this.state.placeholderSalary}/month`} <Button size="sm" variant="secondary" onClick={this.salaryEdit}>Edit</Button>
        </p>
        <Button size="sm" variant="danger" onClick={this.deletingEmployee}>Delete</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleEditModal}>
            Close
          </Button>
          <Button onClick={this.sendUpdate} variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
        </Modal>
        </Container>
    )
}

}}

export default EditEmployee;