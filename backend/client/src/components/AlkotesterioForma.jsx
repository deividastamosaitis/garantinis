import React from "react";
import { Form } from "react-router-dom";

export default function AlkotesterioForma() {
  return (
    <Form method="post" className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Alkotesterio pavadinimas</label>
          <input
            type="text"
            name="deviceName"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Serijos numeris</label>
          <input
            type="text"
            name="serialNumber"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Kliento vardas</label>
          <input
            type="text"
            name="clientName"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Telefono numeris</label>
          <input
            type="tel"
            name="clientPhone"
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Registruoti alkotesterį
      </button>
    </Form>
  );
}
