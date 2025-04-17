// pages/rma/RMACreate.jsx
import { Form, redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/rma", {
      customerData: {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
      },
      productData: {
        name: data.productName,
        serialNumber: data.serialNumber,
        accessories: data.accessories,
        status: data.status,
        notified: data.notified,
        epromaRMA: data.epromaRMA,
        additionalInfo: data.additionalInfo,
      },
    });
    toast.success("RMA įrašas sėkmingai sukurtas");
    return redirect("/garantinis/rma");
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Klaida kuriant RMA įrašą");
    return error;
  }
};

const RMACreate = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Naujas RMA įrašas</h1>

      <Form method="post" className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Prekės informacija</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prekės pavadinimas*
              </label>
              <input
                type="text"
                name="productName"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serijos numeris*
              </label>
              <input
                type="text"
                name="serialNumber"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Komplektacija
            </label>
            <input
              type="text"
              name="accessories"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Kliento informacija</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vardas*
              </label>
              <input
                type="text"
                name="customerName"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefonas*
              </label>
              <input
                type="tel"
                name="customerPhone"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              El. paštas
            </label>
            <input
              type="email"
              name="customerEmail"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">RMA nustatymai</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Būsena*
              </label>
              <select
                name="status"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                defaultValue="registered"
                required
              >
                <option value="registered">Registruota</option>
                <option value="sent">Išvykęs</option>
                <option value="returned">Grįžęs</option>
                <option value="credit">Kreditas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Klientui pranešta*
              </label>
              <select
                name="notified"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                defaultValue="not_notified"
                required
              >
                <option value="notified">Pranešta</option>
                <option value="not_notified">Nepranešta</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eproma.lt RMA kodas
            </label>
            <input
              type="text"
              name="epromaRMA"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Papildoma informacija
            </label>
            <textarea
              name="additionalInfo"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Atšaukti
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sukurti RMA įrašą
          </button>
        </div>
      </Form>
    </div>
  );
};

export default RMACreate;
