import React, { useRef, useState, useEffect } from "react";
import SignaturePad from "react-signature-canvas";
import { useParams } from "react-router-dom";
import { salygosText } from "../../../../data/salygosText";

const Pasirasymas = () => {
  const { id } = useParams();
  const sigRef = useRef();
  const [pranesimas, setPranesimas] = useState(null);

  const [expanded, setExpanded] = useState(false);
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
      } else {
        setPranesimas("❌ Nepavyko išsaugoti parašo");
      }
    } catch (err) {
      console.error(err);
      setPranesimas("❌ Klaida siunčiant duomenis");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Pasirašymas dėl garantinio</h1>

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
