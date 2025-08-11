import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const EditProfileModal = ({
  show,
  handleClose,
  handleUpdate,
  formData,
  setFormData,
  modalContent
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const renderFormField = (label, name, type = "text", placeholder = "") => (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </Form.Group>
  );

  const getModalTitle = () => {
    switch (modalContent) {
      case "basic":
        return "Edit Basic Information";
      case "academic":
        return "Edit Academic Information";
      case "contact":
        return "Edit Contact Details";
      case "official":
        return "Edit Official Details";
      case "emergency":
        return "Edit Emergency Contact";
      default:
        return "Edit Profile";
    }
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case "basic":
        return (
          <>
            {renderFormField("Full Name", "name")}
            {renderFormField("Father's Name", "father_name")}
            {renderFormField("Mother's Name", "mother_name")}
            {renderFormField("Gender", "gender")}
            {renderFormField("Date of Birth", "dob", "date")}
          </>
        );
      case "academic":
        return (
          <Row>
            <Col md={6}>
              {renderFormField("Institute Name & Address", "institute", "text", "Enter institute name & address")}
              {renderFormField("Degree", "degree", "text", "Enter degree")}
              {renderFormField("Group/Department", "department", "text", "Enter department")}
            </Col>
            <Col md={6}>
              {renderFormField("Result", "result", "text", "Enter result")}
              {renderFormField("Duration (Start–End)", "duration", "text", "Enter duration")}
              {renderFormField("Fail/Retake/Withdraw/Transfer", "fail_retake", "text", "Enter if any")}
            </Col>
          </Row>
        );
      case "contact":
        return (
          <>
            {renderFormField("Phone", "phone")}
            {renderFormField("Email", "email")}
            {renderFormField("Present Address", "present_address")}
            {renderFormField("Permanent Address", "permanent_address")}
          </>
        );
      case "official":
        return (
          <>
            {renderFormField("Employee ID", "employee_id")}
            {renderFormField("Position", "position")}
            {renderFormField("Joining Date", "joining_date", "date")}
            {renderFormField("Work Location", "location")}
          </>
        );
      case "emergency":
        return (
          <>
            {renderFormField("Emergency Contact Name", "emergency_name")}
            {renderFormField("Emergency Contact Number", "emergency_number")}
            {renderFormField("Relationship", "relationship")}
          </>
        );
      default:
        return <p>No section selected.</p>;
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{getModalTitle()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>{renderModalContent()}</Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
