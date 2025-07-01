import { Form, useLoaderData, redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

// 🔁 Loader
export async function loader({ params }) {
  const { data } = await customFetch.get(`/tickets/${params.id}`);
  return data;
}

// Action
export async function action({ request, params }) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);

  const updates = {};

  for (const [key, value] of Object.entries(raw)) {
    const parts = key.split(".");

    if (parts.length === 3) {
      const [a, b, c] = parts;
      updates[a] ??= {};
      updates[a][b] ??= {};
      updates[a][b][c] = value;
    } else if (parts.length === 2) {
      const [a, b] = parts;
      updates[a] ??= {};
      updates[a][b] = value;
    } else {
      updates[key] = value;
    }
  }

  try {
    await customFetch.patch(`/tickets/${params.id}`, updates);
    toast.success("Remontas atnaujintas");
    return redirect(`/garantinis/servisas/${params.id}`);
  } catch (err) {
    console.error("PATCH klaida:", err.response?.data || err.message);
    toast.error("Klaida atnaujinant");
    return null;
  }
}

export default function Redaguoti() {
  const ticket = useLoaderData();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Redaguoti remontą</h1>
      <Form method="post" className="space-y-4">
        {/* Klientas */}
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <legend className="font-semibold col-span-full">Klientas</legend>
          <input
            name="client.name"
            defaultValue={ticket.client?.name}
            placeholder="Vardas"
            required
            className="input"
          />
          <input
            name="client.phone"
            defaultValue={ticket.client?.phone}
            placeholder="Telefonas"
            required
            className="input"
          />
          <input
            name="client.email"
            defaultValue={ticket.client?.email}
            placeholder="El. paštas"
            className="input col-span-full"
          />
        </fieldset>

        {/* Prekė */}
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <legend className="font-semibold col-span-full">Prekė</legend>
          <select
            name="product.category"
            defaultValue={ticket.product?.category}
            className="input"
            required
          >
            <option value="">-- Kategorija --</option>
            <option value="Robotas">Robotas</option>
            <option value="Kamera">Kamera</option>
            <option value="Registratorius">Registratorius</option>
            <option value="Radaras">Radaras</option>
            <option value="Kita">Kita</option>
          </select>
          <input
            name="product.brand"
            defaultValue={ticket.product?.brand}
            placeholder="Gamintojas"
            required
            className="input"
          />
          <input
            name="product.model"
            defaultValue={ticket.product?.model}
            placeholder="Modelis"
            className="input"
          />
          <input
            name="product.serialNumber"
            defaultValue={ticket.product?.serialNumber}
            placeholder="Serijinis nr."
            required
            className="input"
          />
        </fieldset>

        {/* Gedimo aprašymas */}
        <div>
          <label className="block font-semibold mb-1">Gedimo aprašymas</label>
          <textarea
            name="problemDescription"
            rows="4"
            defaultValue={ticket.problemDescription}
            className="input w-full"
          />
        </div>

        {/* Statusas + darbuotojas */}
        <div>
          <label className="block font-semibold mb-1">Statusas</label>
          <select
            name="status"
            defaultValue={ticket.status}
            className="input"
            required
          >
            <option value="Užregistruota">Užregistruota</option>
            <option value="Prekė gauta į servisą">Prekė gauta į servisą</option>
            <option value="Diagnostika">Diagnostika</option>
            <option value="Dalių užsakymas">Dalių užsakymas</option>
            <option value="Remontuojama">Remontuojama</option>
            <option value="Paruošta atsiėmimui">Paruošta atsiėmimui</option>
            <option value="Prekė išsiųsta klientui">
              Prekė išsiųsta klientui
            </option>
            <option value="Uždaryta">Uždaryta</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Priskirtas darbuotojas
          </label>
          <input
            name="assignedTo"
            defaultValue={ticket.assignedTo}
            className="input"
            placeholder="Darbuotojo vardas"
          />
        </div>

        {/* Pastabos */}
        <div>
          <label className="block font-semibold mb-1">Pastabos</label>
          <textarea
            name="notes"
            defaultValue={ticket.notes}
            rows="4"
            className="input w-full"
            placeholder="Pastabos apie remontą"
          />
        </div>
        {/* Issorinis servisas */}
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <legend className="font-semibold col-span-full">
            Išorinis servisas
          </legend>

          <input
            name="product.externalService.sentTo"
            defaultValue={ticket.product?.externalService?.sentTo}
            placeholder="Tiekėjas (pvz. EPROMA)"
            className="input"
          />
          <input
            name="product.externalService.sentDate"
            defaultValue={ticket.product?.externalService?.sentDate?.slice(
              0,
              10
            )}
            type="date"
            className="input"
          />
          <input
            name="product.externalService.rmaCode"
            defaultValue={ticket.product?.externalService?.rmaCode}
            placeholder="RMA (klientui)"
            className="input"
            disabled
          />
          <input
            name="product.externalService.supplierRmaCode"
            defaultValue={ticket.product?.externalService?.supplierRmaCode}
            placeholder="Tiekėjo RMA kodas"
            className="input"
          />
          <select
            name="product.externalService.status"
            defaultValue={ticket.product?.externalService?.status || "Nežinoma"}
            className="input"
          >
            <option default value="Registruota">
              Registruota
            </option>
            <option value="Laukiama">Laukiama</option>
            <option value="Išsiųsta">Išsiųsta</option>
            <option value="Grąžinta">Grąžinta</option>
            <option value="Kreditas">Kreditas</option>
          </select>
        </fieldset>

        <button type="submit" className="btn">
          Išsaugoti pakeitimus
        </button>
      </Form>
    </div>
  );
}
