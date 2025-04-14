import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import AlkotesteriuSarasas from "../components/AlkotesteriuSarasas";
import AlkotesterioForma from "../components/AlkotesterioForma";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/alkotesteriai");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
};

export const createAlkotesterisAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/alkotesteriai", data);
    toast.success("Alkotesteris sėkmingai užregistruotas");
    return null;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

export const updateStatusAction = async ({ request, params }) => {
  const formData = await request.formData();
  const status = formData.get("status");

  try {
    await customFetch.patch(`/alkotesteriai/${params.id}/status`, { status });
    toast.success("Būsena sėkmingai atnaujinta");
    return null;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

export const deleteAlkotesterisAction = async ({ params }) => {
  try {
    await customFetch.delete(`/alkotesteriai/${params.id}`);
    toast.success("Alkotesteris sėkmingai ištrintas");
    return null;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

const Alkotesteriai = () => {
  const { alkotesteriai } = useLoaderData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Alkotesterių kalibravimo registracija
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Naujo alkotesterio registracija
        </h2>
        <AlkotesterioForma />
      </div>

      <Outlet />

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Registruoti alkotesteriai
        </h2>
        <AlkotesteriuSarasas alkotesteriai={alkotesteriai} />
      </div>
    </div>
  );
};

export default Alkotesteriai;
