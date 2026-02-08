import "./AdminVisitBarchart.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const colors = [
  "#A3CEF1", // January - blue-ish
  "#BFD8B8", // February - soft green
  "#F5D491", // March - light amber
  "#F2B5D4", // April - pink pastel
  "#C4C1E0", // May - soft lavender
  "#FFE5B4", // June - peach
  "#D1E8E2", // July - mint
  "#EAD5DC", // August - blush
  "#B5D6C3", // September - pale teal
  "#F9C6B3", // October - coral
  "#D3E4CD", // November - pale green
  "#CDE7F0", // December - icy blue
];

const VisitsChart = () => {
  const [data, setData] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    async function fetchVisits() {
      try {
        const response = await fetch(
          "https://localhost:7159/api/Admin/visits/monthly/2025",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch visits data");
        const apiData = await response.json();
        // Optionally, transform apiData to match recharts expected format
        setData([apiData]);
      } catch (err) {
        setData([]);
        // Optionally handle error (show toast, etc)
      }
    }
    fetchVisits();
  }, [token]);

  return (
    <div className="barchart">
      <h2>Visits Per Month & Year</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="jan" fill={colors[0]} />
          <Bar dataKey="feb" fill={colors[1]} />
          <Bar dataKey="mar" fill={colors[2]} />
          <Bar dataKey="april" fill={colors[3]} />
          <Bar dataKey="may" fill={colors[4]} />
          <Bar dataKey="june" fill={colors[5]} />
          <Bar dataKey="july" fill={colors[6]} />
          <Bar dataKey="aug" fill={colors[7]} />
          <Bar dataKey="sept" fill={colors[8]} />
          <Bar dataKey="oct" fill={colors[9]} />
          <Bar dataKey="nov" fill={colors[10]} />
          <Bar dataKey="dec" fill={colors[11]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitsChart;
