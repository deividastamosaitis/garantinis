import React from "react";
import { useLoaderData } from "react-router-dom";
import { FiCalendar, FiUser, FiPhone, FiMapPin } from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch.js";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/garantinis");
    return data; // Return just the data directly
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    throw error; // Throw instead of return error
  }
};

const Konkursas = () => {
  const data = useLoaderData(); // Now data is the direct response
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  // Filter function
  const filterKonkursasData = () => {
    const targetProductCode = "8720254406879";

    if (!data || !data.garantinis) return []; // Add null check

    return data.garantinis
      .filter((garantinis) => {
        // Check date filter
        const purchaseDate = new Date(garantinis.createdAt);
        const purchaseMonth = purchaseDate.getMonth() + 1;
        const purchaseYear = purchaseDate.getFullYear();

        // Check if contains our product
        const hasProduct = garantinis.prekes?.some(
          (preke) => preke.barkodas === targetProductCode
        );

        return (
          hasProduct &&
          purchaseMonth === monthFilter &&
          purchaseYear === yearFilter
        );
      })
      .map((garantinis) => {
        const product = garantinis.prekes.find(
          (preke) => preke.barkodas === targetProductCode
        );

        return {
          serial: product?.serial || "N/A",
          klientas: garantinis.klientas,
          purchaseDate: garantinis.createdAt,
          createdBy: garantinis.createdBy,
          garantinisId: garantinis._id,
        };
      });
  };

  const konkursasData = filterKonkursasData();
  const monthName = new Date(yearFilter, monthFilter - 1, 1).toLocaleString(
    "default",
    { month: "long" }
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Konkursas - Segway Navimow i105E
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label htmlFor="month" className="font-medium">
              Mėnesis:
            </label>
            <select
              id="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(parseInt(e.target.value))}
              className="border rounded px-3 py-1"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1, 1).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="year" className="font-medium">
              Metai:
            </label>
            <input
              type="number"
              id="year"
              value={yearFilter}
              onChange={(e) => setYearFilter(parseInt(e.target.value))}
              className="border rounded px-3 py-1 w-20"
              min="2020"
              max={new Date().getFullYear() + 1}
            />
          </div>
        </div>

        {konkursasData.length === 0 ? (
          <div className="text-gray-500 p-4 bg-gray-50 rounded">
            Nėra pirkimų: {monthName} {yearFilter}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klientas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pirkimo diena
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sukūrta
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {konkursasData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {item.serial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <FiUser size={14} /> {item.klientas.vardas}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <FiPhone size={14} /> {item.klientas.telefonas}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <FiMapPin size={14} /> {item.klientas.miestas}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FiCalendar size={14} />
                        {new Date(item.purchaseDate).toLocaleDateString(
                          "lt-LT",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.createdBy?.vardas || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Konkursas;
