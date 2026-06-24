import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import "../../assets/style.css";

const reporterCategories = [
  "Employee",
  "Employee - Mobitel",
  "Employee - SLTS",
  "Vendor",
  "Supplier",
  "Contractor",
  "Customer",
  "Shareholder",
  "Investor",
  "General Public",
  "Other",
];

const complaintCategories = [
  "Bribery",
  "Corruption",
  "Fraud",
  "Financial Misconduct",
  "Abuse of Authority or Position",
  "Misappropriation of Public or Company Property",
  "Conflict of Interest",
  "Procurement Irregularity",
  "Falsification of Records",
  "Harassment",
  "Workplace Misconduct",
  "Breach of Confidentiality",
  "Non-compliance with Policy or Regulation",
  "Other Malpractice",
];

const frequencyOptions = [
  "One-time Incident",
  "Repeated - periodic",
  "Ongoing",
  "Continuous",
  "Unknown",
];

const awarenessOptions = [
  "Direct witness",
  "Informed by another party",
  "Discovered through documents",
  "Other",
];

const organisationOptions = ["SLT", "Mobitel", "SLTS", "External", "Vendor", "Unknown"];

const relationshipOptions = [
  "Superior",
  "Manager",
  "Peer",
  "Colleague",
  "Subordinate",
  "External Party",
  "Unknown",
];

const evidenceOptions = [
  "Documents",
  "Records",
  "Email or Communication",
  "Photographs",
  "Videos / Audio",
  "Screenshots",
  "Transaction Records",
  "Other",
];

