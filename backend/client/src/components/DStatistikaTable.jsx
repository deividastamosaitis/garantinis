// Atnaujintas DStatistikaTable.jsx komponentas, kuris palaiko tiek seną (string), tiek naują (array) atsiskaitymo formatą

import { Link } from "react-router-dom";

const DStatistikaTable = ({
  _id,
  klientas,
  atsiskaitymas,
  kKaina,
  krepselis,
  saskaita,
  kvitas,
  createdBy,
  createdAt,
  originalDate,
  showPayments,
  showEdit,
  pdfPath,
}) => {
  const date = new Date(createdAt);
  const pakeistadate = new Date(originalDate);
  const isValidDate = !isNaN(date.getTime());

  // Normalizuotas atsiskaitymas į string
  let atsiskaitymasText = "—";
  if (Array.isArray(atsiskaitymas)) {
    atsiskaitymasText = atsiskaitymas
      .map((a) => `${a.tipas} (${a.suma}€)`)
      .join(", ");
  } else if (typeof atsiskaitymas === "string") {
    atsiskaitymasText = atsiskaitymas;
  } else {
    atsiskaitymasText = "Nenurodytas";
  }

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-4">
        {isValidDate
          ? date.toLocaleDateString("lt-LT", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "Nėra datos"}
      </td>
      <td className="px-6 py-4">{klientas.vardas}</td>
      <td className="px-6 py-4">{klientas.telefonas}</td>
      {showPayments && <td className="px-6 py-4">{atsiskaitymasText}</td>}
      {showPayments && <td className="px-6 py-4">{kKaina}€</td>}
      <td className="px-6 py-4">
        <ul>
          {krepselis.map((preke, index) => (
            <li key={index}>
              {`(${preke.barkodas}) `}
              <strong>{preke.pavadinimas}</strong> - {preke.kaina}€ <br />
              <span className="text-sm text-gray-500">
                Serijos numeris: {preke.serial}
              </span>
            </li>
          ))}
        </ul>
      </td>
      <td className="px-6 py-4">{saskaita}</td>
      <td className="px-6 py-4">{kvitas}</td>
      <td className="px-6 py-4">{createdBy?.vardas || "—"}</td>
      {showEdit && (
        <td className="px-6 py-4">
          <div className="flex flex-col items-start space-y-2">
            <Link
              to={`../garantinis/${_id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              ✏️ <span className="ml-1">Redaguoti</span>
            </Link>

            {pdfPath && (
              <a
                href={pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-green-600 hover:text-green-800 text-sm"
                title="Peržiūrėti PDF"
              >
                📄 <span className="ml-1">Peržiūrėti</span>
              </a>
            )}

            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch(
                    `/api/garantinis/${_id}/resend-signature`,
                    {
                      method: "POST",
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  if (res.ok) alert("Išsiųsta į planšetę!");
                  else alert("Klaida siunčiant.");
                } catch (err) {
                  console.error("❌", err);
                  alert("Serverio klaida.");
                }
              }}
              className="inline-flex items-center text-orange-600 hover:text-orange-800 text-sm"
              title="Išsiųsti dar kartą pasirašyti"
            >
              🔁 <span className="ml-1">Siųsti iš naujo</span>
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default DStatistikaTable;
