import { Form, useLoaderData, redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { useState } from "react";

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
    toast.error("Klaida atnaujinant");
    return null;
  }
}

export default function Redaguoti() {
  const ticket = useLoaderData();
  const [newFiles, setNewFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [urlError, setUrlError] = useState({});

  function getMediaUrl(name) {
    const clientServer = import.meta.env.VITE_FILE_SERVER_URL;
    const internalServer = import.meta.env.VITE_INTERNAL_FILE_SERVER_URL;

    return urlError[name]
      ? `${clientServer}/uploads/${name}`
      : `${internalServer}/uploads/${name}`;
  }

  const handleDelete = async (filename) => {
    const confirm = window.confirm(`Ar tikrai norite ištrinti „${filename}“?`);
    if (!confirm) return;

    try {
      // Trinti iš serverio
      await customFetch.delete(`/uploads/${filename}`);

      // Trinti iš MongoDB
      const updated = ticket.attachments.filter((n) => n !== filename);
      await customFetch.patch(`/tickets/${ticket._id}`, {
        attachments: updated,
      });

      toast.success("Failas ištrintas");
      window.location.reload();
    } catch (err) {
      toast.error("Nepavyko ištrinti failo");
    }
  };

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

        {/* Failai */}
        <div className="space-y-2">
          <label className="block font-semibold">Esami failai</label>
          <div className="flex flex-wrap gap-3">
            {ticket.attachments?.map((name) => {
              const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
              const isVideo = name.match(/\.(mp4|webm|mov|avi)$/i);
              const mediaUrl = getMediaUrl(name);

              return (
                <div key={name} className="relative w-40">
                  {isImage && (
                    <img
                      src={mediaUrl}
                      alt={name}
                      onError={() =>
                        setUrlError((prev) => ({ ...prev, [name]: true }))
                      }
                      className="w-full h-32 object-cover border rounded"
                    />
                  )}

                  {isVideo && (
                    <video
                      src={mediaUrl}
                      onError={() =>
                        setUrlError((prev) => ({ ...prev, [name]: true }))
                      }
                      controls
                      className="w-full h-32 object-cover border rounded"
                    />
                  )}

                  {!isImage && !isVideo && (
                    <a
                      href={mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-blue-600 underline"
                    >
                      {name}
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(name)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    🗑
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nauji failai */}
        <div className="space-y-2">
          <label className="block font-semibold">Pridėti naujus failus</label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => setNewFiles(Array.from(e.target.files))}
          />
          <button
            type="button"
            className="btn bg-green-600 hover:bg-green-700 text-white"
            disabled={uploading || newFiles.length === 0}
            onClick={async () => {
              const formData = new FormData();
              newFiles.forEach((file) => formData.append("files", file));

              try {
                setUploading(true);
                const { data } = await customFetch.post("/uploads", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });

                const updatedAttachments = [
                  ...ticket.attachments,
                  ...data.uploaded,
                ];
                await customFetch.patch(`/tickets/${ticket._id}`, {
                  attachments: updatedAttachments,
                });

                toast.success("Failai įkelti sėkmingai");
                setNewFiles([]);
                window.location.reload();
              } catch (err) {
                toast.error("Nepavyko įkelti failų");
              } finally {
                setUploading(false);
              }
            }}
          >
            Įkelti pasirinktus failus
          </button>
        </div>

        {/* Statusas */}
        <div>
          <label className="block font-semibold mb-1">Statusas</label>
          <select
            name="status"
            defaultValue={ticket.status}
            className="input"
            required
          >
            <option value="Užregistruota">Užregistruota</option>
            <option value="Laukiama prekė iš kliento">
              Laukiama prekė iš kliento
            </option>
            <option value="Prekė gauta į servisą">Prekė gauta į servisą</option>
            <option value="Laukiama papildoma informacija iš kliento">
              Laukiama papildoma informacija iš kliento
            </option>
            <option value="Diagnostika">Diagnostika</option>
            <option value="Išsiųsta į autorizuotą servisą">
              Išsiųsta į autorizuotą servisą
            </option>
            <option value="Dalių užsakymas">Dalių užsakymas</option>
            <option value="Remontuojama">Remontuojama</option>
            <option value="Paruošta atsiėmimui">Paruošta atsiėmimui</option>
            <option value="Prekė išsiųsta klientui">
              Prekė išsiųsta klientui
            </option>
            <option value="Uždaryta">Uždaryta</option>
          </select>
        </div>

        {/* Darbuotojas */}
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

        {/* Raktazodis */}
        <div>
          <label className="block font-semibold mb-1">Raktažodis</label>
          <input
            name="keyword"
            defaultValue={ticket.keyword || ""}
            className="input"
            placeholder="Pvz.: paminėta garantija, specifinė sąlyga..."
          />
        </div>

        {/* Išorinis servisas */}
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <legend className="font-semibold col-span-full">
            Išorinis servisas
          </legend>
          <input
            name="product.externalService.sentTo"
            defaultValue={ticket.product?.externalService?.sentTo}
            placeholder="Tiekėjas"
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
            placeholder="RMA kodas"
            className="input"
            disabled
          />
          <input
            name="product.externalService.supplierRmaCode"
            defaultValue={ticket.product?.externalService?.supplierRmaCode}
            placeholder="Tiekėjo RMA"
            className="input"
          />
          <select
            name="product.externalService.status"
            defaultValue={ticket.product?.externalService?.status || "Nežinoma"}
            className="input"
          >
            <option value="Registruota">Registruota</option>
            <option value="Laukiama">Laukiama</option>
            <option value="Išsiųsta">Išsiųsta</option>
            <option value="Grąžinta">Grąžinta</option>
            <option value="Kreditas">Kreditas</option>
          </select>
        </fieldset>

        <button
          type="submit"
          className="btn bg-blue-600 hover:bg-blue-700 text-white"
        >
          Išsaugoti pakeitimus
        </button>
      </Form>
    </div>
  );
}
