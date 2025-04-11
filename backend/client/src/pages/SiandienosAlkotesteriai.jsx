import { useLoaderData } from "react-router-dom";
import AlkotesteriuSarasas from "../components/AlkotesteriuSarasas";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/alkotesteriai/today");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
};

export default function SiandienosAlkotesteriai() {
  const { alkotesteriai } = useLoaderData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Šiandien registruoti alkotesteriai
      </h1>
      <AlkotesteriuSarasas alkotesteriai={alkotesteriai} />
    </div>
  );
}
