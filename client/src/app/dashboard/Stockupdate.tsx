import { useGetDashboardMetricsQuery } from "@/state/api";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const colors = ["#00C49F", "#0088FE", "#FFBB28"]; // Tu peux ajuster les couleurs ici

const StockUpdate = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  const totalDeposited = dashboardMetrics?.jeuxInvendus || 0; // Total des jeux déposés
  const totalSold = dashboardMetrics?.jeuxVendues || 0; // Total des jeux vendus
  const totalStocked = dashboardMetrics?.jeuxStockes || 0; // Total des jeux stockés

  // Données à passer au graphique
  const pieData = [
    { name: "Jeux Déposés", value: totalDeposited },
    { name: "Jeux Vendus", value: totalSold },
    { name: "Jeux Stockés", value: totalStocked },
  ];

  return (
    <div className="row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Jeux Déposés/Vendus/Stockés
            </h2>
            <hr />
          </div>

          {/* BODY */}
          <div className="xl:flex justify-between pr-7">
            {/* CHART */}
            <div className="relative basis-3/5">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Total Label */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center basis-2/5">
                <span className="font-bold text-xl">
                  {totalStocked + totalSold + totalDeposited}
                </span>
              </div>
            </div>

            {/* LABELS */}
            <ul className="flex flex-col justify-around items-center xl:items-start py-5 gap-3">
              {pieData.map((entry, index) => (
                <li key={`legend-${index}`} className="flex items-center text-xs">
                  <span
                    className="mr-2 w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: colors[index % colors.length],
                    }}
                  ></span>
                  {entry.name}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default StockUpdate;
