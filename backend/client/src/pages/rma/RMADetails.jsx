import { useLoaderData, Link } from "react-router-dom";
import customFetch from "../../utils/customFetch";

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/rma/${params.id}`);
    return data;
  } catch (error) {
    throw new Error("Klaida įkraunant RMA įrašą");
  }
};

const RMADetails = () => {
  const { product } = useLoaderData();

  const statusMap = {
    registered: "Registruota",
    sent: "Išvykęs",
    returned: "Grįžęs",
    credit: "Kreditas",
  };

  const notifiedMap = {
    notified: "Pranešta",
    not_notified: "Nepranešta",
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">RMA detalės</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border rounded-2xl shadow-md p-4 bg-white">
          <h3 className="font-semibold">Prekės informacija</h3>
          <p>
            <span className="font-medium">Pavadinimas:</span> {product.name}
          </p>
          <p>
            <span className="font-medium">Serijos numeris:</span>{" "}
            {product.serialNumber}
          </p>
          <p>
            <span className="font-medium">Komplektacija:</span>{" "}
            {product.accessories}
          </p>
        </div>

        <div className="border rounded-2xl shadow-md p-4 bg-white">
          <h3 className="font-semibold">Kliento informacija</h3>
          <p>
            <span className="font-medium">Vardas:</span> {product.customer.name}
          </p>
          <p>
            <span className="font-medium">Telefonas:</span>{" "}
            {product.customer.phone}
          </p>
          <p>
            <span className="font-medium">El. paštas:</span>{" "}
            {product.customer.email || "Nėra"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border rounded-2xl shadow-md p-4 bg-red-200">
          <h3 className="font-semibold">RMA būsena</h3>
          <p>
            <span className="font-medium">Būsena:</span>{" "}
            {statusMap[product.status]}
          </p>
          <p>
            <span className="font-medium">Klientui pranešta:</span>{" "}
            {notifiedMap[product.notified]}
          </p>
        </div>

        <div className="border rounded-2xl shadow-md p-4 bg-white">
          <h3 className="font-semibold">Eproma.lt informacija</h3>
          <p>
            <span className="font-medium">RMA kodas:</span>{" "}
            {product.epromaRMA || "Nėra"}
          </p>
          <p>
            <span className="font-medium">Būsena:</span> {product.epromaStatus}
          </p>
        </div>
      </div>

      {product.additionalInfo && (
        <div className="border rounded-2xl shadow-md p-4 bg-white mb-4">
          <h3 className="font-semibold">Papildoma informacija</h3>
          <p>{product.additionalInfo}</p>
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <Link
          to={`/garantinis/rma/${product._id}/edit`}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Redaguoti
        </Link>
        <Link
          to="/garantinis/rma"
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Grįžti
        </Link>
      </div>
    </div>
  );
};

export default RMADetails;
