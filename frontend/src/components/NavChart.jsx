import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const NavChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">No data to display</div>;
  }

  // Show every nth point to avoid cluttering on large datasets
  const step = Math.ceil(data.length / 30);
  const displayData = data.filter((_, index) => index % step === 0 || index === data.length - 1);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={displayData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          label={{ value: "NAV (₹)", angle: -90, position: "insideLeft" }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value) => [`₹${value.toFixed(2)}`, "NAV"]}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
          }}
        />
        <Line
          type="monotone"
          dataKey="nav"
          stroke="#0066cc"
          dot={false}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default NavChart;
