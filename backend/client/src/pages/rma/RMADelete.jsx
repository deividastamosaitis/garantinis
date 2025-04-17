import { redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`/rma/${params.id}`);
    toast.success("RMA įrašas sėkmingai ištrintas");
    return redirect("/garantinis/rma");
  } catch (error) {
    toast.error("Klaida trinant RMA įrašą");
    return error;
  }
};
