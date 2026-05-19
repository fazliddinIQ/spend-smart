// src/page/Chart/Chart.jsx
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./Chart.css";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];

const Chart = ({ items }) => {
  const data = Object.values(
    items.reduce((acc, cur) => {
      acc[cur.category] = acc[cur.category] || { name: cur.category, value: 0 };
      acc[cur.category].value += Number(cur.amount);
      return acc;
    }, {})
  );

  if (data.length === 0) return null;

  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value" nameKey="name" outerRadius={100}>
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default Chart;