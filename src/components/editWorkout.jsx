import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

class EditWorkout extends Component {
  state = {
    show: false,
    name: this.props.workoutName,
    link: this.props.link,
    group: this.props.group,
    id: this.props.workoutId
  };

  handleClose = () => {
    this.setState({
      show: false,
      name: this.props.workoutName,
      link: this.props.link,
      group: this.props.group
    });
  };
  handleShow = () => {
    this.setState({ show: true });
  };
  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };
  handleGroupChange = event => {
    this.setState({ group: event.target.value });
  };

  handleLinkChange = event => {
    this.setState({ link: event.target.value });
  };

  handleSubmit = () => {
    if (this.state.name.length === 0) {
      alert("Missing Workout Name");
    } else {
      let differenceFound = this.validateEdit();

        if (!differenceFound) {
            alert('Warning: No Changes Made')
        }

      this.props.handleEdit(this.state);
    }
  };

  // Compare edit details vs original details
  // If same do not update
  validateEdit = () => {
    let differenceFound = false;

    if (this.state.name !== this.props.workoutName) {
      differenceFound = true;
    }
    if (this.state.group !== this.props.group) {
      differenceFound = true;
    }
    if (this.state.link !== this.props.link) {
      differenceFound = true;
    }

    return differenceFound;
  };

  createGroupSelect = () => {
    let groups = this.props.allGroups;
    return groups.map(group => {
      return <option key={group}>{group}</option>;
    });
  };

  render() {
    return (
      <>
        <Button variant="warning" onClick={this.handleShow}>
          Edit
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Workout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formEditName">
                <Form.Label>Workout Name</Form.Label>
                <Form.Control
                  type="text"
                  onChange={this.handleNameChange}
                  value={this.state.name}
                />
              </Form.Group>
              <Form.Group controlId="formWikipediaLink">
                <Form.Label>(OPTIONAL) Wikipedia Link</Form.Label>
                <Form.Control
                  type="text"
                  onChange={this.handleLinkChange}
                  value={this.state.link || ''}
                />
              </Form.Group>
              <Form.Group controlId="formEditGroup">
                <Form.Label>Workout Category</Form.Label>
                <select
                  onChange={this.handleGroupChange}
                  className="form-control"
                >
                  {this.createGroupSelect()}
                </select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default EditWorkout;