function ComplaintForm() {
  const [step, setStep] = useState(1);
  const [showEvidenceDropdown, setShowEvidenceDropdown] = useState(false);
  
  // succesfully submit,
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const evidenceDropdownRef = useRef(null);

  // --- reCAPTCHA state ---
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
  // .env file site key get
  const recaptchaSiteKey =import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // today YYYY-MM-DD structure (Future dates prevent)
  const today = new Date().toISOString().split('T')[0];

  const oneMonthAgoDate = new Date();
oneMonthAgoDate.setMonth(oneMonthAgoDate.getMonth() - 1);

const oneMonthAgo = oneMonthAgoDate.toISOString().split("T")[0];

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    submissionType: "",
    reporterCategory: "",
    fullName: "",
    staffId: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
    preferredContact: "",

    complaintCategory: "",
incidentDateMode: "",
incidentDate: "",
incidentFromDate: "",
incidentToDate: "",
location: "",
    frequency: "",
    description: "",
    awareness: "",
    previouslyReported: "",
    previousOutcome: "",

    subjectNames: "",
    subjectDesignation: "",
    subjectOrganisation: "",
    subjectRelationship: "",
    seniorManagementInvolved: "",
    seniorDetails: "",

    hasEvidence: "",
    evidenceTypes: [],
    evidenceFiles: [],
    witnessNames: "",
    additionalInfo: "",

    declarationConfirm: false,
    declarationAudit: false,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        evidenceDropdownRef.current &&
        !evidenceDropdownRef.current.contains(event.target)
      ) {
        setShowEvidenceDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset token if user unchecks or leaves step 5
  useEffect(() => {
    if (!formData.declarationConfirm || !formData.declarationAudit) {
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    }
  }, [formData.declarationConfirm, formData.declarationAudit]);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  };

  const isValidPhone = (phone) => {
    const cleanedPhone = phone.replace(/[\s-]/g, "");
    return /^(0[1-9]\d{8}|\+94[1-9]\d{8})$/.test(cleanedPhone);
  };

 
      
      // From Date change and reset to date
    const updateField = (name, value) => {
  setFormData((prev) => {
    const updatedData = { ...prev, [name]: value };

    // ✅ If user selects SINGLE DATE
    if (name === "incidentDateMode" && value === "single") {
      updatedData.incidentDate = "";
      updatedData.incidentFromDate = "";
      updatedData.incidentToDate = "";
    }

    // ✅ If user selects RANGE
    if (name === "incidentDateMode" && value === "range") {
      updatedData.incidentDate = "";
      updatedData.incidentFromDate = "";
      updatedData.incidentToDate = "";
    }

    // ✅ If from-date changes and breaks range
    if (
      name === "incidentFromDate" &&
      updatedData.incidentToDate &&
      updatedData.incidentToDate < value
    ) {
      updatedData.incidentToDate = "";
    }

    return updatedData;
  });

  setErrors((prev) => ({
    ...prev,
    incidentDateMode: "",
    incidentDate: "",
    incidentFromDate: "",
    incidentToDate: "",
  }));
};

  const handleSubmissionType = (value) => {
    setFormData((prev) => ({
      ...prev,
      submissionType: value,
      ...(value === "anonymous"
        ? {
            fullName: "",
            staffId: "",
            department: "",
            designation: "",
            email: "",
            phone: "",
            preferredContact: "",
          }
        : {}),
    }));
    setErrors((prev) => ({ ...prev, submissionType: "" }));
  };

  const handlePreviouslyReported = (value) => {
    setFormData((prev) => ({
      ...prev,
      previouslyReported: value,
      previousOutcome: value === "Yes" ? prev.previousOutcome : "",
    }));
    setErrors((prev) => ({ ...prev, previouslyReported: "", previousOutcome: "" }));
  };

  const handleSeniorManagement = (value) => {
    setFormData((prev) => ({
      ...prev,
      seniorManagementInvolved: value,
      seniorDetails: value === "Yes" ? prev.seniorDetails : "",
    }));
    setErrors((prev) => ({
      ...prev,
      seniorManagementInvolved: "",
      seniorDetails: "",
    }));
  };

  const handleEvidenceChoice = (value) => {
    setFormData((prev) => ({
      ...prev,
      hasEvidence: value,
      evidenceTypes: value === "Yes" ? prev.evidenceTypes : [],
      evidenceFiles: value === "Yes" ? prev.evidenceFiles : [],
    }));

    if (value === "No") {
      setShowEvidenceDropdown(false);
    }

    setErrors((prev) => ({
      ...prev,
      hasEvidence: "",
      evidenceTypes: "",
    }));
  };

  const toggleEvidenceType = (type) => {
    setFormData((prev) => {
      const alreadySelected = prev.evidenceTypes.includes(type);

      return {
        ...prev,
        evidenceTypes: alreadySelected
          ? prev.evidenceTypes.filter((item) => item !== type)
          : [...prev.evidenceTypes, type],
      };
    });

    setErrors((prev) => ({ ...prev, evidenceTypes: "" }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.submissionType) {
        newErrors.submissionType = "Please select submission type.";
      }

      if (!formData.reporterCategory) {
        newErrors.reporterCategory = "Please select reporter category.";
      }

      if (formData.submissionType === "named") {
        if (!formData.fullName.trim()) {
          newErrors.fullName = "Full name is required.";
        }

        if (!formData.email.trim()) {
          newErrors.email = "Email address is required.";
        } else if (!isValidEmail(formData.email)) {
          newErrors.email = "Please enter a valid email address.";
        }

        if (!formData.phone.trim()) {
          newErrors.phone = "Phone number is required.";
        } else if (!isValidPhone(formData.phone)) {
          newErrors.phone = "Please enter a valid phone number. Example: 0712345678 or +94712345678";
        }
      }
    }

    if (step === 2) {
      if (!formData.complaintCategory) {
        newErrors.complaintCategory = "Please select complaint category.";
      }

      // NEW VALIDATION FOR INCIDENT DATE MODE
if (!formData.incidentDateMode) {
  newErrors.incidentDateMode = "Please select incident date option.";
}

if (formData.incidentDateMode === "single") {
  if (!formData.incidentDate) {
    newErrors.incidentDate = "Incident date is required.";
  } else if (formData.incidentDate < oneMonthAgo || formData.incidentDate > today) {
    newErrors.incidentDate =
      "Incident date must be within the last 1 month and cannot be a future date.";
  }
}

if (formData.incidentDateMode === "range") {
  if (!formData.incidentFromDate) {
    newErrors.incidentFromDate = "Incident from date is required.";
  } else if (formData.incidentFromDate < oneMonthAgo || formData.incidentFromDate > today) {
    newErrors.incidentFromDate =
      "Incident from date must be within the last 1 month and cannot be a future date.";
  }

  if (!formData.incidentToDate) {
    newErrors.incidentToDate = "Incident to date is required.";
  } else if (formData.incidentToDate < oneMonthAgo || formData.incidentToDate > today) {
    newErrors.incidentToDate =
      "Incident to date must be within the last 1 month and cannot be a future date.";
  }

  if (
    formData.incidentFromDate &&
    formData.incidentToDate &&
    formData.incidentToDate < formData.incidentFromDate
  ) {
    newErrors.incidentToDate =
      "Incident to date cannot be before incident from date.";
  }
}

      if (!formData.location.trim()) {
        newErrors.location = "Location is required.";
      }

      if (!formData.frequency) {
        newErrors.frequency = "Please select frequency.";
      }

      const descriptionLength = formData.description.trim().length;

      if (descriptionLength < 50) {
        newErrors.description = "Description must be at least 50 characters.";
      } else if (descriptionLength > 200) {
        newErrors.description = "Description cannot exceed 200 characters.";
      }

      if (!formData.awareness) {
        newErrors.awareness = "Please select how you became aware.";
      }

      if (!formData.previouslyReported) {
        newErrors.previouslyReported = "Please select Yes or No.";
      }

      if (formData.previouslyReported === "Yes" && !formData.previousOutcome.trim()) {
        newErrors.previousOutcome = "Please enter to whom it was reported and the outcome.";
      }
    }

    if (step === 3) {
      if (!formData.subjectNames.trim()) {
        newErrors.subjectNames = "Name of person involved is required.";
      }

      if (!formData.subjectOrganisation) {
        newErrors.subjectOrganisation = "Please select organization.";
      }

      if (!formData.subjectRelationship) {
        newErrors.subjectRelationship = "Please select relationship.";
      }

      if (!formData.seniorManagementInvolved) {
        newErrors.seniorManagementInvolved = "Please select Yes, No, or Unsure.";
      }

      if (formData.seniorManagementInvolved === "Yes" && !formData.seniorDetails.trim()) {
        newErrors.seniorDetails = "Please enter name(s) of senior personnel involved.";
      }
    }

    if (step === 4) {
      if (!formData.hasEvidence) {
        newErrors.hasEvidence = "Please select Yes or No.";
      }

      if (formData.hasEvidence === "Yes" && formData.evidenceTypes.length === 0) {
        newErrors.evidenceTypes = "Please select at least one evidence type.";
      }
    }

    if (step === 5) {
      if (!formData.declarationConfirm) {
        newErrors.declarationConfirm = "Please confirm the declaration.";
      }

      if (!formData.declarationAudit) {
        newErrors.declarationAudit = "Please confirm the audit statement.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrevious = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // backend submit section
  // backend submit section
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.declarationConfirm || !formData.declarationAudit) {
    alert("Please complete declarations first.");
    return;
    }

  if (validateStep()) {
    try {
      const payload = {
        category: formData.complaintCategory,

        incidentDate:
            formData.incidentDateMode === "single"
            ? formData.incidentDate
            : formData.incidentFromDate,

        incidentEndDate:
            formData.incidentDateMode === "range"
            ? formData.incidentToDate
            : null,

        incidentLocation: formData.location,

        frequency: formData.frequency,

        awarenessMethod: formData.awareness,

        description: formData.description,

        previouslyReported:
            formData.previouslyReported === "Yes",

        previousReportedTo: null,

        previousReportOutcome:
            formData.previousOutcome || null,

        reporter: {
            submissionType: formData.submissionType,
            reporterCategory: formData.reporterCategory,
            fullName: formData.fullName,
            employeeId: formData.staffId,
            department: formData.department,
            designation: formData.designation,
            email: formData.email,
            phone: formData.phone,
            preferredContactMethod:
            formData.preferredContact,
        },

        subjects: [
            {
            fullName: formData.subjectNames,
            designation:
                formData.subjectDesignation,

            organisation:
                formData.subjectOrganisation,

            relationship:
                formData.subjectRelationship,

            seniorManagementInvolved:
                formData.seniorManagementInvolved ===
                "Yes",

            seniorManagementPersonName:
                formData.seniorDetails,
            },
        ],
        };

      const response = await axios.post(
        "http://localhost:5001/api/public/complaints",
        payload
        );

      if (response.data.success) {
        const complaintId =
            response.data.data.complaintId;

        // Upload evidence files if available
        if (
            formData.hasEvidence === "Yes" &&
            formData.evidenceFiles.length > 0
        ) {
            const evidenceData = new FormData();

            evidenceData.append(
            "complaintId",
            complaintId
            );

            evidenceData.append(
            "evidenceType",
            formData.evidenceTypes.join(", ")
            );

            formData.evidenceFiles.forEach((file) => {
            evidenceData.append("files", file);
            });

            await axios.post(
            "http://localhost:5001/api/public/evidence/upload",
            evidenceData,
            {
                headers: {
                "Content-Type":
                    "multipart/form-data",
                },
            }
            );
        }

        setReferenceNumber(
            response.data.data.crn
        );

        setIsSubmitted(true);
        setIsSubmitted(true);
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error submitting complaint to database:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong while submitting the complaint. Please try again."
      );
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    }
  }
};

  const ErrorText = ({ name }) => {
    return errors[name] ? <p className="error-text" style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>{errors[name]}</p> : null;
  };

  const handleResetForm = () => {
    setFormData({
      submissionType: "",
      reporterCategory: "",
      fullName: "",
      staffId: "",
      department: "",
      designation: "",
      email: "",
      phone: "",
      preferredContact: "",
      complaintCategory: "",
incidentDateMode: "",
incidentDate: "",
incidentFromDate: "",
incidentToDate: "",
location: "",
      frequency: "",
      description: "",
      awareness: "",
      previouslyReported: "",
      previousOutcome: "",
      subjectNames: "",
      subjectDesignation: "",
      subjectOrganisation: "",
      subjectRelationship: "",
      seniorManagementInvolved: "",
      seniorDetails: "",
      hasEvidence: "",
      evidenceTypes: [],
      evidenceFiles: [],
      witnessNames: "",
      additionalInfo: "",
      declarationConfirm: false,
      declarationAudit: false,
    });
    setErrors({});
    setIsSubmitted(false);
    setRecaptchaToken(null);
    recaptchaRef.current?.reset();
    setStep(1);
  };

  return (
    <main className={`complaint-page ${isSubmitted ? "success-bg" : ""}`}>
      <div className="complaint-bg">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <section className="complaint-wrapper">
        {isSubmitted ? (
          <div className="success-card-container">
            <div className="success-icon-wrap">
              <div className="success-checkmark">✓</div>
            </div>
            
            <h1 className="success-title">Successfully Submitted!</h1>
            <p className="success-subtext">
              Your complaint / concern has been securely submitted to the <span className="highlight-text">Internal Affairs Unit (IAU)</span>.
            </p>

            <div className="crn-box">
              <span className="crn-label">COMPLAINT REFERENCE NUMBER</span>
              <div className="crn-value">{referenceNumber}</div>
            </div>

            <p className="crn-instruction">
              Please save this reference number for future follow-up and tracking purposes.
            </p>

            <div className="info-badges">
              <span className="badge">🔒 Secure Submission</span>
              <span className="badge">📄 Confidential Reporting</span>
              <span className="badge">✅ Successfully Recorded</span>
            </div>

            <div className="success-actions">
              <Link to="/" className="btn-home">Back to Home</Link>
              <button type="button" className="btn-another" onClick={handleResetForm}>
                Submit Another
              </button>
            </div>
          </div>
        ) : (
          <form className="complaint-card" onSubmit={handleSubmit}>
            <div className="back-home-wrap">
              <Link to="/" className="back-home-btn">
                ← Back to Home
              </Link>
            </div>

            <div className="complaint-heading">
              <h1>Complaint & Concern Reporting Form</h1>
              <p>Internal Affairs Unit - SLTMobitel</p>
            </div>

            <div className="form-steps">
              <div className={`step ${step === 1 ? "active" : ""}`}>1 Reporter</div>
              <div className={`step ${step === 2 ? "active" : ""}`}>2 Complaint</div>
              <div className={`step ${step === 3 ? "active" : ""}`}>3 Subject</div>
              <div className={`step ${step === 4 ? "active" : ""}`}>4 Evidence</div>
              <div className={`step ${step === 5 ? "active" : ""}`}>5 Declaration</div>
            </div>

            {step === 1 && (
              <div>
                <div className="section-title">
                  <h2>1. Reporter Information</h2>
                </div>

                <div className="form-group">
                  <label className="main-label">Submission Type</label>
                  <div className="radio-row">
                    {["anonymous", "named"].map((val) => (
                      <label className="radio-option" key={val}>
                        <input
                          type="radio"
                          name="submissionType"
                          value={val}
                          checked={formData.submissionType === val}
                          onChange={(e) => handleSubmissionType(e.target.value)}
                        />
                        <span>{val.charAt(0).toUpperCase() + val.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorText name="submissionType" />
                </div>

                <div className="form-group">
                  <label className="main-label">Reporter Category</label>
                  <select
                    className={errors.reporterCategory ? "input-error" : ""}
                    value={formData.reporterCategory}
                    onChange={(e) => updateField("reporterCategory", e.target.value)}
                  >
                    <option value="">Select</option>
                    {reporterCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ErrorText name="reporterCategory" />
                </div>

                {formData.submissionType === "named" && (
                  <div className="named-fields">
                    <div className="form-group">
                      <label className="main-label">Full Name</label>
                      <input
                        type="text"
                        className={errors.fullName ? "input-error" : ""}
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                      />
                      <ErrorText name="fullName" />
                    </div>

                    <div className="form-group">
                      <label className="main-label">Staff ID</label>
                      <input
                        type="text"
                        value={formData.staffId}
                        onChange={(e) => updateField("staffId", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="main-label">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => updateField("department", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="main-label">Designation</label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => updateField("designation", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="main-label">Email</label>
                      <input
                        type="email"
                        className={errors.email ? "input-error" : ""}
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="example@gmail.com"
                      />
                      <ErrorText name="email" />
                    </div>

                    <div className="form-group">
                      <label className="main-label">Phone</label>
                      <input
                        type="tel"
                        className={errors.phone ? "input-error" : ""}
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="0712345678 or +94712345678"
                      />
                      <ErrorText name="phone" />
                    </div>

                    <div className="form-group">
                      <label className="main-label">Preferred Contact</label>
                      <div className="radio-row">
                        {["Email", "Phone", "No contact preferred"].map((val) => (
                          <label className="radio-option" key={val}>
                            <input
                              type="radio"
                              name="preferredContact"
                              value={val}
                              checked={formData.preferredContact === val}
                              onChange={(e) => updateField("preferredContact", e.target.value)}
                            />
                            <span>{val}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="section-title">
                  <h2>2. Complaint Details</h2>
                </div>

                <div className="form-group">
                  <label className="main-label">Complaint Category</label>
                  <select
                    className={errors.complaintCategory ? "input-error" : ""}
                    value={formData.complaintCategory}
                    onChange={(e) => updateField("complaintCategory", e.target.value)}
                  >
                    <option value="">Select</option>
                    {complaintCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ErrorText name="complaintCategory" />
                </div>

                <div className="form-group">
  <label className="main-label">Incident Date</label>

  <div className="radio-row">
    <label className="radio-option">
      <input
        type="radio"
        name="incidentDateMode"
        value="single"
        checked={formData.incidentDateMode === "single"}
        onChange={(e) => updateField("incidentDateMode", e.target.value)}
      />
      Select Date
    </label>

    <label className="radio-option">
      <input
        type="radio"
        name="incidentDateMode"
        value="range"
        checked={formData.incidentDateMode === "range"}
        onChange={(e) => updateField("incidentDateMode", e.target.value)}
      />
      Select Date Range
    </label>
  </div>
</div>

{formData.incidentDateMode === "single" && (
  <div className="form-group">
   

    <input
      type="date"
      value={formData.incidentDate}
      max={today}
      min={oneMonthAgo}
      onChange={(e) => updateField("incidentDate", e.target.value)}
    />
  </div>
)}
{formData.incidentDateMode === "range" && (
  <>
    <div className="form-group">
      <label className="main-label">Incident From Date</label>

      <input
        type="date"
        value={formData.incidentFromDate}
        max={today}
        min={oneMonthAgo}
        onChange={(e) => updateField("incidentFromDate", e.target.value)}
      />
    </div>

    <div className="form-group">
      <label className="main-label">Incident To Date</label>

      <input
        type="date"
        value={formData.incidentToDate}
        max={today}
        min={formData.incidentFromDate || oneMonthAgo}
        onChange={(e) => updateField("incidentToDate", e.target.value)}
      />
    </div>
  </>
)}

                <div className="form-group">
                  <label className="main-label">Location</label>
                  <input
                    type="text"
                    className={errors.location ? "input-error" : ""}
                    value={formData.location}
                    placeholder="E.g. Procurement Unit, Head Office"
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                  <ErrorText name="location" />
                </div>

                <div className="form-group">
                  <label className="main-label">Frequency</label>
                  <select
                    className={errors.frequency ? "input-error" : ""}
                    value={formData.frequency}
                    onChange={(e) => updateField("frequency", e.target.value)}
                  >
                    <option value="">Select</option>
                    {frequencyOptions.map((frequency) => (
                      <option key={frequency} value={frequency}>
                        {frequency}
                      </option>
                    ))}
                  </select>
                  <ErrorText name="frequency" />
                </div>

                <div className="form-group">
                  <label className="main-label">Description</label>
                  <textarea
                    className={errors.description ? "input-error" : ""}
                    placeholder="Min 50, Max 200 characters required"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  ></textarea>
                  <small style={{ color: formData.description.length < 50 ? "orange" : "green" }}>
                    {formData.description.length}/200 characters (Minimum 50 required)
                  </small>
                  <ErrorText name="description" />
                </div>

                <div className="form-group">
                  <label className="main-label">How did you become aware?</label>
                  <div className="radio-row">
                    {awarenessOptions.map((value) => (
                      <label className="radio-option" key={value}>
                        <input
                          type="radio"
                          name="awareness"
                          value={value}
                          checked={formData.awareness === value}
                          onChange={(e) => updateField("awareness", e.target.value)}
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorText name="awareness" />
                </div>

                <div className="form-group">
                  <label className="main-label">Has this matter been reported previously?</label>
                  <div className="radio-row">
                    {["Yes", "No"].map((value) => (
                      <label className="radio-option" key={value}>
                        <input
                          type="radio"
                          name="previouslyReported"
                          value={value}
                          checked={formData.previouslyReported === value}
                          onChange={(e) => handlePreviouslyReported(e.target.value)}
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorText name="previouslyReported" />
                </div>

                {formData.previouslyReported === "Yes" && (
                  <div className="form-group conditional-box">
                    <label className="main-label">
                      If yes - to whom and what was the outcome?
                    </label>
                    <textarea
                      className={errors.previousOutcome ? "input-error" : ""}
                      value={formData.previousOutcome}
                      onChange={(e) => updateField("previousOutcome", e.target.value)}
                    ></textarea>
                    <ErrorText name="previousOutcome" />
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="section-title">
                  <h2>3. Subject / Person Involved</h2>
                </div>

                <div className="form-group">
                  <label className="main-label">Name(s) of Person(s) Involved</label>
                  <input
                    type="text"
                    className={errors.subjectNames ? "input-error" : ""}
                    placeholder="Multiple names separated by comma"
                    value={formData.subjectNames}
                    onChange={(e) => updateField("subjectNames", e.target.value)}
                  />
                  <ErrorText name="subjectNames" />
                </div>

                <div className="form-group">
                  <label className="main-label">Designation</label>
                  <input
                    type="text"
                    placeholder="E.g. DGM-Procurement Unit"
                    value={formData.subjectDesignation}
                    onChange={(e) => updateField("subjectDesignation", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="main-label">Organisation of subject(s)</label>
                  <select
                    className={errors.subjectOrganisation ? "input-error" : ""}
                    value={formData.subjectOrganisation}
                    onChange={(e) => updateField("subjectOrganisation", e.target.value)}
                  >
                    <option value="">Select Organization</option>
                    {organisationOptions.map((organisation) => (
                      <option key={organisation} value={organisation}>
                        {organisation}
                      </option>
                    ))}
                  </select>
                  <ErrorText name="subjectOrganisation" />
                </div>

                <div className="form-group">
                  <label className="main-label">Relationship of subject to Reporter</label>
                  <div className="radio-row">
                    {relationshipOptions.map((value) => (
                      <label className="radio-option" key={value}>
                        <input
                          type="radio"
                          name="subjectRelationship"
                          value={value}
                          checked={formData.subjectRelationship === value}
                          onChange={(e) => updateField("subjectRelationship", e.target.value)}
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorText name="subjectRelationship" />
                </div>

                <div className="form-group">
                  <label className="main-label">
                    Does the complaint involve senior management or any IAU member?
                  </label>
                  <div className="radio-row">
                    {["Yes", "No", "Unsure"].map((value) => (
                      <label className="radio-option" key={value}>
                        <input
                          type="radio"
                          name="seniorManagementInvolved"
                          value={value}
                          checked={formData.seniorManagementInvolved === value}
                          onChange={(e) => handleSeniorManagement(e.target.value)}
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorText name="seniorManagementInvolved" />
                </div>

                {formData.seniorManagementInvolved === "Yes" && (
                  <div className="conditional-box">
                    <div className="form-group">
                      <label className="main-label">
                        If yes, name(s) of senior personnel involved
                      </label>
                      <input
                        type="text"
                        className={errors.seniorDetails ? "input-error" : ""}
                        placeholder="Full names separated by comma"
                        value={formData.seniorDetails}
                        onChange={(e) => updateField("seniorDetails", e.target.value)}
                      />
                      <ErrorText name="seniorDetails" />
                    </div>

                    <div className="red-flag-box">
                      ⚠ CIABOC Escalation Required: This submission will be automatically routed
                      for direct escalation to CIABOC and flagged in the IAU case management system.
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="section-title">
                  <h2>4. Evidence / Supporting Information</h2>
                </div>

                <div className="form-group">
                  <label className="main-label">Do you have evidence?</label>
                  <div className="radio-row">
                    {["Yes", "No"].map((value) => (
                      <label className="radio-option" key={value}>
                        <input
                          type="radio"
                          name="hasEvidence"
                          value={value}
                          checked={formData.hasEvidence === value}
                          onChange={(e) => handleEvidenceChoice(e.target.value)}
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorText name="hasEvidence" />
                </div>

                {formData.hasEvidence === "Yes" && (
                  <div className="conditional-box">
                    <div className="form-group">
                      <label className="main-label">Evidence Type</label>

                      <div className="custom-multi-select" ref={evidenceDropdownRef}>
                        <button
                          type="button"
                          className={`multi-select-display ${errors.evidenceTypes ? "input-error" : ""}`}
                          onClick={() => setShowEvidenceDropdown((prev) => !prev)}
                        >
                          {formData.evidenceTypes.length > 0
                            ? formData.evidenceTypes.join(", ")
                            : "Select"}
                        </button>

                        {showEvidenceDropdown && (
                          <div className="multi-select-options">
                            {evidenceOptions.map((type) => (
                              <label className="multi-option" key={type}>
                                <input
                                  type="checkbox"
                                  checked={formData.evidenceTypes.includes(type)}
                                  onChange={() => toggleEvidenceType(type)}
                                />
                                <span>{type}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      <small>Click to select multiple options</small>
                      <ErrorText name="evidenceTypes" />
                    </div>

                    <div className="form-group">
                      <label className="main-label">Upload Files</label>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          updateField("evidenceFiles", Array.from(e.target.files))
                        }
                      />
                      <small>PDF, DOCX, JPG, PNG. Max 10MB per file</small>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="main-label">Name of Witness(es)</label>
                  <input
                    type="text"
                    placeholder="Names separated by comma"
                    value={formData.witnessNames}
                    onChange={(e) => updateField("witnessNames", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="main-label">Additional Information</label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => updateField("additionalInfo", e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <div className="section-title">
                  <h2>5. Declaration</h2>
                </div>

                <div className="declaration-box">
                  I hereby confirm that the Information provided is, to the best of my
                  knowledge, true and accurate. I understand that deliberate or malicious false
                  reports are treated seriously and may result in disciplinary action under
                  CEO&apos;s Circular No. 23/2026. I acknowledge that the IAU will treat this
                  submission with strict confidentiality and that no retaliation will be taken
                  against me for raising a genuine concern.
                </div>

                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData.declarationConfirm}
                    onChange={(e) => updateField("declarationConfirm", e.target.checked)}
                  />
                  <span>
                    I confirm the above declaration and consent to the IAU processing my
                    submission for investigation purposes. *
                  </span>
                </label>
                <ErrorText name="declarationConfirm" />

                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData.declarationAudit}
                    onChange={(e) => updateField("declarationAudit", e.target.checked)}
                  />
                  <span>
                    I understand that this portal is monitored and all submissions are logged
                    for audit purposes. *
                  </span>
                </label>
                <ErrorText name="declarationAudit" />

                {/* Show reCAPTCHA only if both checkboxes are checked */}
                {formData.declarationConfirm &&
                formData.declarationAudit && (
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                    <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={recaptchaSiteKey}
                    onChange={(token) => setRecaptchaToken(token)}
                    onExpired={() => setRecaptchaToken(null)}
                    onErrored={() => setRecaptchaToken(null)}
                    />
                </div>
                )}
              </div>
            )}

            <div className={`form-actions ${step === 1 ? "only-next" : ""}`}>
              {step > 1 && (
                <button type="button" className="prev-btn" onClick={goPrevious}>
                  Previous
                </button>
              )}

              {step < 5 && (
                <button type="button" className="next-btn" onClick={goNext}>
                  Next
                </button>
              )}

              {step === 5 && (
                <button 
                  type="submit" 
                  className="submit-complaint-btn"
                  disabled={!recaptchaToken}
                    style={{
                    opacity: recaptchaToken ? 1 : 0.6,
                    cursor: recaptchaToken ? "pointer" : "not-allowed",
                    }}
                >
                  Submit Complaint
                </button>
              )}
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default ComplaintForm;