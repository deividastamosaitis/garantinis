import React from "react";
import { useLoaderData, Form, redirect } from "react-router-dom";
import customFetch from "../utils/customFetch.js";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/prekes");
    return { data };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const userId = localStorage.getItem("userId"); // Get user ID from localStorage
  const newPreke = Object.fromEntries(formData);

  try {
    await customFetch.post("/prekes", {
      ...newPreke,
      createdBy: userId, // Include the user ID
    });
    toast.success("Prekė sėkmingai pridėta");
    return redirect("/garantinis/prekes");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Prekes = () => {
  const { data } = useLoaderData();
  const { prekes } = data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Prekių valdymas</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Pridėti naują prekę</h2>
        <Form method="post" className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="barkodas"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Barkodas
            </label>
            <input
              type="text"
              id="barkodas"
              name="barkodas"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="pavadinimas"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pavadinimas
            </label>
            <input
              type="text"
              id="pavadinimas"
              name="pavadinimas"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Pridėti prekę
            </button>
          </div>
        </Form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Prekių sąrašas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barkodas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pavadinimas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Redaguoti
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prekes.map((preke) => (
                <tr key={preke._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {preke.barkodas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {preke.pavadinimas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <i class="fa-regular fa-pen-to-square"></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Prekes;
