import { Form, redirect, useLoaderData, Link } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/rma/${params.id}`);
    return data;
  } catch (error) {
    throw new Error("Klaida įkraunant RMA įrašą redagavimui");
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.patch(`/rma/${params.id}`, {
      status: data.status,
      notified: data.notified,
      epromaRMA: data.epromaRMA,
      additionalInfo: data.additionalInfo,
    });
    toast.success("RMA įrašas sėkmingai atnaujintas");
    return redirect(`/garantinis/rma/${params.id}`);
  } catch (error) {
    toast.error("Klaida atnaujinant RMA įrašą");
    return error;
  }
};

const RMAEdit = () => {
  const { product } = useLoaderData();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Redaguoti RMA įrašą</h2>

      <Form method="post" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Būsena*</label>
            <select
              name="status"
              defaultValue={product.status}
              className="w-full p-2 border rounded"
              required
            >
              <option value="registered">Registruota</option>
              <option value="sent">Išvykęs</option>
              <option value="returned">Grįžęs</option>
              <option value="credit">Kreditas</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Klientui pranešta*</label>
            <select
              name="notified"
              defaultValue={product.notified}
              className="w-full p-2 border rounded"
              required
            >
              <option value="notified">Pranešta</option>
              <option value="not_notified">Nepranešta</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1">Eproma.lt RMA kodas</label>
          <input
            type="text"
            name="epromaRMA"
            defaultValue={product.epromaRMA || ""}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Papildoma informacija</label>
          <textarea
            name="additionalInfo"
            defaultValue={product.additionalInfo || ""}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Išsaugoti
          </button>
          <Link
            to={`/garantinis/rma/${product._id}`}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Atšaukti
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default RMAEdit;
