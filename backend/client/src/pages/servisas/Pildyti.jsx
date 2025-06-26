import { Form, redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export async function action({ request }) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);

  const data = {};
  for (const [key, value] of Object.entries(raw)) {
    const parts = key.split(".");
    if (parts.length === 2) {
      const [group, field] = parts;
      if (!data[group]) data[group] = {};
      data[group][field] = value;
    } else {
      data[key] = value;
    }
  }

  try {
    await customFetch.post("/tickets", data); // <--- siųsti transformuotą
    toast.success("Remontas užregistruotas");
    return redirect("/garantinis/servisas");
  } catch (err) {
    console.error("❌ Klaida:", err.response?.data);
    toast.error(err.response?.data?.error || "Klaida registruojant remontą");
    return null;
  }
}

export default function Pildyti() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Registruoti remontą</h1>
      <Form method="post" className="space-y-4">
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <legend className="font-semibold col-span-full">Klientas</legend>
          <input
            name="client.name"
            placeholder="Vardas"
            required
            className="input"
          />
          <input
            name="client.phone"
            placeholder="Telefonas"
            required
            className="input"
          />
          <input
            name="client.email"
            placeholder="El. paštas"
            className="input col-span-full"
          />
        </fieldset>

        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <legend className="font-semibold col-span-full">Prekė</legend>
          <select name="product.category" className="input" required>
            <option value="">-- Pasirinkti --</option>
            <option value="Robotas">Robotas</option>
            <option value="Kamera">Kamera</option>
            <option value="Registratorius">Registratorius</option>
            <option value="Radaras">Radaras</option>
          </select>
          <input
            name="product.brand"
            placeholder="Gamintojas"
            required
            className="input"
          />
          <input name="product.model" placeholder="Modelis" className="input" />
          <input
            name="product.serialNumber"
            placeholder="Serijinis nr."
            required
            className="input"
          />
        </fieldset>

        <div>
          <label className="block font-semibold mb-1">Gedimo aprašymas</label>
          <textarea
            name="problemDescription"
            rows="4"
            className="input w-full"
          />
        </div>

        <button type="submit" className="btn">
          Išsaugoti
        </button>
      </Form>
    </div>
  );
}
