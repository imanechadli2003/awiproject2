"use client";

import React, { useState, useEffect } from "react";
import {
  useGetSessionsQuery,
  useGetVendeursQuery,
  useGetBilanVendeurSessionQuery,
} from "../../state/api";
import { Bar, Doughnut, Radar } from "react-chartjs-2";
import { useAppSelector } from "@/app/redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistrement des éléments nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Définition d'un type pour le bilan
type BilanType = {
  total_depots: number;
  total_ventes: number;
  total_stocks: number;
  total_gains: number;
  total_comissions: number;
};

const emptyBilan: BilanType = {
  total_depots: 0,
  total_ventes: 0,
  total_stocks: 0,
  total_gains: 0,
  total_comissions: 0,
};

const BilanVendeurSessionPage: React.FC = () => {
  // Récupération du mode sombre via Redux
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // États locaux pour la session et le vendeur sélectionnés
  const [selectedSession, setSelectedSession] = useState<number | "">("");
  const [selectedVendeur, setSelectedVendeur] = useState<number | "">("");
  const [buttonHover, setButtonHover] = useState(false);
  const [hoveredGraph, setHoveredGraph] = useState<number | null>(null);

  // State local pour afficher le bilan (nettoyé dès que la sélection change)
  const [displayedBilan, setDisplayedBilan] = useState<BilanType>(emptyBilan);

  // Récupération des sessions et des vendeurs via RTK Query
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useGetSessionsQuery();
  const { data: vendeurs, isLoading: vendeursLoading, error: vendeursError } = useGetVendeursQuery();

  // Récupération du bilan pour le vendeur et la session sélectionnés
  const {
    data: bilan,
    isLoading: bilanLoading,
    refetch,
  } = useGetBilanVendeurSessionQuery(
    {
      vendeurId: typeof selectedVendeur === "number" ? selectedVendeur : 0,
      sessionId: typeof selectedSession === "number" ? selectedSession : 0,
    },
    {
      skip: selectedSession === "" || selectedVendeur === "",
      refetchOnMountOrArgChange: true,
    }
  );

  // Dès que la sélection change, on réinitialise le bilan affiché
  useEffect(() => {
    setDisplayedBilan(emptyBilan);
  }, [selectedSession, selectedVendeur]);

  // Dès que la réponse de la requête change et que la requête n'est plus en chargement,
  // on met à jour le bilan affiché.
  useEffect(() => {
    if (!bilanLoading) {
      if (bilan) {
        setDisplayedBilan(bilan);
      } else {
        // Si aucun bilan n'est retourné, on garde l'objet vide
        setDisplayedBilan(emptyBilan);
      }
    }
  }, [bilan, bilanLoading]);

  // Gestion des changements de sélection
  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSession(value ? Number(value) : "");
  };

  const handleVendeurChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedVendeur(value ? Number(value) : "");
  };

  const handleGenerateBilan = () => {
    if (selectedSession !== "" && selectedVendeur !== "") {
      refetch();
    }
  };

  if (sessionsLoading || vendeursLoading)
    return <p style={{ textAlign: "center" }}>Chargement des données...</p>;
  if (sessionsError || vendeursError)
    return <p style={{ textAlign: "center", color: "red" }}>Erreur lors du chargement des données.</p>;

  // ---------------------------
  // Styles (inchangés)
  // ---------------------------
  const containerStyle: React.CSSProperties = {
    padding: "40px",
    background: isDarkMode
      ? "linear-gradient(135deg, #1e1e1e, #2e2e2e)"
      : "linear-gradient(135deg, #f0f0f0, #e0e0e0)",
    minHeight: "100vh",
    fontFamily: "'Roboto', sans-serif",
    color: isDarkMode ? "#e0e0e0" : "#333",
    transition: "background 0.3s ease, color 0.3s ease",
  };

  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "40px",
    fontSize: "2.5rem",
  };

  const formContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "30px",
  };

  const selectStyle: React.CSSProperties = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid " + (isDarkMode ? "#555" : "#ccc"),
    minWidth: "220px",
    fontSize: "16px",
    backgroundColor: isDarkMode ? "#333" : "#fff",
    color: isDarkMode ? "#e0e0e0" : "#333",
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "12px 24px",
    backgroundColor: isDarkMode ? "#555" : "#ddd",
    color: isDarkMode ? "#fff" : "#333",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? "#666" : "#ccc",
    transform: "scale(1.02)",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? "#333" : "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: isDarkMode
      ? "0 4px 20px rgba(0,0,0,0.6)"
      : "0 4px 20px rgba(0,0,0,0.1)",
    marginBottom: "40px",
    textAlign: "center",
  };

  const graphsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    justifyContent: "center",
  };

  const graphCardStyle: React.CSSProperties = {
    width: "400px",
    height: "400px",
    backgroundColor: isDarkMode ? "#333" : "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: isDarkMode
      ? "0 4px 20px rgba(0,0,0,0.6)"
      : "0 4px 20px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
  };

  const graphCardHoverStyle: React.CSSProperties = {
    transform: "scale(1.05)",
  };

  // Palette de couleurs pour les graphiques
  const chartColors = {
    background: ["#4A90E2", "#50E3C2", "#9013FE", "#7ED321", "#D0021B"],
    border: ["#4178BE", "#45B3A0", "#7B0EB7", "#6CA31C", "#B00118"],
  };

  // Préparation des données pour les graphiques en utilisant displayedBilan
  const metricsData = [
    displayedBilan.total_depots,
    displayedBilan.total_ventes,
    displayedBilan.total_stocks,
    displayedBilan.total_gains,
    displayedBilan.total_comissions,
  ];

  const barChartData = {
    labels: [
      "Total Dépôts",
      "Total Ventes",
      "Total Stocks",
      "Total Gains",
      "Total Commissions",
    ],
    datasets: [
      {
        label: "Performance",
        data: metricsData,
        backgroundColor: chartColors.background,
        borderColor: chartColors.border,
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: [
      "Total Dépôts",
      "Total Ventes",
      "Total Stocks",
      "Total Gains",
      "Total Commissions",
    ],
    datasets: [
      {
        label: "Performance",
        data: metricsData,
        backgroundColor: chartColors.background,
        borderColor: chartColors.background.map(() => "#fff"),
        borderWidth: 1,
      },
    ],
  };

  const radarChartData = {
    labels: [
      "Total Dépôts",
      "Total Ventes",
      "Total Stocks",
      "Total Gains",
      "Total Commissions",
    ],
    datasets: [
      {
        label: "Performance",
        data: metricsData,
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        borderColor: "#4A90E2",
        pointBackgroundColor: "#4A90E2",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#4A90E2",
      },
    ],
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Bilan du Vendeur pour une Session Précise</h1>

      {/* Formulaire de sélection */}
      <div style={formContainerStyle}>
        <select
          id="session-select"
          onChange={handleSessionChange}
          value={selectedSession}
          style={selectStyle}
        >
          <option value="">-- Sélectionnez une session --</option>
          {sessions &&
            sessions.map((session: any) => (
              <option key={session.idSession} value={session.idSession}>
                {session.NomSession}
              </option>
            ))}
        </select>
        <select
          id="vendeur-select"
          onChange={handleVendeurChange}
          value={selectedVendeur}
          style={selectStyle}
        >
          <option value="">-- Sélectionnez un vendeur --</option>
          {vendeurs &&
            vendeurs.map((vendeur: any) => (
              <option key={vendeur.VendeurID} value={vendeur.VendeurID}>
                {vendeur.Nom}
              </option>
            ))}
        </select>
      </div>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button
          onClick={handleGenerateBilan}
          disabled={selectedSession === "" || selectedVendeur === ""}
          style={{ ...buttonStyle, ...(buttonHover ? buttonHoverStyle : {}) }}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          Générer le bilan
        </button>
      </div>

      {bilanLoading && (
        <p style={{ textAlign: "center", color: isDarkMode ? "#e0e0e0" : "#333" }}>
          Chargement du bilan...
        </p>
      )}

      {/* Affichage des statistiques et graphiques */}
      {(displayedBilan || (!displayedBilan && !bilanLoading)) && (
        <>
          <div style={cardStyle}>
            <h2>Statistiques</h2>
            <p>Total Dépôts : {displayedBilan.total_depots}</p>
            <p>Total Ventes : {displayedBilan.total_ventes}</p>
            <p>Total Stocks : {displayedBilan.total_stocks}</p>
            <p>Total Gains : {displayedBilan.total_gains}</p>
            <p>Total Commissions : {displayedBilan.total_comissions}</p>
          </div>

          <div style={graphsContainerStyle}>
            {[
              { type: "Bar", data: barChartData },
              { type: "Doughnut", data: doughnutChartData },
              { type: "Radar", data: radarChartData },
            ].map((chart, index) => (
              <div
                key={index}
                style={{
                  ...graphCardStyle,
                  ...(hoveredGraph === index ? graphCardHoverStyle : {}),
                }}
                onMouseEnter={() => setHoveredGraph(index)}
                onMouseLeave={() => setHoveredGraph(null)}
              >
                {chart.type === "Bar" && (
                  <Bar
                    data={chart.data}
                    options={{
                      responsive: true,
                      plugins: { title: { display: true, text: "Bar Chart" } },
                      scales: { y: { beginAtZero: true } },
                    }}
                  />
                )}
                {chart.type === "Doughnut" && (
                  <Doughnut
                    data={chart.data}
                    options={{
                      responsive: true,
                      plugins: { title: { display: true, text: "Doughnut Chart" } },
                    }}
                  />
                )}
                {chart.type === "Radar" && (
                  <Radar
                    data={chart.data}
                    options={{
                      responsive: true,
                      plugins: { title: { display: true, text: "Radar Chart" } },
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BilanVendeurSessionPage;
