import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type vendeurFormData = {
  Nom: string;
  Email: string;
  Telephone: string;
};

type CreatevendeurModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: vendeurFormData) => void;
};

const CreatevendeurModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreatevendeurModalProps) => {
  const [formData, setFormData] = useState({
    VendeurID: v4(),
    Nom: "",
    Email: "",
    Telephone: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "Nom" || name === "Email" || name === "Telephone"
          ? parseFloat(value)
          : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* PRODUCT NAME */}
          <label htmlFor="Nom" className={labelCssStyles}>
            Nom 
          </label>
          <input
            type="text"
            name="Nom"
            placeholder="Nom"
            onChange={handleChange}
            value={formData.Nom}
            className={inputCssStyles}
            required
          />

          {/* PRICE */}
          <label htmlFor="Email" className={labelCssStyles}>
            Email
          </label>
          <input
            type="text"
            name="Email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.Email}
            className={inputCssStyles}
            required
          />

          {/* STOCK QUANTITY */}
          <label htmlFor="Telephone" className={labelCssStyles}>
            Telephone 
          </label>
          <input
            type="text"
            name="Telephone"
            placeholder="Telephone"
            onChange={handleChange}
            value={formData.Telephone}
            className={inputCssStyles}
            required
          />

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatevendeurModal;