"use client";

import { useState } from "react";
import {
  useGetVendeursQuery,
  useCreerVendeurMutation,
  useUpdateVendeurMutation,
} from "@/state/api";
import { useAppSelector } from "@/app/redux"; // Votre hook Redux personnalisé

const VendorsPage = () => {
  // Récupération du mode sombre via Redux (doit être vrai en mode sombre)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const { data: vendors = [], refetch } = useGetVendeursQuery();
  const [createVendor] = useCreerVendeurMutation();
  const [updateVendor] = useUpdateVendeurMutation();

  const [newVendor, setNewVendor] = useState({ Nom: "", Email: "", Telephone: "" });
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

  const handleAddVendor = async () => {
    try {
      await createVendor(newVendor).unwrap();
      setNewVendor({ Nom: "", Email: "", Telephone: "" });
      refetch();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un vendeur :", error);
    }
  };

  const handleUpdateVendor = async () => {
    if (selectedVendor) {
      try {
        const updatedVendor = {
          id: selectedVendor.VendeurID,
          data: {
            Nom: selectedVendor.Nom,
            Email: selectedVendor.Email,
            Telephone: selectedVendor.Telephone,
          },
        };

        await updateVendor(updatedVendor).unwrap();
        setSelectedVendor(null);
        refetch();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du vendeur :", error);
      }
    }
  };

  // Tri stable des vendeurs par VendeurID
  const sortedVendors = vendors.slice().sort((a, b) => a.VendeurID - b.VendeurID);

  return (
    // On applique "dark" si isDarkMode est vrai
    <div className={isDarkMode ? "dark" : ""}>
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl min-h-screen">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">
          Page des Vendeurs
        </h1>

        {/* Formulaire pour ajouter un nouveau vendeur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Nom</label>
            <input
              type="text"
              placeholder="Nom"
              value={newVendor.Nom}
              onChange={(e) => setNewVendor({ ...newVendor, Nom: e.target.value })}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={newVendor.Email}
              onChange={(e) => setNewVendor({ ...newVendor, Email: e.target.value })}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Téléphone</label>
            <input
              type="text"
              placeholder="Téléphone"
              value={newVendor.Telephone}
              onChange={(e) => setNewVendor({ ...newVendor, Telephone: e.target.value })}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
        </div>
        <button
          onClick={handleAddVendor}
          className="bg-blue-500 text-white py-3 px-6 w-full rounded-lg shadow-md hover:bg-blue-600 transition-colors mb-6"
        >
          Ajouter Vendeur
        </button>

        {/* Liste des vendeurs */}
        <ul>
          {sortedVendors.map((vendor) => (
            <li
              key={vendor.VendeurID}
              className="border p-4 mb-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{vendor.Nom}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email: {vendor.Email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone: {vendor.Telephone}</p>
              </div>
              <button
                onClick={() => setSelectedVendor(vendor)}
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Mettre à jour
              </button>
            </li>
          ))}
        </ul>

        {/* Formulaire de mise à jour */}
        {selectedVendor && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Mettre à jour Vendeur
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                <input
                  type="text"
                  placeholder="Nom"
                  value={selectedVendor.Nom}
                  onChange={(e) =>
                    setSelectedVendor({ ...selectedVendor, Nom: e.target.value })
                  }
                  className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={selectedVendor.Email}
                  onChange={(e) =>
                    setSelectedVendor({ ...selectedVendor, Email: e.target.value })
                  }
                  className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Téléphone</label>
                <input
                  type="text"
                  placeholder="Téléphone"
                  value={selectedVendor.Telephone}
                  onChange={(e) =>
                    setSelectedVendor({ ...selectedVendor, Telephone: e.target.value })
                  }
                  className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateVendor}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsPage;
