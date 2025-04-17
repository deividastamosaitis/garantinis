import { redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`/api/rma/${params.id}`);
    toast.success("RMA įrašas sėkmingai ištrintas");
    return {
      success: true,
      redirect: "/garantinis/rma",
    };
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Klaida trinant RMA įrašą");
    return { success: false };
  }
};
