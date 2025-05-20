import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const KStatistika = () => {
  // Datų inicializacija - pradžioje tuščias
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    totalBaskets: 0,
    basketsByDay: [],
    salesByProduct: [],
  });

  // Funkcija tinkamai formatuoti datą
  const formatDateForAPI = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchStatistics = async (start, end) => {
    if (!start || !end) {
      toast.error("Pasirinkite tinkamą datų intervalą");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/garantinis/statistika", {
        params: {
          startDate: formatDateForAPI(start),
          endDate: formatDateForAPI(end),
        },
      });
      setStatistics(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error("Nepavyko gauti statistikos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setDateRange([start, end]);

    // Automatiškai atnaujinti duomenis pasirinkus datas
    if (start && end) {
      fetchStatistics(start, end);
    }
  };

  // Pradinis duomenų užkrovimas - šiandienos duomenys
  useEffect(() => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    setDateRange([monthStart, today]);
    fetchStatistics(monthStart, today);
  }, []);

  const handleUpdateClick = () => {
    fetchStatistics();
  };

  // Paruošti TOP 10 prekių pagal pardavimų skaičių
  const prepareTopSalesData = () => {
    return [...statistics.salesByProduct]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((item) => ({
        name: item._id || "Nenurodyta",
        Pardavimai: item.count,
        Pajamos: item.totalRevenue,
      }));
  };

  // Paruošti TOP 10 prekių pagal pajamas
  const prepareTopRevenueData = () => {
    return [...statistics.salesByProduct]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10)
      .map((item) => ({
        name: item._id || "Nenurodyta",
        Pardavimai: item.count,
        Pajamos: item.totalRevenue,
      }));
  };

  const prepareDailyChartData = () => {
    const avg =
      statistics.totalBaskets > 0
        ? statistics.totalRevenue / statistics.totalBaskets
        : 0;

    return statistics.basketsByDay.map((item) => ({
      name: item._id,
      Krepšeliai: item.count,
      "Bendra suma": item.totalRevenue,
      Grynais: item.grynais,
      Kortele: item.kortele,
      Pavedimas: item.pavedimas,
      Lizingas: item.lizingas,
      "C.O.D": item.cod,
      Vidurkis: 50000,
    }));
  };

  const dailyChartData = prepareDailyChartData();
  const topSalesData = prepareTopSalesData();
  const topRevenueData = prepareTopRevenueData();

  // Saugus datos formatavimas
  const formatDate = (date) => {
    return date ? date.toLocaleDateString("lt-LT") : "...";
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Pardavimų statistika</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <label className="block mb-1">Laikotarpis:</label>
          <div className="flex gap-2">
            <DatePicker
              selectsRange
              selected={startDate}
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded"
              isClearable={true}
              placeholderText="Pasirinkite datų intervalą"
            />
          </div>
        </div>

        {startDate && endDate && (
          <div className="bg-gray-100 p-3 rounded">
            <p className="font-semibold">Bendra informacija:</p>
            <p>Krepšelių skaičius: {statistics.totalBaskets}</p>
            <p>
              Vidutinė krepšelio suma:{" "}
              {statistics.totalBaskets > 0 ? (
                <b>
                  {(statistics.totalRevenue / statistics.totalBaskets).toFixed(
                    2
                  )}{" "}
                  €
                </b>
              ) : (
                "0 €"
              )}
            </p>
            <p>
              Laikotarpis: {formatDateForAPI(startDate)} -{" "}
              {formatDateForAPI(endDate)}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">
                TOP 10 prekių pagal pardavimų skaičių
              </h2>
              <div style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="Pardavimai"
                      fill="#8884d8"
                      name="Pardavimų sk."
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">
                TOP 10 prekių pagal pajamas
              </h2>
              <div style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Pajamos" fill="#82ca9d" name="Pajamos (€)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Pardavimai pagal dieną
            </h2>
            <div style={{ height: 500 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Grynais" stackId="a" fill="#8884d8" />
                  <Bar dataKey="Kortele" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="Pavedimas" stackId="a" fill="#ffc658" />
                  <Bar dataKey="Lizingas" stackId="a" fill="#ff8042" />
                  <Bar dataKey="C.O.D" stackId="a" fill="#0088FE" />
                  <Bar dataKey="Bendra suma" fill="#FF0000" opacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KStatistika;
