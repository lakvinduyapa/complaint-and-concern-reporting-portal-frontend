import API from "./api";


// ========================================
// Upload Evidence
// ========================================

export const uploadEvidence = async (formData) => {
  try {

    const response = await API.post(

      "/public/evidence/upload",

      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }

    );

    return response.data;

  } catch (error) {

    throw error.response?.data || {
      message: error.message || "Failed to upload evidence"
    };

  }

};