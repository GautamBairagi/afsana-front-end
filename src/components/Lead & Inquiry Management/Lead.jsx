import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Badge,
  Row,
  Col,
  InputGroup,
  Modal,
} from "react-bootstrap";
import {
  BsUpload,
  BsWhatsapp,
  BsArrowRepeat,
  BsSearch,
  BsEnvelope,
  BsTelephone
} from "react-icons/bs";
import api from "../../interceptors/axiosInterceptor";
import "./Lead.css";
import AddLead from "./AddLead";
import BASE_URL from "../../Config";

const LeadTable = ({ show, handleClose }) => {
  const [convertData, setConvertData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [followUpDate, setFollowUpDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadInquiry, setUploadInquiry] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [universities, setUniversities] = useState([]);

  const [showLeadDetailsModal, setShowLeadDetailsModal] = useState(false);
const [selectedLead, setSelectedLead] = useState(null);

const [showFollowUpModal, setShowFollowUpModal] = useState(false);
const [showNotesModal, setShowNotesModal] = useState(false);
// ...existing code...

  const [filters, setFilters] = useState({
    status: "",
    counselor: "",
    followUp: "",
    country: "",
    search: "",
    startDate: "",
    endDate: "",
    source: "",
    branch: "",
    leadType: ""
  });

  const user_id = localStorage.getItem("user_id");

  // Load data on component mount
  useEffect(() => {
    fetchConvertedLeads();
    fetchCounselors();
    fetchUniversities();
  }, []);

  const fetchConvertedLeads = async () => {
    try {
      const response = await api.get(`${BASE_URL}AllConvertedLeadsinquiries`);
      setConvertData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching converted leads:", error);
      alert("Failed to fetch leads");
    }
  };

  const fetchCounselors = async () => {
    try {
      const res = await api.get(`${BASE_URL}counselor`);
      setCounselors(res.data);
    } catch (err) {
      console.error("Error fetching counselors:", err);
      alert("Failed to fetch counselors");
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await api.get(`${BASE_URL}universities`);
      setUniversities(response.data);
    } catch (error) {
      console.log("Error fetching universities:", error);
      alert("Failed to fetch universities");
    }
  };

  const handleStatusChangeFromTable = async (id, status) => {
    try {
      await api.patch(`${BASE_URL}update-lead-status-new`, {
        inquiry_id: id,
        new_leads: status,
      });
      alert("Status updated successfully!");
      fetchConvertedLeads();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "New Lead":
        return "bg-success";
      case "Contacted":
        return "bg-warning text-dark";
      case "Follow-Up Needed":
        return "bg-primary";
      case "Visited Office":
        return "bg-orange text-white";
      case "Not Interested":
        return "bg-secondary";
      case "Next Intake Interested":
        return "bg-light-purple text-white";
      case "Registered":
        return "bg-purple text-white";
      case "Dropped":
        return "bg-danger";
      default:
        return "bg-dark";
    }
  };

  // Filter function
  useEffect(() => {
    let data = [...convertData];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      data = data.filter(
        (lead) =>
          lead.full_name.toLowerCase().includes(search) ||
          lead.email.toLowerCase().includes(search) ||
          lead.phone_number.includes(search)
      );
    }

    if (filters.status) {
      data = data.filter((lead) => lead.new_leads === filters.status);
    }

    if (filters.counselor) {
      data = data.filter((lead) => String(lead.counselor_id) === filters.counselor);
    }

    if (filters.followUp) {
      const today = new Date();
      const dateOnly = (d) => new Date(d).toISOString().slice(0, 10);

      if (filters.followUp === "today") {
        data = data.filter((lead) => dateOnly(lead.follow_up_date) === dateOnly(today));
      } else if (filters.followUp === "thisWeek") {
        const endOfWeek = new Date();
        endOfWeek.setDate(today.getDate() + 7);
        data = data.filter(
          (lead) =>
            new Date(lead.follow_up_date) >= today &&
            new Date(lead.follow_up_date) <= endOfWeek
        );
      } else if (filters.followUp === "overdue") {
        data = data.filter((lead) => new Date(lead.follow_up_date) < today);
      }
    }

    if (filters.country) {
      data = data.filter((lead) => lead.country === filters.country);
    }

    // New filters
    if (filters.startDate && filters.endDate) {
      data = data.filter((lead) => {
        const leadDate = new Date(lead.created_at);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        return leadDate >= startDate && leadDate <= endDate;
      });
    }

    if (filters.source) {
      data = data.filter((lead) => lead.source === filters.source);
    }

    if (filters.branch) {
      data = data.filter((lead) => lead.branch === filters.branch);
    }

    if (filters.leadType) {
      data = data.filter((lead) => lead.inquiry_type === filters.leadType);
    }

    setFilteredData(data);
  }, [filters, convertData]);

  const handleAssignCounselor = async () => {
    if (!selectedCounselor || !followUpDate) {
      alert("Please select counselor & follow-up date.");
      return;
    }

    const payload = {
      inquiry_id: selectedInquiry.id,
      counselor_id: selectedCounselor.id,
      follow_up_date: followUpDate,
      notes: notes,
    };

    try {
      const res = await api.post(`${BASE_URL}assign-inquiry`, payload);
      if (res.status === 200) {
        alert("Counselor assigned successfully.");
        setShowAssignModal(false);
        fetchConvertedLeads();
        resetAssignModal();
      }
    } catch (err) {
      console.error("Error assigning counselor:", err);
      alert("Failed to assign counselor.");
    }
  };

  const resetAssignModal = () => {
    setSelectedInquiry(null);
    setSelectedCounselor(null);
    setFollowUpDate("");
    setNotes("");
  };

  const handleOpenAssignModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    resetAssignModal();
  };

  const handleOpenUploadModal = (inquiry) => {
    setUploadInquiry(inquiry);
    setShowUploadModal(true);
    setSelectedFiles({});
  };

  const handleFileChange = (e, docType) => {
    setSelectedFiles({
      ...selectedFiles,
      [docType]: e.target.files[0],
    });
  };

  const handleUploadDocuments = async () => {
    if (!uploadInquiry) return;

    const formData = new FormData();
    formData.append("inquiry_id", uploadInquiry.id);
    Object.keys(selectedFiles).forEach((key) => {
      formData.append(key, selectedFiles[key]);
    });

    try {
      const res = await api.post(`${BASE_URL}upload-inquiry-documents`, formData);
      if (res.status === 200) {
        alert("Documents uploaded successfully.");
        setShowUploadModal(false);
      }
    } catch (err) {
      console.error("Error uploading documents:", err);
      alert("Failed to upload.");
    }
  };

  const handleConvertToStudent = (lead) => {
    setFormData({
      user_id: user_id,
      full_name: lead.full_name || "",
      father_name: "",
    identifying_name :"",
      mother_name: "",
      mobile_number: lead.phone_number || "",
      university_id: "",
      date_of_birth:  lead.date_of_birth || "",
      gender:lead.gender ||"",
      category: "",
      address: lead.address ||"",
      role: "student",
      password: "",
      email: lead.email || "",

    });
    setPhoto(null);
    setDocuments([]);
    setIsEditing(false);
    setShowStudentModal(true);
  };


 

  const [formData, setFormData] = useState({
    user_id: user_id,
    full_name: "",
    father_name: "",
   mother_name:"",
    identifying_name: "",
    mobile_number: "",
    university_id: "",
    date_of_birth: "",
    gender: "",
    category: "",
    address: "",
    role: "student",
    password: "",
    email: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formPayload = new FormData();
    for (const key in formData) {
      formPayload.append(key, formData[key]);
    }

    if (photo) formPayload.append("photo", photo);
    documents.forEach((doc) => formPayload.append("documents", doc));

    const url = isEditing
      ? `${BASE_URL}auth/updateStudent/${editStudentId}`
      : `${BASE_URL}auth/createStudent`;

    const method = isEditing ? "put" : "post";

    try {
      const res = await api({
        method,
        url,
        data: formPayload,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(isEditing ? "Student updated successfully" : "Student created successfully");
      resetForm();
      fetchConvertedLeads();
    } catch (err) {
      console.error("Error:", err);
      alert("User Already exits");
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: user_id,
      full_name: "",
      father_name: "",
      admission_no: "",
      id_no: "",
      mobile_number: "",
      university_id: "",
      date_of_birth: "",
      gender: "",
      category: "",
      address: "",
      role: "student",
      password: "",
      email: "",
    });
    setPhoto(null);
    setDocuments([]);
    setIsEditing(false);
    setEditStudentId(null);
    setShowStudentModal(false);
  };


    useEffect(() => {
      if (formData.full_name && formData.university_id) {
        const university = universities.find(u => u.id.toString() === formData.university_id.toString());
        const universityName = university ? university.name : "";
        const identifying = `${formData.full_name} ${universityName} Deb`;
        setFormData((prev) => ({
          ...prev,
          identifying_name: identifying,
        }));
      }
    }, [formData.full_name, formData.university_id, universities]);

    // Get unique values for filter dropdowns
    const uniqueSources = [...new Set(convertData.map(lead => lead.source))].filter(Boolean);
    const uniqueBranches = [...new Set(convertData.map(lead => lead.branch_name))].filter(Boolean);
    const uniqueLeadTypes = [...new Set(convertData.map(lead => lead.inquiry_type))].filter(Boolean);

  return (
    <div className="p-4">
      <h2 className="">Lead Table</h2>

      {/* === FILTER SECTION === */}
      <div className="mb-3 p-3 bg-light rounded border">
        <Row className="g-2 align-items-end">
          {/* Date Range Filters */}
          <Col md={2}>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                size="sm"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                size="sm"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </Form.Group>
          </Col>

          {/* Existing Filters */}
          <Col md={2}>
          <Form.Label>All Sources</Form.Label>
            <Form.Select
              size="sm"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}

            >
              <option value="">All Statuses</option>
              <option>New Lead</option>
              <option>Contacted</option>
              <option>Follow-Up Needed</option>
              <option>Visited Office</option>
              <option>Not Interested</option>
              <option>Next Intake Interested</option>
              <option>Registered</option>
              <option>Dropped</option>
            </Form.Select>
          </Col>

          <Col md={2}>
          <Form.Label>All Counselors</Form.Label>
            <Form.Select
              size="sm"
              value={filters.counselor}
              onChange={(e) => setFilters({ ...filters, counselor: e.target.value })}
            >
              <option value="">All Counselors</option>
              {[...new Set(convertData.map((d) => d.counselor_id))]
                .filter((id) => id !== 1)
                .map((id) => (
                  <option key={id} value={id}>
                    {convertData.find((c) => c.counselor_id === id)?.counselor_name || "N/A"}
                  </option>
                ))}
            </Form.Select>
          </Col>

          <Col md={2}>
          <Form.Label>Follow Up</Form.Label>
            <Form.Select
              size="sm"
              value={filters.followUp}
              onChange={(e) => setFilters({ ...filters, followUp: e.target.value })}
            >
              <option value="">Follow-Up</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="overdue">Overdue</option>
            </Form.Select>
          </Col>

          <Col md={2}>
          <Form.Label>All Country</Form.Label>
            <Form.Select
              size="sm"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            >
              <option value="">All Countries</option>
              {[...new Set(convertData.map((d) => d.country))].map(
                (c, i) =>
                  c && (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  )
              )}
            </Form.Select>
          </Col>

          {/* New Filters */}
          <Col md={2}>
          <Form.Label>All Sources</Form.Label>
            <Form.Select
              size="sm"
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            >
              <option value="">All Sources</option>
              {uniqueSources.map((source, i) => (
                <option key={i} value={source}>
                  {source}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2}>
          <Form.Label>All Branches</Form.Label>
            <Form.Select
              size="sm"
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            >
              <option value="">All Branches</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Sylhet">Sylhet</option>
              {uniqueBranches.map((branch, i) => (
                branch !== "Dhaka" && branch !== "Sylhet" && (
                  <option key={i} value={branch}>
                    {branch}
                  </option>
                )
              ))}
            </Form.Select>
          </Col>

          <Col md={2}>
          <Form.Label>All Lead Types</Form.Label>
            <Form.Select
              size="sm"
              value={filters.leadType}
              onChange={(e) => setFilters({ ...filters, leadType: e.target.value })}
            >
              <option value="">All Lead Types</option>
              {uniqueLeadTypes.map((type, i) => (
                <option key={i} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2}>
          <Form.Label>Search</Form.Label>
            <InputGroup size="sm">
              <Form.Control
                placeholder="Search by name, email or phone"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <InputGroup.Text>
                <BsSearch />
              </InputGroup.Text>
            </InputGroup>
          </Col>

          <Col md={1}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setFilters({
                  status: "",
                  counselor: "",
                  followUp: "",
                  country: "",
                  search: "",
                  startDate: "",
                  endDate: "",
                  source: "",
                  branch: "",
                  leadType: ""
                });
              }}
            >
              Reset
            </Button>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md="auto" className="ms-auto">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowModal(true)}
            >
              Add Lead
            </Button>
          </Col>
        </Row>
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          backdrop="static"
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Lead</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddLead />
          </Modal.Body>
        </Modal>
      </div>

      {/* === TABLE SECTION === */}
      <div className="table-responsive">
        <Table bordered hover>
          <thead className="table-light">
             <tr>
    <th>#</th>
    <th>Name</th>
    <th>Email</th>
    <th>Phone</th>
    <th>Country</th>
    <th>Branch</th>
    <th>Enquiry Type</th>
    <th>Course</th>
    <th>Source</th>
    <th>Status</th>
    <th>Counselor</th>
    <th>Follow-Up</th>
    <th>Created At</th>
    <th>View</th> {/* New View column */}
    <th>Actions</th>
  </tr>
          </thead>
          <tbody>
            {filteredData.map((lead, index) => (
              <tr key={lead.id}>
                <td>{index + 1}</td>
                <td>{lead.full_name || "N/A"}</td>
                <td>{lead.email || "N/A"}</td>
                <td>{lead.phone_number || "N/A"}</td>
                <td>{lead.country || "N/A"}</td>
                <td>{lead.branch || "N/A"}</td>
                <td>{lead.inquiry_type || "N/A"}</td>
                <td>{lead.course_name || "N/A"}</td>
                <td>{lead.source || "N/A"}</td>
                <td>
                  <span className={`badge ${getStatusBadgeColor(lead.new_leads == 0 ? "New Lead" : lead.new_leads)}`}>
                    {lead.new_leads == 0 ? "New Lead" : lead.new_leads || "N/A"}
                  </span>
                </td>
                <td>
                  {lead.counselor_id ? (
    <span
      className="badge bg-info"
      role="button"
      style={{ cursor: "pointer" }}
      onClick={() => handleOpenAssignModal(lead)}
    >
      {lead.counselor_name || "Assigned"}
    </span>
  ) : (
    <Button
      variant="info"
      size="sm"
      className="me-2"
      onClick={() => handleOpenAssignModal(lead)}
    >
      Assign Counselor
    </Button>
  )}
                </td>
                <td>{lead.follow_up_date?.slice(0, 10) || "N/A"}</td>
                <td>{lead.created_at ? lead.created_at.slice(0, 10) : "N/A"}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowLeadDetailsModal(true);
                    }}
                  >
                    View Lead
                  </Button>

            {/* add follow up and add lead  */}
  <Button
    variant="outline-primary"
    size="sm"
    onClick={() => window.location.href = `/follow-up-history/${lead.id}`}
  >
    Follow-Up History
  </Button>

<Button
  variant="outline-primary"
  size="sm"
  onClick={() => {
    setSelectedLead(lead);
    setShowNotesModal(true);
  }}
>
  Add Notes
</Button>

                </td>
                <td className="d-flex">
                  <Form.Select
                    size="sm"
                    className="me-2"
                    style={{ width: "100px" }}
                    value={lead.lead_status || ""}
                    onChange={(e) => handleStatusChangeFromTable(lead.id, e.target.value)}
                  >
                    <option>Action</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-Up Needed">Follow-Up Needed</option>
                    <option value="Visited Office">Visited Office</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Next Intake Interested">Next Intake Interested</option>
                    <option value="Registered">Registered</option>
                    <option value="Dropped">Dropped</option>
                  </Form.Select>

                  {lead.new_leads === "Registered" && (
                    <Button  
                      variant="outline-primary" 
                      size="sm" 
                      className="ms-2 me-2"
                      onClick={() => handleConvertToStudent(lead)}
                    >
                      <BsArrowRepeat className="me-1" /> Convert to Student
                    </Button>
                  )}

               <Button
                    variant="outline-success"
                    className=" btn btn-sm btn-outline-success me-2 py-1"
                    size="sm"
                    onClick={() => window.open(`https://wa.me/${lead.phone_number}`, '_blank')}
                  >
                    <i className="bi bi-whatsapp  "></i>
                  </Button>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${lead.email}&su=Regarding Your Lead&body=${encodeURIComponent(
      `Dear ${lead.full_name},

Here are your lead details:

- Name: ${lead.full_name}
- Phone: ${lead.phone_number}
- Email: ${lead.email}
- Inquiry Type: ${lead.inquiry_type}
- Source: ${lead.source}
- Branch: ${lead.branch}
- Counselor: ${lead.counselor_name || 'Not Assigned'}
- Country: ${lead.country}
- Created At: ${lead.created_at ? lead.created_at.slice(0, 10) : ''}
- Status: ${lead.new_leads}

Thank you for your interest.

Regards,
Study First Info Team`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-sm btn-outline-dark"
    style={{ display: "flex", alignItems: "center" }}
  >
    <BsEnvelope className="me-1" />
  </a>

    <a
    href={`tel:${lead.phone_number}`}
    className="btn btn-sm btn-outline-primary ms-2"
    style={{ display: "flex", alignItems: "center" }}
    title="Call"
  >
    <BsTelephone className="me-1" />
  </a>
</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Assign Modal */}
        <Modal show={showAssignModal} onHide={handleCloseAssignModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
      {selectedInquiry?.counselor_id ? "Update Counselor" : "Assign Counselor"}
    </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedInquiry && (
              <>
                <p><strong>Lead:</strong> {selectedInquiry.full_name}</p>
                <Form.Group className="mb-3">
                  <Form.Label>Counselor *</Form.Label>
                  <Form.Select
                    value={selectedCounselor?.id || ""}
                    onChange={(e) => {
                      const id = e.target.value;
                      const counselor = counselors.find((c) => c.id.toString() === id);
                      setSelectedCounselor(counselor);
                    }}
                  >
                    <option value="">Select Counselor</option>
                    {counselors.map((c) => (
                      <option key={c.id} value={c.id}>{c.full_name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Follow-Up Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAssignModal}>Cancel</Button>
            <Button variant="primary" onClick={handleAssignCounselor}>
      {selectedInquiry?.counselor_id ? "Update Counselor" : "Assign Counselor"}
    </Button>
          </Modal.Footer>
        </Modal>

        {/* Upload Documents Modal */}
        <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
          <Modal.Header closeButton><Modal.Title>Upload Documents</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Passport</Form.Label>
              <Form.Control type="file" onChange={(e) => handleFileChange(e, "passport")} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Certificates</Form.Label>
              <Form.Control type="file" onChange={(e) => handleFileChange(e, "certificates")} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>IELTS</Form.Label>
              <Form.Control type="file" onChange={(e) => handleFileChange(e, "ielts")} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>SOP</Form.Label>
              <Form.Control type="file" onChange={(e) => handleFileChange(e, "sop")} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUploadDocuments}>Upload</Button>
          </Modal.Footer>
        </Modal>

        {/* Student Form Modal */}
        <Modal 
    show={showStudentModal} 
    onHide={resetForm}
    size="xl"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title>Student Information</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="fullName">
              <Form.Label>Student Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter student name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
                readOnly // Pre-filled from lead, admin shouldn't change
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="fatherName">
              <Form.Label>Father Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter father name"
                value={formData.father_name}
                onChange={(e) => setFormData({...formData, father_name: e.target.value})}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="motherName">
              <Form.Label>Mother Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mother name"
                value={formData.mother_name}
                onChange={(e) => setFormData({...formData, mother_name: e.target.value})}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="email">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter student's email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                readOnly // Pre-filled from lead
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="password">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="mobileNumber">
              <Form.Label>Mobile Number *</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter mobile number"
                value={formData.mobile_number}
                onChange={(e) => setFormData({...formData, mobile_number: e.target.value})}
                required
                readOnly // Pre-filled from lead
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="university">
              <Form.Label>University Name</Form.Label>
              <Form.Select
                value={formData.university_id}
                onChange={(e) => setFormData({...formData, university_id: e.target.value})}
              >
                <option value="">Select university</option>
                {universities?.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="identifyingName">
              <Form.Label>Student Identifying Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.identifying_name}
                onChange={(e) => setFormData({...formData, identifying_name: e.target.value})}
                placeholder="e.g., Rahim Harvard Deb"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="gender">
              <Form.Label>Gender</Form.Label>
              <div>
                {["Male", "Female", "Other"].map((g) => (
                  <Form.Check
                    inline
                    key={g}
                    type="radio"
                    label={g}
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select category</option>
                <option value="General">General</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter complete address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-3">
          <Button variant="secondary" onClick={resetForm} className="me-2">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? "Update" : "Submit"}
          </Button>
        </div>
      </Form>
    </Modal.Body>
  </Modal>

        {/* Lead Details Modal */}
    <Modal
  show={showLeadDetailsModal}
  onHide={() => setShowLeadDetailsModal(false)}
  centered
  size="lg"
>
  <Modal.Header closeButton>
    <Modal.Title>Lead Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedLead && (
      <div>
        {/* Personal Information */}
        <h5 className="mb-3">Personal Information</h5>
        <Row className="mb-2">
          <Col md={6}><strong>Name:</strong> {selectedLead.full_name}</Col>
          <Col md={6}><strong>Email:</strong> {selectedLead.email}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Phone:</strong> {selectedLead.phone_number}</Col>
          <Col md={6}><strong>Gender:</strong> {selectedLead.gender}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Date of Birth:</strong> {selectedLead.date_of_birth?.slice(0, 10)}</Col>
          <Col md={6}><strong>City:</strong> {selectedLead.city}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Address:</strong> {selectedLead.address}</Col>
          <Col md={6}><strong>Present Address:</strong> {selectedLead.present_address}</Col>
        </Row>

        {/* Inquiry Info */}
        <h5 className="mt-4 mb-3">Inquiry Details</h5>
        <Row className="mb-2">
          <Col md={6}><strong>Inquiry Type:</strong> {selectedLead.inquiry_type}</Col>
          <Col md={6}><strong>Source:</strong> {selectedLead.source}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Branch:</strong> {selectedLead.branch}</Col>
          <Col md={6}><strong>Country:</strong> {selectedLead.country}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Course Name:</strong> {selectedLead.course_name}</Col>
          <Col md={6}><strong>Status:</strong> {selectedLead.lead_status}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Payment Status:</strong> {selectedLead.payment_status}</Col>
          <Col md={6}><strong>Eligibility Status:</strong> {selectedLead.eligibility_status}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Follow-Up Date:</strong> {selectedLead.follow_up_date?.slice(0, 10) || "N/A"}</Col>
          <Col md={6}><strong>Date of Inquiry:</strong> {selectedLead.date_of_inquiry?.slice(0, 10)}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Created At:</strong> {selectedLead.created_at?.slice(0, 10)}</Col>
          <Col md={6}><strong>Updated At:</strong> {selectedLead.updated_at?.slice(0, 10)}</Col>
        </Row>

        {/* Education Background */}
        <h5 className="mt-4 mb-3">Education Background</h5>
        <Row className="mb-2">
          <Col md={6}><strong>Highest Level:</strong> {selectedLead.highest_level}</Col>
          <Col md={6}><strong>Study Level:</strong> {selectedLead.study_level}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Study Field:</strong> {selectedLead.study_field}</Col>
          <Col md={6}><strong>Intake:</strong> {selectedLead.intake}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Budget:</strong> {selectedLead.budget}</Col>
          <Col md={6}><strong>University:</strong> {selectedLead.university}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Study Gap:</strong> {selectedLead.study_gap}</Col>
          <Col md={6}><strong>Visa Refused:</strong> {selectedLead.visa_refused}</Col>
        </Row>
        {selectedLead.visa_refused === "yes" && (
          <Row className="mb-2">
            <Col md={12}><strong>Refusal Reason:</strong> {selectedLead.refusal_reason}</Col>
          </Row>
        )}

        {/* English Proficiency */}
        <h5 className="mt-4 mb-3">English Proficiency</h5>
        <Row className="mb-2">
          <Col md={6}><strong>Test Type:</strong> {selectedLead.test_type}</Col>
          <Col md={6}><strong>Overall Score:</strong> {selectedLead.overall_score}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={3}><strong>Reading:</strong> {selectedLead.reading_score}</Col>
          <Col md={3}><strong>Writing:</strong> {selectedLead.writing_score}</Col>
          <Col md={3}><strong>Speaking:</strong> {selectedLead.speaking_score}</Col>
          <Col md={3}><strong>Listening:</strong> {selectedLead.listening_score}</Col>
        </Row>

        {/* Work Experience */}
        <h5 className="mt-4 mb-3">Work Experience</h5>
        <Row className="mb-2">
          <Col md={6}><strong>Company Name:</strong> {selectedLead.company_name}</Col>
          <Col md={6}><strong>Job Title:</strong> {selectedLead.job_title}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Job Duration:</strong> {selectedLead.job_duration}</Col>
        </Row>

        {/* Additional Info */}
        <h5 className="mt-4 mb-3">Additional Info</h5>
        <Row className="mb-2">
          {/* <Col md={6}><strong>Preferred Countries:</strong> {selectedLead.preferred_countries}</Col> */}
                    <Col md={6}><strong>Counselor Name:</strong> {selectedLead.counselor_name}</Col>
          <Col md={6}><strong>Notes:</strong> {selectedLead.notes}</Col>
        </Row>
        <Row className="mb-2">

          {/* <Col md={6}><strong>Assignment Description:</strong> {selectedLead.assignment_description}</Col> */}
        </Row>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowLeadDetailsModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

{/* showfollowup modal */}

<Modal show={showFollowUpModal} onHide={() => setShowFollowUpModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Add Follow-Up</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedLead && (
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Follow-Up Date</Form.Label>
          <Form.Control type="date" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Follow-Up Notes</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Enter notes..." />
        </Form.Group>
        {/* Random field example */}
        <Form.Group className="mb-3">
          <Form.Label>Next Action</Form.Label>
          <Form.Control type="text" placeholder="e.g. Call, Email, Meeting" />
        </Form.Group>
      </Form>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowFollowUpModal(false)}>
      Cancel
    </Button>
    <Button variant="primary">
      Save
    </Button>
  </Modal.Footer>
</Modal>



<Modal show={showNotesModal} onHide={() => setShowNotesModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Add Notes</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedLead && (
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Notes</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder="Write your notes here..." />
        </Form.Group>
        {/* Random field example */}
        <Form.Group className="mb-3">
          <Form.Label>Note Type</Form.Label>
          <Form.Select>
            <option value="">Select Type</option>
            <option value="General">General</option>
            <option value="Follow-Up">Follow-Up</option>
            <option value="Important">Important</option>
          </Form.Select>
        </Form.Group>
      </Form>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowNotesModal(false)}>
      Cancel
    </Button>
    <Button variant="primary">
      Save
    </Button>
  </Modal.Footer>
</Modal>


      </div>
    </div>
  );
};

export default LeadTable;