
"use client"

import { CheckCircle, Package, Tag, TrendingDown, TrendingUp } from "lucide-react";
import CardDepositSummary from "./CardDepositSummary";
import CardPopularGames from "./CardPopularGames";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";
import StockUpdate from "./Stockupdate";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
<CardPopularGames/>
<CardSalesSummary/>
<CardDepositSummary/>
<StockUpdate/>
<StatCard
        title="Clients & Deposits"
        primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2024"
        details={[
          {
            title: "Nombre de vendeurs",
            amount: "175",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Nombre de depots ",
            amount: "250",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
     <StatCard
        title="Chiffres d'affaires & Comission sur les ventes"
        primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2024"
        details={[
          {
            title: "Chiffres d'affaires",
            amount: "2500.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Comission sur les ventes",
            amount: "1470.00",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
  <StatCard
        title="Jeux Vendues & invendues"
        primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Vendues",
            amount: "1000",
            changePercentage: 20,
            IconComponent: TrendingUp,
          },
          {
            title: "Invendues",
            amount: "200",
            changePercentage: -10,
            IconComponent: TrendingDown,
          },
        ]} //modifier après par des informations venant de la base de données
        // pour card stat !!!!!! 
      />
      


  </div>
  );
};


export default Dashboard