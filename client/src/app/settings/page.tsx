"use client";

import React, { useState, useEffect } from "react";
import {
  useCreateSessionMutation,
  useGetSessionsQuery,
  useCloseSessionMutation,
  useGetActiveSessionQuery,
  useGetManagersQuery,
  useCreateManagerMutation,
} from "@/state/api";
import { useAppDispatch } from "@/app/redux";
import { setActiveSession } from "@/state/globalSlice";

interface Gestionnaire {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
}

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // États de connexion
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // États du formulaire de session
  const [fraisDepot, setFraisDepot] = useState("");
  const [fraisVente, setFraisVente] = useState("");
  const [nomSession, setNomSession] = useState("");

  // Hooks pour les sessions
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useGetSessionsQuery();

  const {
    data: activeSessionData,
    error: activeSessionError,
    isLoading: activeSessionLoading,
    refetch: refetchActiveSession,
  } = useGetActiveSessionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [createSession, { isLoading: isCreatingSession }] =
    useCreateSessionMutation();
  const [closeSession, { isLoading: isClosingSession, isSuccess: closeSuccess }] =
    useCloseSessionMutation();

  // États pour le formulaire de création d'un nouveau manager
  const [newNom, setNewNom] = useState("");
  const [newPrenom, setNewPrenom] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newMotDePasse, setNewMotDePasse] = useState("");

  // Hooks pour les managers via RTK Query
  const {
    data: managersData,
    isLoading: managersLoading,
    refetch: refetchManagers,
  } = useGetManagersQuery();
  const [createManager, { isLoading: isCreatingManager }] =
    useCreateManagerMutation();

  // (Optionnel) Si vous souhaitez conserver une gestion locale des gestionnaires
  const [gestionnaires, setGestionnaires] = useState<Gestionnaire[]>([]);
  const [adminPassword] = useState("admin123");

  // Fonction de connexion (exemple simplifié)
  const handleLogin = () => {
    // Votre logique de connexion ici
    setIsLoggedIn(true);
  };

  // Fonction pour créer une session
  const handleCreateSession = async () => {
    if (activeSessionData && !activeSessionError) {
      alert(
        "Une session est déjà active. Veuillez fermer la session active avant de créer une nouvelle session."
      );
      return;
    }
    try {
      const newSession = await createSession({
        NomSession: nomSession,
        pourc_frais_depot: parseFloat(fraisDepot),
        pourc_frais_vente: parseFloat(fraisVente),
      }).unwrap();

      // Dispatch de la nouvelle session dans Redux
      dispatch(setActiveSession(newSession));

      // Réinitialiser le formulaire
      setFraisDepot("");
      setFraisVente("");
      setNomSession("");

      // Rafraîchir les données
      refetchSessions();
      refetchActiveSession();
    } catch (error) {
      console.error("Erreur lors de la création de la session :", error);
      alert("Erreur lors de la création de la session.");
    }
  };

  // Fonction pour fermer la session active
  const handleCloseSession = async () => {
    if (!activeSessionData) {
      alert("Aucune session active à fermer.");
      return;
    }
    try {
      await closeSession().unwrap();
      // Dispatch pour mettre à jour la session active à null
      dispatch(setActiveSession(null));
    } catch (error) {
      console.error("Erreur lors de la fermeture de la session :", error);
      alert("Erreur lors de la fermeture de la session.");
    }
  };

  // useEffect pour rafraîchir les sessions lorsque la fermeture réussit
  useEffect(() => {
    if (closeSuccess) {
      refetchSessions();
      refetchActiveSession();
    }
  }, [closeSuccess, refetchSessions, refetchActiveSession]);

  // Fonction pour créer un nouveau manager
  const handleAddManager = async () => {
    try {
      await createManager({
        Nom: newNom,
        Prenom: newPrenom,
        Email: newEmail,
        MdP: newMotDePasse,
      }).unwrap();
      // Réinitialiser le formulaire
      setNewNom("");
      setNewPrenom("");
      setNewEmail("");
      setNewMotDePasse("");
      // Refetch la liste des managers
      refetchManagers();
    } catch (error) {
      console.error("Erreur lors de la création du manager :", error);
      alert("Erreur lors de la création du manager.");
    }
  };

  // Fonction pour afficher le mot de passe d'un gestionnaire (si besoin)
  const handleShowPassword = (gestionnaire: Gestionnaire) => {
    const adminPass = prompt(
      "Veuillez entrer le mot de passe administrateur pour voir le mot de passe du gestionnaire :"
    );
    if (adminPass === adminPassword) {
      alert(`Mot de passe du gestionnaire ${gestionnaire.nom} : ${gestionnaire.motDePasse}`);
    } else {
      alert("Mot de passe administrateur incorrect.");
    }
  };

  // Écran de connexion
  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f0f5",
        }}
      >
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid #ddd",
            padding: "40px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
            width: "300px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>
            Connexion
          </h2>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page" style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      {/* Section de gestion des sessions */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid #ddd",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "bold" }}>Gestion des Sessions</h3>
        {activeSessionLoading ? (
          <p>Chargement de la session active...</p>
        ) : activeSessionData && !activeSessionError ? (
          <div style={{ marginBottom: "20px" }}>
            <h4>Session Active</h4>
            <p>
              <strong>Nom de la session:</strong> {activeSessionData.NomSession}
            </p>
            <p>
              <strong>Frais Dépôt:</strong> {activeSessionData.pourc_frais_depot}%
            </p>
            <p>
              <strong>Frais Vente:</strong> {activeSessionData.pourc_frais_vente}%
            </p>
            <button
              onClick={handleCloseSession}
              disabled={isClosingSession}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isClosingSession ? "Fermeture..." : "Fermer Session"}
            </button>
          </div>
        ) : (
          <div>
            <h4>Créer une Nouvelle Session</h4>
            <input
              type="text"
              placeholder="Frais Dépôt (%)"
              value={fraisDepot}
              onChange={(e) => setFraisDepot(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="Frais Vente (%)"
              value={fraisVente}
              onChange={(e) => setFraisVente(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="Nom de la Session"
              value={nomSession}
              onChange={(e) => setNomSession(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={handleCreateSession}
              disabled={isCreatingSession}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              {isCreatingSession ? "Création..." : "Créer Session"}
            </button>
          </div>
        )}
      </div>

      {/* Section Historique des sessions */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          borderRadius: "12px",
          border: "1px solid #ddd",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          height: "400px",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", maxHeight: "100%" }}>
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "20px",
              fontWeight: "bold",
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            Historique des Sessions
          </h3>
          {sessionsLoading ? (
            <p>Chargement des sessions...</p>
          ) : sessionsData && sessionsData.length > 0 ? (
            sessionsData.map((session) => (
              <div key={session.idSession} style={{ marginBottom: "20px" }}>
                <p>
                  <strong>Nom de la session:</strong> {session.NomSession}
                </p>
                <p>
                  <strong>Frais Dépôt:</strong> {session.pourc_frais_depot}%
                </p>
                <p>
                  <strong>Frais Vente:</strong> {session.pourc_frais_vente}%
                </p>
                {session.DateDebut && (
                  <p>
                    <strong>Date de début:</strong>{" "}
                    {new Date(session.DateDebut).toLocaleString()}
                  </p>
                )}
                {session.DateFin && (
                  <p>
                    <strong>Date de fin:</strong>{" "}
                    {new Date(session.DateFin).toLocaleString()}
                  </p>
                )}
                <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
              </div>
            ))
          ) : (
            <p>Aucune session enregistrée.</p>
          )}
        </div>
      </div>

      {/* Section Gestion des gestionnaires */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          borderRadius: "12px",
          border: "1px solid #ddd",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          height: "400px",
        }}
      >
        <div style={{ flex: 1, marginRight: "20px" }}>
          <h3 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "bold" }}>
            Ajouter Gestionnaire (Manager)
          </h3>
          <input
            type="text"
            placeholder="Nom"
            value={newNom}
            onChange={(e) => setNewNom(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Prénom"
            value={newPrenom}
            onChange={(e) => setNewPrenom(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={newMotDePasse}
            onChange={(e) => setNewMotDePasse(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleAddManager}
            disabled={isCreatingManager}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            {isCreatingManager ? "Création..." : "Ajouter Manager"}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", maxHeight: "100%" }}>
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "20px",
              fontWeight: "bold",
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            Liste des Managers
          </h3>
          {managersLoading ? (
            <p>Chargement des managers...</p>
          ) : managersData && managersData.length > 0 ? (
            managersData.map((manager) => (
              <div key={manager.UtilisateurID} style={{ marginBottom: "20px" }}>
                <p>
                  <strong>Nom:</strong> {manager.Nom}
                </p>
                <p>
                  <strong>Prénom:</strong> {manager.Prenom}
                </p>
                <p>
                  <strong>Email:</strong> {manager.Email}
                </p>
                <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
              </div>
            ))
          ) : (
            <p>Aucun manager enregistré.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
