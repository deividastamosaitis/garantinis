import React from "react";

const DStatistikaTable = ({
  klientas,
  atsiskaitymas,
  kKaina,
  krepselis,
  saskaita,
}) => {
  return (
    <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
      <td class="px-6 py-4">2024-12-2</td>
      <th
        scope="row"
        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {klientas}
      </th>
      {atsiskaitymas === "kortele" ? (
        <td className="px-6 py-4 text-red-500 font-bold">{atsiskaitymas}</td>
      ) : atsiskaitymas === "grynais" ? (
        <td className="px-6 py-4 text-green-500 font-bold">{atsiskaitymas}</td>
      ) : (
        <td className="px-6 py-4 text-yellow-400 font-bold">{atsiskaitymas}</td>
      )}
      <td class="px-6 py-4">{kKaina}</td>
      <td class="px-6 py-4">
        <div>
          <table>
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="px-2 py-3">
                  Barkodas
                </th>
                <th scope="col" className="px-2 py-3">
                  Prekė
                </th>
                <th scope="col" className="px-2 py-3">
                  Kaina
                </th>
              </tr>
            </thead>
            <tbody>
              {krepselis.map((preke, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td class="px-2 py-2">{preke.barkodas}</td>
                  <td class="px-2 py-2">{preke.preke}</td>
                  <td class="px-2 py-2">{preke.pKaina}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </td>
      <td class="px-6 py-4">{saskaita}</td>
      <td class="px-6 py-4">
        <a
          href="#"
          class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Redaguoti
        </a>
      </td>
    </tr>
  );
};

export default DStatistikaTable;
