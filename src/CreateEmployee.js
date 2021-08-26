import React, {Component} from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from "react-bootstrap/Modal";
import Spinner from 'react-bootstrap/Spinner';

class CreateEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee_address: "",
            employee_salary: "",
            created: true
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSubmit(evt) {
        evt.preventDefault();
        this.setState({created: false})
        setTimeout(() => {
            this.props.createStream(this.state)
            .then(console.log())
            .then(this.setState({employeeAddress: "", employeeSalary: "", created: true}))
        }, 2000);
    }

    render() {
        return (
        <Container>
            <Modal show={true} onHide={this.props.closeCreateModal}>
            <Modal.Header closeButton onClick={this.props.closeCreateModal}>
                <Modal.Title>Add New Employee</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="employee_address">Employee Address </Form.Label>
                        <Form.Control type="text" name="employee_address" value={this.state.employeeAddress} onChange={this.handleChange}></Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="employee_salary">Employee Salary</Form.Label>
                        <Form.Control type="text" name="employee_salary" value={this.state.employeeSalary} onChange={this.handleChange}></Form.Control>
                    </Form.Group>
                </Form>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                {this.state.created? <Button variant="primary" onClick={this.handleSubmit}>Create Employee</Button>
                :<Spinner animation="border" variant="primary"></Spinner>}
              <Button variant="secondary" onClick={this.props.closeCreateModal}>
                Close
              </Button>
              
            </Modal.Footer>
            </Modal>
            </Container>
        )
    }
}

export default CreateEmployee;