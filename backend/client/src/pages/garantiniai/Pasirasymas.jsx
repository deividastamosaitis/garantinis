import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { useParams, useLoaderData, useNavigate } from "react-router-dom";
import { salygosText } from "../../../../data/salygosText";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/garantinis/${params.id}`);
    console.log(data);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Nepavyko įkelti garantinio");
    throw new Response("Not Found", { status: 404 });
  }
};

const Pasirasymas = () => {
  const { id } = useParams();
  const { garantinis } = useLoaderData();
  const klientas = garantinis.klientas;
  const saskaita = garantinis.saskaita;
  const kvitas = garantinis.kvitas;
  const sigRef = useRef();

  const [pranesimas, setPranesimas] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const MAX_LENGTH = 800;
  const displayText = expanded ? salygosText : salygosText.slice(0, MAX_LENGTH);

  const handleSubmit = async () => {
    if (sigRef.current.isEmpty()) {
      setPranesimas("❗ Prašome pasirašyti");
      return;
    }

    const signature = sigRef.current.toDataURL();
    try {
      const res = await fetch(`/api/garantinis/${id}/signature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature }),
      });

      const data = await res.json();

      if (data.success) {
        setPranesimas("✅ Parašas sėkmingai išsaugotas");
        sigRef.current.clear();
        setSubmitted(true);

        // Po 2 sek. redirect į laukimą
        setTimeout(() => {
          navigate("/laukimas");
        }, 2000);
      } else {
        setPranesimas("❌ Nepavyko išsaugoti parašo");
      }
    } catch (err) {
      console.error(err);
      setPranesimas("❌ Klaida siunčiant duomenis");
    }
  };

  // ✅ Po pasirašymo – logotipas
  if (submitted) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img src="/logo.png" alt="GPSmeistras" className="w-64" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Pasirašymas dėl garantinio</h1>

      {/* Kliento informacija */}
      <div className="mb-4 text-sm bg-gray-100 p-4 rounded space-y-1">
        <p>
          <strong>Vardas:</strong> {klientas?.vardas}
        </p>
        <p>
          <strong>Telefonas:</strong> {klientas?.telefonas}
        </p>
        <p>
          <strong>Miestas:</strong> {klientas?.miestas}
        </p>

        {kvitas && (
          <p>
            <strong>Kvito Nr.:</strong> {kvitas}
          </p>
        )}
        {saskaita && (
          <p>
            <strong>Sąskaitos Nr.:</strong> {saskaita}
          </p>
        )}
      </div>

      {/* Sąlygos */}
      <div className="mb-6 text-sm whitespace-pre-line">
        {displayText}
        {salygosText.length > MAX_LENGTH && (
          <button
            className="text-blue-600 mt-2 block underline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Rodyti mažiau" : "Rodyti viską"}
          </button>
        )}
      </div>

      {/* Parašas */}
      <SignaturePad
        ref={sigRef}
        canvasProps={{ className: "border w-full h-48 bg-white" }}
      />
      <div className="flex gap-4 justify-center mt-4">
        <button onClick={() => sigRef.current.clear()} className="btn btn-sm">
          Išvalyti
        </button>
        <button onClick={handleSubmit} className="btn btn-primary btn-sm">
          Pateikti parašą
        </button>
      </div>
      {pranesimas && <p className="mt-4">{pranesimas}</p>}
    </div>
  );
};

export default Pasirasymas;
