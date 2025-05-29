import React, { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import customFetch from "../../utils/customFetch.js";
import BStatistikaTable from "../../components/BStatistikaTable";
import * as XLSX from "xlsx";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/garantinis");
    return { data };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const BStatistika = () => {
  const navigate = useNavigate();
  const { data } = useLoaderData();
  const garantinis = data.garantinis;

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filtered = garantinis.filter((item) => {
      const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
      return itemDate >= startDate && itemDate <= endDate;
    });
    setFilteredData(filtered);
  }, [garantinis, startDate, endDate]);

  // Naujas būdas suskaičiuoti sumas pagal atsiskaitymo būdus
  const totalByPayment = (type) => {
    return filteredData.reduce((sum, item) => {
      if (Array.isArray(item.atsiskaitymas)) {
        return (
          sum +
          item.atsiskaitymas
            .filter((a) => a.tipas === type)
            .reduce((s, a) => s + a.suma, 0)
        );
      } else if (item.atsiskaitymas === type) {
        return sum + item.totalKaina;
      } else {
        return sum;
      }
    }, 0);
  };

  const exportToExcel = (data, startDate, endDate) => {
    const formattedData = data.flatMap((item) =>
      item.prekes.map((preke) => ({
        Data: new Date(item.createdAt).toLocaleDateString("lt-LT"),
        Barkodas: preke.barkodas,
        Prekė: preke.pavadinimas,
        "Serijos numeris": preke.serial,
        Kaina: preke.kaina,
        Atsiskaitymas: Array.isArray(item.atsiskaitymas)
          ? item.atsiskaitymas.map((a) => `${a.tipas} (${a.suma}€)`).join(", ")
          : item.atsiskaitymas,
        Klientas: item.klientas.vardas,
        Sąskaita: item.saskaita,
        Kvitas: item.kvitas,
        Sukūrė: item.createdBy.vardas,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistika");
    const fileName = `statistika_${startDate}_iki_${endDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <>
      <div className="grid grid-cols-5 ">
        <div className="flex text-center h-20 bg-yellow-500 text-white font-bold items-center justify-center">
          <span>Pavedimu: </span>
          <span className="ml-1">
            {totalByPayment("pavedimas").toFixed(2)}€
          </span>
        </div>
        <div className="flex text-center h-20 bg-red-500 text-white font-bold items-center justify-center">
          <span>Kortele: </span>
          <span className="ml-1">{totalByPayment("kortele").toFixed(2)}€</span>
        </div>
        <div className="flex text-center h-20 bg-green-500 text-white font-bold items-center justify-center">
          <span>Grynais: </span>
          <span className="ml-1">{totalByPayment("grynais").toFixed(2)}€</span>
        </div>
        <div className="flex text-center h-20 bg-blue-500 text-white font-bold items-center justify-center">
          <span>Lizingas: </span>
          <span className="ml-1">{totalByPayment("lizingas").toFixed(2)}€</span>
        </div>
        <div className="flex text-center h-20 bg-gray-500 text-white font-bold items-center justify-center">
          <span>COD: </span>
          <span className="ml-1">{totalByPayment("COD").toFixed(2)}€</span>
        </div>
      </div>

      <div className="mb-4 mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Pasirinkite laikotarpį:
        </label>
        <div className="flex gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => exportToExcel(filteredData, startDate, endDate)}
          className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 "
        >
          Atsisiųsti Excel failą
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Data
              </th>
              <th scope="col" className="px-6 py-3">
                Klientas
              </th>
              <th scope="col" className="px-6 py-3">
                Telefonas
              </th>
              <th scope="col" className="px-6 py-3">
                Atsiskaitymas
              </th>
              <th scope="col" className="px-6 py-3">
                Kaina
              </th>
              <th scope="col" className="px-6 py-3">
                Prekės
              </th>
              <th scope="col" className="px-6 py-3">
                Sąskaita
              </th>
              <th scope="col" className="px-6 py-3">
                Kvitas
              </th>
              <th scope="col" className="px-6 py-3">
                Sukūrė
              </th>
              <th scope="col" className="px-6 py-3">
                Veiksmas
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((pirkejas, index) => (
              <BStatistikaTable
                key={pirkejas._id}
                _id={pirkejas._id}
                klientas={pirkejas.klientas}
                atsiskaitymas={pirkejas.atsiskaitymas}
                kKaina={pirkejas.totalKaina}
                krepselis={pirkejas.prekes}
                saskaita={pirkejas.saskaita}
                kvitas={pirkejas.kvitas}
                createdBy={pirkejas.createdBy}
                createdAt={pirkejas.createdAt}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BStatistika;
