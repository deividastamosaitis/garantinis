import React, { useState } from "react";
import { Form, redirect, useNavigation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch.js";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/login", data);
    toast.success("Prisijungta");
    return redirect("/garantinis");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Login = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <main className="p-4 card flex h-screen">
      <div className="m-auto">
        <h1 className="title">Prisijungimas</h1>

        <Form method="post">
          <input
            type="email"
            placeholder="email address"
            className="input"
            name="email"
            autoFocus
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Prisijungiama..." : "Prisijungti"}
          </button>
        </Form>
      </div>
    </main>
  );
};

export default Login;
