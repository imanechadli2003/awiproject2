"use client";

import React, { useState } from "react";
import {
  useGetVendeursQuery,
  useCreerDepotMutation,
  useGetAllJeuxMarquesQuery,
  useGetActiveSessionQuery,
  useGetDepotsQuery,
} from "@/state/api";
import {
  Button,
  Modal,
  TextField,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

export type depotformdata = {
  VendeurID: number;
  jeux: { nomJeu: number; prixUnitaire: number; quantite_depose: number }[];
};

type CreateDepotModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: depotformdata) => void;
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateDepotModalProps) => {
  const { data: vendeurs, isLoading: vendeursLoading } = useGetVendeursQuery();
  const { data: jeuxMarques, isLoading: marquesLoading } = useGetAllJeuxMarquesQuery();
  // Récupération de la session active pour obtenir le pourcentage de frais de dépôt
  const { data: activeSession } = useGetActiveSessionQuery();

  const [createDepot, { isLoading: isCreatingDepot }] = useCreerDepotMutation();

  // State initial pour le formulaire de dépôt
  const initialFormData: depotformdata = {
    VendeurID: 0,
    jeux: [],
  };

  const [formData, setFormData] = useState<depotformdata>(initialFormData);

  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const handleVendeurChange = (event: SelectChangeEvent<string>) => {
    const vendeurId = parseInt(event.target.value, 10);
    setFormData({ ...formData, VendeurID: vendeurId });
  };

  const handleJeuChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newJeux = [...formData.jeux];
    newJeux[index] = { ...newJeux[index], [field]: parseInt(value.toString(), 10) };
    setFormData({ ...formData, jeux: newJeux });
  };

  const handleAddJeu = () => {
    setFormData({
      ...formData,
      jeux: [
        ...formData.jeux,
        { nomJeu: 0, prixUnitaire: 0, quantite_depose: 0 },
      ],
    });
  };

  const handleRemoveJeu = (index: number) => {
    const newJeux = formData.jeux.filter((_, i) => i !== index);
    setFormData({ ...formData, jeux: newJeux });
  };

  // Calcul du total des dépôts : somme sur chaque jeu (prixUnitaire * quantite_depose)
  const totalDeposits = formData.jeux.reduce((acc, jeu) => {
    return acc + (jeu.prixUnitaire * jeu.quantite_depose);
  }, 0);

  // Calcul des frais de dépôt basés sur le pourcentage de frais de dépôt de la session active
  const depotFeePercentage = activeSession?.pourc_frais_depot || 0;
  const totalFraisDepot = (depotFeePercentage / 100) * totalDeposits;

  const handleSubmit = async () => {
    if (!formData.VendeurID) {
      alert("Veuillez sélectionner un vendeur.");
      return;
    }
    if (formData.jeux.length === 0) {
      alert("Veuillez ajouter au moins un jeu.");
      return;
    }
    if (
      formData.jeux.some(
        (jeu) =>
          !jeu.nomJeu || jeu.prixUnitaire <= 0 || jeu.quantite_depose <= 0
      )
    ) {
      alert("Vérifiez les informations des jeux (nom, prix unitaire et quantité).");
      return;
    }
  
    console.log("Données du dépôt : ", {
      vendeurId: formData.VendeurID,
      jeux: formData.jeux,
    });
  
    try {
      await createDepot({
        vendeurId: formData.VendeurID,
        jeux: formData.jeux.map((jeu) => ({
          nomJeu: jeu.nomJeu,  // l'ID de la marque
          prixUnitaire: jeu.prixUnitaire,
          quantite_depose: jeu.quantite_depose,
        })),
      }).unwrap();
      
      alert("Dépôt créé avec succès !");
      
      // Réinitialiser le formulaire pour permettre la création d'un nouveau dépôt
      setFormData(initialFormData);
      setQuantities({});
      
      // Vous pouvez appeler onCreate ici si nécessaire
      onCreate(formData);
      
      // Fermer le modal
      onClose();
    } catch (err) {
      console.error("Erreur lors de la création du dépôt", err);
      alert("Erreur lors de la création du dépôt.");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h2>Ajouter un Dépôt</h2>

        {/* Sélection du vendeur */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Vendeur</InputLabel>
          <Select
            value={formData.VendeurID.toString()}
            onChange={handleVendeurChange}
            label="Vendeur"
          >
            {vendeurs?.map((vendeur) => (
              <MenuItem key={vendeur.VendeurID} value={vendeur.VendeurID}>
                {vendeur.Nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Ajouter des jeux */}
        {formData.jeux.map((jeu, index) => (
          <Box key={index} sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Jeu</InputLabel>
              <Select
                value={jeu.nomJeu.toString()}
                onChange={(e) =>
                  handleJeuChange(index, "nomJeu", e.target.value)
                }
                label="Jeu"
              >
                {jeuxMarques?.map((marque) => (
                  <MenuItem key={marque.JeuRef_id} value={marque.JeuRef_id}>
                    {marque.Nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Prix Unitaire"
              type="number"
              value={jeu.prixUnitaire}
              onChange={(e) =>
                handleJeuChange(index, "prixUnitaire", e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantité Déposée"
              type="number"
              value={jeu.quantite_depose}
              onChange={(e) =>
                handleJeuChange(index, "quantite_depose", e.target.value)
              }
              fullWidth
              margin="normal"
            />

            <Button
              onClick={() => handleRemoveJeu(index)}
              color="secondary"
              variant="outlined"
              sx={{ mt: 1 }}
            >
              Supprimer le jeu
            </Button>
          </Box>
        ))}

        <Button
          onClick={handleAddJeu}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Ajouter un jeu
        </Button>

        {/* Affichage du total des dépôts et des frais de dépôt */}
        <Box sx={{ mt: 2, p: 1, backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
          <p>
            <strong>Total des dépôts :</strong> ${totalDeposits.toFixed(2)}
          </p>
          <p>
            <strong>Frais de dépôt ({depotFeePercentage}%):</strong> ${totalFraisDepot.toFixed(2)}
          </p>
        </Box>

        {/* Boutons de validation */}
        <Box sx={{ display: "flex", justifyContent: "end", mt: 2, gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isCreatingDepot}
          >
            {isCreatingDepot ? <CircularProgress size={24} /> : "Déposer"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateProductModal;


