import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./AdminUsersPiechart";

const COLORS = ["#8884d8", "#82ca9d"];

const UserRolePieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((res) => {
        const users = res.data;

        const usersOnly = users.filter((user) => user.role === "user").length;
        const moderatorsOnly = users.filter(
          (user) => user.role === "moderator"
        ).length;

        const chartData = [
          { name: "Users", value: usersOnly },
          { name: "Moderators", value: moderatorsOnly },
        ];

        setData(chartData);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="usersChar">
      <h2 style={{ color: "rgba(0, 0, 0, 0.605)", paddingLeft: "270px" }}>
        User Role Distribution
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={120}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserRolePieChart;
