import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

class NewWorkout extends Component {
  state = {
    show: false,
    name: "",
    link: "",
    group: this.props.group
  };

  handleClose = () => {
    this.setState({ show: false, name: "", link: "" });
  };
  handleShow = () => {
    this.setState({ show: true });
  };

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };

  handleLinkChange = event => {
    this.setState({ link: event.target.value });
  };

  handleSubmit = () => {
    if (this.state.name.length > 0) {
      this.props.onSubmit(this.state);
      this.handleClose();
    } else {
      alert('Missing Workout Name')
    }
  };

  render() {
    return (
      <>
        <Button variant="success" onClick={this.handleShow}>
          NEW
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>New Workout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formNewName">
                <Form.Label>Workout Name</Form.Label>
                <Form.Control
                  type="text"
                  onChange={this.handleNameChange}
                  placeholder="Enter Workout Name"
                />
              </Form.Group>
              <Form.Group controlId="formWikipediaLink">
                <Form.Label>(OPTIONAL) Wikipedia Link</Form.Label>
                <Form.Control
                  type="text"
                  onChange={this.handleLinkChange}
                  placeholder="Link"
                />
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

export default NewWorkout;
