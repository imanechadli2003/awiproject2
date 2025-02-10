"use client";

import React, { useState } from "react";
import {
  useGetDepotsQuery,
  useGetVendeurByIdQuery,
} from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material"; // Importer le bouton
import CreateProductModal, { depotformdata } from "./createdepot";

const Inventory = () => {
  const { data: depots, error: depotsError, isLoading: depotsLoading } = useGetDepotsQuery();
  
  // État pour gérer l'ouverture du modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour ouvrir le modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Fonction pour créer un dépôt (lorsque le formulaire est soumis dans le modal)
  const handleCreateDepot = (formData: depotformdata) => {
    console.log("Dépôt créé avec les données :", formData);
    // Ici, tu peux appeler ta fonction de création de dépôt (mutation)
    // Ensuite, ferme le modal après la création
    handleCloseModal();
  };

  if (depotsLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (depotsError || !depots) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch data
      </div>
    );
  }

  const columns: GridColDef[] = [
    { field: "ID_depot", headerName: "ID du depot", width: 200 },
    {
      field: "VendeurID",
      headerName: "Vendeur du dépôt",
      width: 200,
      renderCell: (params) => {
        const { data: vendeur } = useGetVendeurByIdQuery(params.value);
        return vendeur ? vendeur.Nom : "Loading...";
      },
    },
    {
      field: "date_depot",
      headerName: "Date du dépôt",
      width: 250,
    },
    {
      field: "comission_depot_total",
      headerName: "Frais du dépôt payé",
      width: 250,
      type: "number",
    },
  ];

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />

      {/* Bouton pour ouvrir le modal */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        className="mb-4"
      >
        Ajouter un dépôt
      </Button>

      <DataGrid
        rows={depots}
        columns={columns}
        getRowId={(row) => row.ID_depot}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />

      {/* Modal pour ajouter un dépôt */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateDepot}
      />
    </div>
  );
};

export default Inventory;
