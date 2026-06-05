import { useContext } from "react";

import { ComplaintContext } from "../context/complaintContextObject";


export const useComplaint = () => {

  return useContext(ComplaintContext);

};