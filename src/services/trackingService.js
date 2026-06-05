import API from "./api";


// ========================================
// Track Complaint By CRN
// ========================================

export const trackComplaintByCRN = async (crn) => {

  try {

    const response = await API.get(

      `/public/tracking/${crn}`

    );

    return response.data;

  } catch (error) {

    throw error.response?.data || {
      message: "Tracking failed"
    };

  }

};