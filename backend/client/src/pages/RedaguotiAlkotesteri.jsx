import { Form, useLoaderData, useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/alkotesteriai/${params.id}`);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
};

export const updateAlkotesterisAction = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.patch(`/alkotesteriai/${params.id}`, data);
    toast.success("Alkotesterio duomenys sėkmingai atnaujinti");
    return null;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

export default function RedaguotiAlkotesteri() {
  const { alkotesteris } = useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(-1);
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Redaguoti alkotesterį</h1>

      <Form method="patch" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="mb-4">
          <label className="block mb-2">Alkotesterio pavadinimas</label>
          <input
            type="text"
            name="deviceName"
            defaultValue={alkotesteris.deviceName}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Serijos numeris</label>
          <input
            type="text"
            name="serialNumber"
            defaultValue={alkotesteris.serialNumber}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Kliento vardas</label>
          <input
            type="text"
            name="clientName"
            defaultValue={alkotesteris.clientName}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Telefono numeris</label>
          <input
            type="tel"
            name="clientPhone"
            defaultValue={alkotesteris.clientPhone}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Papildoma info</label>
          <input
            type="text"
            name="info"
            defaultValue={alkotesteris.info}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Išsaugoti pakeitimus
        </button>
      </Form>
    </div>
  );
}
