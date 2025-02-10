"use client";

import {
  useGetJeuxQuery,
  useMettreEnVenteMutation,
  useRemettreMutation,
  useGetDepotsQuery,
  useGetVendeursQuery,
  useGetAllJeuxMarquesQuery,
} from "@/state/api";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Récupération des jeux, dépôts, vendeurs et marques via RTK Query
  const { data: products, isLoading, isError } = useGetJeuxQuery(searchTerm);
  const { data: depots } = useGetDepotsQuery();
  const { data: vendeurs } = useGetVendeursQuery();
  const { data: marques } = useGetAllJeuxMarquesQuery();

  const [mettreEnVente, { isLoading: isMettreEnVente }] = useMettreEnVenteMutation();
  const [remettre, { isLoading: isRemettre }] = useRemettreMutation();

  const handleToggleEnVente = async (id: number, miseEnVente: boolean) => {
    try {
      if (miseEnVente) {
        await remettre({ id, miseEnVente }).unwrap();
        console.log(`Le jeu ${id} a été remis à "non mis en vente".`);
      } else {
        await mettreEnVente({ id, miseEnVente: true }).unwrap();
        console.log(`Le jeu ${id} a été mis en vente.`);
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du jeu ${id}:`, error);
    }
  };

  // Trie des jeux par JeuID pour stabiliser l'ordre
  const sortedProducts = products?.slice().sort((a, b) => a.JeuID - b.JeuID);

  if (isLoading) {
    return <div className="py-4 text-center">Chargement...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Échec de la récupération des produits
      </div>
    );
  }

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

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Produits" />
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts?.map((product) => {
          // Récupérer la marque associée via JeuRef_id
          const brand = marques?.find((m) => m.JeuRef_id === product.JeuRef_id);
          // Récupérer le dépôt associé au jeu
          const depot = depots?.find((d) => d.ID_depot === product.depot_ID);
          // Récupérer le vendeur associé via le dépôt
          const vendor = depot ? vendeurs?.find((v) => v.VendeurID === depot.VendeurID) : null;

          return (
            <div
              key={product.JeuID}
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 transition-all hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                {/* Affichage du nom du jeu via le nom de la marque */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {brand?.Nom || "Nom du jeu inconnu"}
                </h3>
                {/* Affichage du vendeur qui a déposé le jeu */}
                <p className="text-sm text-gray-600 mb-2">
                  Déposé par: {vendor?.Nom || "Vendeur inconnu"}
                </p>
                <p className="text-gray-700 text-xl font-semibold mb-2">
                  ${product.prix_unitaire.toFixed(2)}
                </p>
                <div className="text-sm text-gray-600 mb-4">
                  Stock: {product.quantite_disponible}
                </div>

                {/* Bouton pour mettre en vente ou remettre */}
                <button
                  onClick={() =>
                    handleToggleEnVente(product.JeuID, product.mise_en_vente)
                  }
                  disabled={isMettreEnVente || isRemettre}
                  className={`mt-4 px-6 py-2 text-white font-bold rounded-lg transition-colors ${
                    product.mise_en_vente
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {product.mise_en_vente
                    ? "Déjà mis en vente"
                    : "Mettre en vente"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
