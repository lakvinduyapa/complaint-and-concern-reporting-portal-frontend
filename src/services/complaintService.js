import API from "./api";

// ========================================
// Submit Complaint
// ========================================
export const submitComplaint = async (complaintData) => {
  try {
    const response = await API.post(
      "/public/complaints",
      complaintData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: error.message || "Failed to submit complaint",
    };
  }
};

// ========================================
// Upload Multiple Evidence Files
// ========================================
export const uploadEvidence = async ({
  complaintId,
  files,
  evidenceType = "Document",
  notes = "",
}) => {
  try {
    const formData = new FormData();

    formData.append("complaintId", complaintId);
    formData.append("evidenceType", evidenceType);
    formData.append("notes", notes);

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await API.post(
      "/public/evidence/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: error.message || "Failed to upload evidence",
    };
  }
};