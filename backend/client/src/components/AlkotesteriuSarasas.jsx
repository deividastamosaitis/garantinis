import React from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useState } from "react";
import { Form, Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { formatDateTime } from "../utils/formatDateTime";

export default function AlkotesteriuSarasas({ alkotesteriai }) {
  const statusOptions = ["registruota", "kalibruojama", "grįžęs", "atiduota"];
  const [sendingId, setSendingId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "atiduota":
        return "bg-green-100"; // Žalia
      case "kalibruojama":
        return "bg-blue-100"; // Mėlyna
      case "grįžęs":
        return "bg-yellow-100"; // Geltona
      default:
        return ""; // Nėra spalvos (registruota)
    }
  };

  const sendSms = async (id) => {
    try {
      setSendingId(id);
      const { data } = await customFetch.post(`/alkotesteriai/${id}/sms`, {});
      toast.success(data?.message || "SMS išsiųsta");
      setTimeout(() => window.location.reload(), 200); // atnaujina lastSmsSentAt stulpelį
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Nepavyko išsiųsti SMS. Patikrink konfigūraciją."
      );
    } finally {
      setSendingId(null);
    }
  };

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
            <th className="py-2 px-4 border">SMS išsiųsta</th>
            <th className="py-2 px-4 border">Papildoma info</th>
            <th className="py-2 px-4 border">Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {alkotesteriai?.map((alkotesteris) => (
            <tr
              key={alkotesteris._id}
              className={getStatusColor(alkotesteris.status)}
            >
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
              <td className="py-2 px-4 border">
                {formatDateTime(alkotesteris.lastSmsSentAt)}
              </td>
              <td className="py-2 px-4 border">{alkotesteris.info}</td>
              <td className="py-2 px-4 border flex gap-2 items-center">
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

                {alkotesteris.status === "grįžęs" && (
                  <button
                    onClick={() => sendSms(alkotesteris._id)}
                    disabled={sendingId === alkotesteris._id}
                    className="bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700 disabled:opacity-50"
                    title="Išsiųsti SMS klientui"
                  >
                    {sendingId === alkotesteris._id
                      ? "Siunčiama..."
                      : "Siųsti SMS"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
