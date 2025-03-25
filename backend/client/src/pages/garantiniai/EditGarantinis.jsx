import React from "react";
import { Form, useLoaderData, redirect, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/garantinis/${params.id}`);
    return data; // API returns { garantinis: {...} }
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Failed to load garantinis");
    throw new Response("Not Found", { status: 404 });
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const updates = {
    klientas: {
      vardas: formData.get("klientas.vardas"),
      telefonas: formData.get("klientas.telefonas"),
      miestas: formData.get("klientas.miestas"),
    },
    atsiskaitymas: formData.get("atsiskaitymas"),
    saskaita: formData.get("saskaita"),
    prekes: [],
  };

  // Process prekes array
  let index = 0;
  while (true) {
    const barkodas = formData.get(`prekes[${index}].barkodas`);
    if (!barkodas) break;

    updates.prekes.push({
      barkodas,
      pavadinimas: formData.get(`prekes[${index}].pavadinimas`),
      serial: formData.get(`prekes[${index}].serial`),
      kaina: parseFloat(formData.get(`prekes[${index}].kaina`)),
    });
    index++;
  }

  try {
    await customFetch.patch(`/garantinis/${params.id}`, updates);
    toast.success("Garantinis sėkmingai atnaujintas");
    return redirect("/garantinis/d_statistika");
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Klaida atnaujinant");
    return null;
  }
};

const EditGarantinis = () => {
  const { garantinis } = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Redaguoti garantinį</h2>
      <Form method="post" className="space-y-4">
        {/* Klientas fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Vardas:</label>
            <input
              type="text"
              name="klientas.vardas"
              defaultValue={garantinis.klientas.vardas}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Telefonas:</label>
            <input
              type="text"
              name="klientas.telefonas"
              defaultValue={garantinis.klientas.telefonas}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Miestas:</label>
            <input
              type="text"
              name="klientas.miestas"
              defaultValue={garantinis.klientas.miestas}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Payment and invoice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Atsiskaitymo būdas:</label>
            <select
              name="atsiskaitymas"
              defaultValue={garantinis.atsiskaitymas}
              className="w-full p-2 border rounded"
              required
            >
              <option value="grynais">Grynais</option>
              <option value="kortele">Kortele</option>
              <option value="pavedimu">Pavedimu</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Sąskaitos numeris:</label>
            <input
              type="text"
              name="saskaita"
              defaultValue={garantinis.saskaita}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Prekės list */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Prekės:</h3>
          {garantinis.prekes.map((preke, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block mb-1">Barkodas:</label>
                  <input
                    type="text"
                    name={`prekes[${index}].barkodas`}
                    defaultValue={preke.barkodas}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Pavadinimas:</label>
                  <input
                    type="text"
                    name={`prekes[${index}].pavadinimas`}
                    defaultValue={preke.pavadinimas}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Kaina:</label>
                  <input
                    type="number"
                    step="0.01"
                    name={`prekes[${index}].kaina`}
                    defaultValue={preke.kaina}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Serijos numeris:</label>
                  <input
                    type="text"
                    name={`prekes[${index}].serial`}
                    defaultValue={preke.serial}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={isSubmitting}
          >
            Atšaukti
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Išsaugoma..." : "Išsaugoti pakeitimus"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default EditGarantinis;
