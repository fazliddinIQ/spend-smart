import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area
} from "recharts";

const ExpenseChart = ({ data, type }) => {
  // Osonroq chart render qilish uchun datalarni guruhlash
  let chartData = [];

  if (type === "Bugun") {
    // Soatlar bo'yicha guruhlash
    const hourly = {};
    data.forEach(item => {
      const h = new Date(item.date).getHours() + ":00";
      hourly[h] = (hourly[h] || 0) + item.amount;
    });
    chartData = Object.keys(hourly).map(key => ({ name: key, total: hourly[key] }));
  } else if (type === "Bu Oy") {
    // Kunlar bo'yicha
    const daily = {};
    data.forEach(item => {
      const d = new Date(item.date).getDate() + "-kun";
      daily[d] = (daily[d] || 0) + item.amount;
    });
    chartData = Object.keys(daily).map(key => ({ name: key, total: daily[key] }));
  } else {
    // Oylar bo'yicha
    const monthly = {};
    const monthNames = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
    data.forEach(item => {
      const m = monthNames[new Date(item.date).getMonth()];
      monthly[m] = (monthly[m] || 0) + item.amount;
    });
    chartData = Object.keys(monthly).map(key => ({ name: key, total: monthly[key] }));
  }

  // Sort by name conceptually (simple sort for now)
  chartData.sort((a, b) => a.name.localeCompare(b.name));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "var(--glass-bg)", padding: "10px", borderRadius: "8px", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }}>
          <p>{`${label} : $${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        {type === "Bu Oy" || type === "Umumiy" ? (
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: "var(--text-secondary)"}} />
            <YAxis stroke="var(--text-secondary)" tick={{fill: "var(--text-secondary)"}} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="total" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorTotal)" />
          </AreaChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: "var(--text-secondary)"}} />
            <YAxis stroke="var(--text-secondary)" tick={{fill: "var(--text-secondary)"}} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
