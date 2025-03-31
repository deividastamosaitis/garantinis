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
}) => {
  const date = new Date(createdAt);
  const isValidDate = !isNaN(date.getTime());

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
      <td className="px-6 py-4">{atsiskaitymas}</td>
      <td className="px-6 py-4">{kKaina}€</td>
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
      <td className="px-6 py-4">{createdBy.vardas}</td>{" "}
      {/* Vartotojas, kuris sukūrė įrašą */}
      <td className="px-6 py-4">
        <Link
          to={`../garantinis/${_id}`}
          className="text-blue-500 hover:underline"
        >
          Redaguoti
        </Link>
      </td>
    </tr>
  );
};

export default DStatistikaTable;
