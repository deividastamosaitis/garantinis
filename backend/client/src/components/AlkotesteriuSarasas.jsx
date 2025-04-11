import React from "react";
import { Form, Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

export default function AlkotesteriuSarasas({ alkotesteriai }) {
  const statusOptions = ["registruota", "kalibruojama", "grįžęs", "atiduota"];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Data</th>
            <th className="py-2 px-4 border">Pavadinimas</th>
            <th className="py-2 px-4 border">Serijos nr.</th>
            <th className="py-2 px-4 border">Klientas</th>
            <th className="py-2 px-4 border">Tel. nr.</th>
            <th className="py-2 px-4 border">Būsena</th>
            <th className="py-2 px-4 border">Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {alkotesteriai?.map((alkotesteris) => (
            <tr key={alkotesteris._id}>
              <td className="py-2 px-4 border">
                {formatDate(alkotesteris.registrationDate)}
              </td>
              <td className="py-2 px-4 border">{alkotesteris.deviceName}</td>
              <td className="py-2 px-4 border">{alkotesteris.serialNumber}</td>
              <td className="py-2 px-4 border">{alkotesteris.clientName}</td>
              <td className="py-2 px-4 border">{alkotesteris.clientPhone}</td>
              <td className="py-2 px-4 border">
                <Form
                  method="patch"
                  action={`/garantinis/alkotesteriai/${alkotesteris._id}/status`}
                >
                  <select
                    name="status"
                    defaultValue={alkotesteris.status}
                    onChange={(e) => e.target.form.requestSubmit()}
                    className="p-1 border rounded"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </Form>
              </td>
              <td className="py-2 px-4 border flex gap-2">
                <Link
                  to={`/garantinis/alkotesteriai/${alkotesteris._id}/redaguoti`}
                  className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                >
                  Redaguoti
                </Link>
                <Form
                  method="delete"
                  action={`/garantinis/alkotesteriai/${alkotesteris._id}/istrinti`}
                >
                  <button
                    type="submit"
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    onClick={(e) => {
                      if (
                        !confirm("Ar tikrai norite ištrinti šį alkotesterį?")
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Ištrinti
                  </button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
