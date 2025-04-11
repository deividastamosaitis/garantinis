import customFetch from "./customFetch.js";
import { toast } from "react-toastify";

export const alkotesteriaiLoader = async () => {
  try {
    const { data } = await customFetch.get("/alkotesteriai");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
};

export const todayAlkotesteriaiLoader = async () => {
  try {
    const { data } = await customFetch.get("/alkotesteriai/today");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
};

export const alkotesterisLoader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/alkotesteriai/${params.id}`);
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
    return redirect("/alkotesteriai");
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

export const updateAlkotesterisAction = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.patch(`/alkotesteriai/${params.id}`, data);
    toast.success("Alkotesterio duomenys sėkmingai atnaujinti");
    return redirect("/alkotesteriai");
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
    return redirect("/alkotesteriai");
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

export const searchAlkotesteriaiAction = async ({ request }) => {
  const params = Object.fromEntries([...new URL(request.url).searchParams]);

  try {
    const { data } = await customFetch.get("/alkotesteriai/search", { params });
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};
