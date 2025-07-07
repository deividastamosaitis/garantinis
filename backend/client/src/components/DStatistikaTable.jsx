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
        <td className="px-6 py-4 flex flex-col gap-1">
          <Link
            to={`../garantinis/${_id}`}
            className="text-blue-500 hover:underline"
          >
            Redaguoti
          </Link>
          {pdfPath && (
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
              title="Peržiūrėti PDF"
            >
              📄
            </a>
          )}
        </td>
      )}
    </tr>
  );
};

export default DStatistikaTable;
