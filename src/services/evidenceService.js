import API from "./api";

export const getEvidenceByComplaintId = async (complaintId) => {
  const response = await API.get(
    `/public/evidence/complaint/${complaintId}`
  );

  return response.data;
};