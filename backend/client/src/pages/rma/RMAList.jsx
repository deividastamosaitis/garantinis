import { useLoaderData, Link, useNavigate } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async ({ request }) => {
  try {
    const { data } = await customFetch.get("/rma");
    return data;
  } catch (error) {
    toast.error("Klaida įkraunant RMA sąrašą");
    return { products: [] };
  }
};

const RMAList = () => {
  const { products } = useLoaderData();
  const navigate = useNavigate();

  const statusColors = {
    registered: "bg-blue-100 text-blue-800",
    sent: "bg-yellow-100 text-yellow-800",
    returned: "bg-green-100 text-green-800",
    credit: "bg-purple-100 text-purple-800",
  };

  const handleDelete = async (id) => {
    // Patvirtinimo toast
    toast.warning(
      <div>
        <p className="mb-2">Ar tikrai norite ištrinti šį RMA įrašą?</p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={() => {
              deleteProduct(id);
              toast.dismiss();
            }}
          >
            Taip, ištrinti
          </button>
          <button
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={() => toast.dismiss()}
          >
            Atšaukti
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );
  };

  const deleteProduct = async (id) => {
    try {
      await customFetch.delete(`/rma/${id}`);
      toast.success("RMA įrašas sėkmingai ištrintas");
      navigate("/garantinis/rma"); // Perkrauti puslapį, kad atnaujintų sąrašą
    } catch (error) {
      toast.error("Nepavyko ištrinti RMA įrašo");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">RMA Serviso Sistema</h1>

      <div className="mb-4">
        <Link to="create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Pridėti naują RMA
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Data</th>
              <th className="py-2 px-4 border">Prekės SN</th>
              <th className="py-2 px-4 border">Klientas</th>
              <th className="py-2 px-4 border">Telefonas</th>
              <th className="py-2 px-4 border">Būsena</th>
              <th className="py-2 px-4 border">Eproma būsena</th>
              <th className="py-2 px-4 border">Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="py-2 px-4 border">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">{product.serialNumber}</td>
                <td className="py-2 px-4 border">{product.customer.name}</td>
                <td className="py-2 px-4 border">{product.customer.phone}</td>
                <td className="py-2 px-4 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      statusColors[product.status]
                    }`}
                  >
                    {product.status === "registered" && "Registruota"}
                    {product.status === "sent" && "Išvykęs"}
                    {product.status === "returned" && "Grįžęs"}
                    {product.status === "credit" && "Kreditas"}
                  </span>
                </td>
                <td className="py-2 px-4 border">{product.epromaStatus}</td>
                <td className="py-2 px-4 border">
                  <Link
                    to={`${product._id}`}
                    className="bg-gray-200 px-3 py-1 rounded mr-2"
                  >
                    Daugiau
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-200 px-3 py-1 rounded"
                  >
                    Ištrinti
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RMAList;
