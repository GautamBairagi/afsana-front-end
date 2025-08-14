import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons"; // Add this import at the top


const dummyLead = {
  id: 1,
  full_name: "Krishna Sharma",
  course_name: "BBA",
  counselor_name: "Vishal",
  follow_up_date: "2025-08-15",
  lead_status: "Follow-Up Needed",
  email: "krishna@example.com",
  phone_number: "9876543210",
  country: "India",
  branch: "Delhi",
  inquiry_type: "General",
  source: "Website",
  created_at: "2025-07-20",
};

const dummyHistory = [
  { date: "2025-08-01", type: "Call", notes: "Interested in BBA" },
  { date: "2025-08-05", type: "Email", notes: "Docs sent" },
  { date: "2025-08-10", type: "WhatsApp", notes: "Asked about fees" },
];

const FollowUpHistory = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpType, setFollowUpType] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    // Dummy data for now
    setLead(dummyLead);
    setHistory(dummyHistory);
  }, [id]);

  const handleAddFollowUp = () => {
    setHistory([...history, { date: followUpDate, type: followUpType, notes }]);
    setShowModal(false);
    setFollowUpDate("");
    setFollowUpType("");
    setNotes("");
  };

  if (!lead) return <div>Loading...</div>;

  return (
    <div className="p-4">

      <div className="mb-3">
  <Button
    variant="outline-primary"
    size="sm"
    href="/lead"
    style={{ alignItems: "center", gap: "6px" }}
  >
    <ArrowLeft size={16} />
    Back to Lead
  </Button>
</div>
      <h3>Lead Follow-Up Tracking</h3>
      <Table bordered>
        <thead>
          <tr>
            <th>Lead Name</th>
            <th>Course</th>
            <th>Counselor</th>
            <th>Follow-Up History</th>
            <th>Next Follow-Up</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{lead.full_name}</td>
            <td>{lead.course_name}</td>
            <td>{lead.counselor_name}</td>
            <td>
              {history.map((h, i) => (
                <div key={i}>
                  {h.date} {h.type} - {h.notes}
                </div>
              ))}
            </td>
            <td>{lead.follow_up_date}</td>
            <td>{lead.lead_status}</td>
            <td>
              <Button size="sm" onClick={() => setShowModal(true)}>
                Add Follow-Up
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>

      {/* Modal for adding follow-up */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Follow-Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={followUpType}
                onChange={(e) => setFollowUpType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Call">Call</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Office Visit">Office Visit</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddFollowUp}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FollowUpHistory;