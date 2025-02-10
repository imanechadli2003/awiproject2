"use client";

import React, { useState } from "react";
import {
  useGetJeuxEnVenteQuery,
  useCreerAchatMutation,
  useGetDepotsQuery,
  useGetVendeursQuery,
  useGetAllJeuxMarquesQuery,
} from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Button, Modal, TextField } from "@mui/material";
import { SearchIcon } from "lucide-react";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: jeux, error, isLoading } = useGetJeuxEnVenteQuery(searchTerm);
  const { data: depots } = useGetDepotsQuery();
  const { data: vendeurs } = useGetVendeursQuery();
  const { data: marques } = useGetAllJeuxMarquesQuery();
  const [createAchat] = useCreerAchatMutation();

  // State pour la sélection et les quantités
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mise à jour de la sélection des lignes
  const handleRowSelection = (selection: GridRowSelectionModel) => {
    setSelectedRows(selection);
  };

  // Gestion du changement de quantité
  const handleQuantityChange = (jeuId: string, value: string) => {
    const quantite = parseInt(value, 10);
    setQuantities((prev) => ({
      ...prev,
      [Number(jeuId)]: !isNaN(quantite) && quantite > 0 ? quantite : 0,
    }));
  };

  // Fonction pour créer l'achat (handleCreateAchat)
  const handleCreateAchat = async () => {
    const selectedGames = selectedRows.map((rowId) => ({
      JeuID: Number(rowId),
      quantite: quantities[Number(rowId)] || 1,
    }));

    try {
      await createAchat({ selectedGames }).unwrap();
      alert("Achat créé avec succès !");
      setIsModalOpen(false);
      // Réinitialiser la sélection et les quantités
      setSelectedRows([]);
      setQuantities({});
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l'achat.");
    }
  };

  // Calculer le total pour chaque jeu (prix_unitaire * quantité)
  const getLineTotal = (jeuId: number, prixUnitaire: number) => {
    const quantity = quantities[jeuId] || 1;
    return (prixUnitaire * quantity).toFixed(2);
  };

  // Calculer le total général de l'achat
  const overallTotal = selectedRows.reduce((sum: number, rowId) => {
    const jeuId = Number(rowId);
    const jeu = jeux?.find((j) => j.JeuID === jeuId);
    const quantity = quantities[jeuId] || 1;
    return jeu ? sum + (jeu.prix_unitaire * quantity) : sum;
  }, 0);
  

  if (isLoading) {
    return <div className="py-4 text-center">Chargement...</div>;
  }

  if (error || !jeux) {
    return (
      <div className="text-center text-red-500 py-4">
        Échec de la récupération des produits
      </div>
    );
  }

  // Définir les colonnes du DataGrid
  const columns: GridColDef[] = [
    { field: "JeuID", headerName: "ID du Jeu", width: 180 },
    {
      field: "JeuRef_id",
      headerName: "Marque",
      width: 220,
      renderCell: (params) => {
        // Recherche de la marque correspondante via JeuRef_id
        const brand = marques?.find((m) => m.JeuRef_id === params.value);
        return brand ? brand.Nom : "Chargement...";
      },
    },
    {
      field: "prix_unitaire",
      headerName: "Prix (€)",
      width: 200,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
    {
      field: "quantite_disponible",
      headerName: "Quantité Disponible",
      width: 220,
      type: "number",
    },
  ];

  return (
    <div className="mx-auto pb-5 w-full px-4">
      {/* SEARCH BAR */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
          <SearchIcon className="w-5 h-5 text-gray-600 ml-3" />
          <input
            className="w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Produits" />
      </div>

      {/* DataGrid - Liste des produits */}
      <div className="w-full max-w-7xl">
        <DataGrid
          rows={jeux}
          columns={columns}
          getRowId={(row) => row.JeuID}
          checkboxSelection
          onRowSelectionModelChange={handleRowSelection}
          className="bg-white shadow-lg rounded-lg border border-gray-200"
        />
      </div>

      {/* Bouton pour ouvrir le modal d'achat */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
        className="mb-6 mt-4"
      >
        Faire un achat
      </Button>

      {/* Modal d'achat */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 mx-auto mt-16 transform transition-all ease-in-out max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Confirmer l'achat
          </h2>
          {selectedRows.map((rowId) => {
            const jeuId = Number(rowId);
            const jeu = jeux.find((j) => j.JeuID === jeuId);
            if (!jeu) return null;
            return (
              <div key={rowId} className="mb-6">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium">
                    <strong>{jeu.jeuxMarque?.Nom || `Jeu ${jeu.JeuID}`}</strong> - ${Number(jeu.prix_unitaire).toFixed(2)} x{" "}
                    <span className="font-semibold">
                      {quantities[jeuId] || 1}
                    </span>
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    Total: ${getLineTotal(jeuId, jeu.prix_unitaire)}
                  </p>
                </div>
                <TextField
                  label="Quantité"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={quantities[jeuId] || ""}
                  onChange={(e) => handleQuantityChange(rowId as string, e.target.value)}
                  className="mt-2"
                />
              </div>
            );
          })}

          <div className="flex justify-end mt-4">
            <p className="text-xl font-bold">
              Total Général: ${overallTotal.toFixed(2)}
            </p>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <Button variant="outlined" color="secondary" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateAchat}
              disabled={selectedRows.length === 0}
            >
              Confirmer l'achat
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;
