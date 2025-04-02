import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch.js";

// Loader function for initial data
export const loader = async () => {
  try {
    const { data } = await customFetch.get(
      "/garantinis/statistics?period=month"
    );
    return { initialStats: data };
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Nepavyko įkelti statistikos");
    return { initialStats: null };
  }
};

const PStatistika = () => {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1); // First day of current month
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const { data } = await customFetch.get(
        `/garantinis/statistics?${params}`
      );
      setStats(data.salesByProduct || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Nepavyko įkelti statistikos"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStats();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pardavimų statistika</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-4 rounded shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Nuo:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Iki:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? "Kraunama..." : "Rodyti"}
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <p className="text-center py-4">Kraunama...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Prekė</th>
                <th className="py-2 px-4 text-center">Kiekis</th>
                <th className="py-2 px-4 text-center">Viso pajamų (€)</th>
              </tr>
            </thead>
            <tbody>
              {stats.length > 0 ? (
                stats.map((product, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-2 px-4 border">{product._id}</td>
                    <td className="py-2 px-4 border text-center">
                      {product.count}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {product.totalRevenue.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">
                    Nerasta pardavimų pasirinktu laikotarpiu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PStatistika;
