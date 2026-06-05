import { useEffect, useState } from "react";

import { ComplaintContext } from "./complaintContextObject";


// ========================================
// Complaint Provider
// ========================================

const DRAFT_STORAGE_KEY = "complaintPortalDraft";

const defaultComplaintData = {

  // ====================================
  // Reporter Information
  // ====================================

  reporter: {

    submissionType: "named",

    reporterCategory: "",

    fullName: "",

    employeeId: "",

    department: "",

    designation: "",

    email: "",

    phone: "",

    preferredContactMethod: ""

  },


  // ====================================
  // Complaint Information
  // ====================================

  complaint: {

    category: "",

    incidentDate: "",

    incidentEndDate: "",

    incidentLocation: "",

    frequency: "",

    awarenessMethod: "",

    description: "",

    previouslyReported: false,

    previousReportedTo: "",

    previousReportOutcome: ""

  },


  // ====================================
  // Subject Information
  // ====================================

  subjects: [

    {

      fullName: "",

      designation: "",

      organisation: "",

      relationship: "",

      seniorManagementInvolved: false,

      seniorManagementPersonName: ""

    }

  ],


  // ====================================
  // Evidence Information
  // ====================================

  evidence: {

    hasEvidence: false,

    evidenceTypes: [],

    witnessInfo: "",

    additionalNotes: "",

    files: []

  },


  // ====================================
  // Declaration
  // ====================================

  declaration: {

    truthful: false,

    consent: false,

    auditAcknowledgement: false

  }

};

const hydrateComplaintData = (storedData) => {
  if (!storedData || typeof storedData !== "object") {
    return defaultComplaintData;
  }

  return {
    ...defaultComplaintData,
    ...storedData,
    reporter: {
      ...defaultComplaintData.reporter,
      ...(storedData.reporter || {})
    },
    complaint: {
      ...defaultComplaintData.complaint,
      ...(storedData.complaint || {})
    },
    subjects: Array.isArray(storedData.subjects) && storedData.subjects.length > 0
      ? storedData.subjects
      : defaultComplaintData.subjects,
    evidence: {
      ...defaultComplaintData.evidence,
      ...(storedData.evidence || {}),
      files: []
    },
    declaration: {
      ...defaultComplaintData.declaration,
      ...(storedData.declaration || {})
    }
  };
};

const loadDraft = () => {
  if (typeof window === "undefined") {
    return defaultComplaintData;
  }

  try {
    const savedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);

    if (!savedDraft) {
      return defaultComplaintData;
    }

    return hydrateComplaintData(JSON.parse(savedDraft));
  } catch {
    return defaultComplaintData;
  }
};

export const ComplaintProvider = ({ children }) => {

  const [complaintData, setComplaintData] = useState(loadDraft);

  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(complaintData));
    } catch {
      // Ignore storage failures and continue with in-memory state.
    }
  }, [complaintData]);

  const clearComplaintDraft = () => {
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
  };

  const resetComplaintDraft = () => {
    setComplaintData(defaultComplaintData);
  };


  return (

    <ComplaintContext.Provider
      value={{
        complaintData,
        setComplaintData,
        submissionResult,
        setSubmissionResult,
        clearComplaintDraft,
        resetComplaintDraft
      }}
    >

      {children}

    </ComplaintContext.Provider>

  );

};