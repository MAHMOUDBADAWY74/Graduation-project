import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./PostsDonutChart.css";
import PropTypes from "prop-types";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a0522d",
  "#8a2be2",
  "#00ced1",
  "#ff69b4",
];

const PostsDonutChart = ({ communitiesRes, postsRes }) => {
  const [chartData, setChartData] = useState([]);
  console.log("communites", communitiesRes);
  console.log("🟩 postsRes: ", postsRes);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsCount = postsRes;
        const communities = communitiesRes;

        const data = postsCount.map((item) => {
          const community = communities.find((c) => c.id == item.communityID);
          return {
            name: community ? community.name : "Unknown",
            value: item.postCount,
          };
        });
        console.log(data);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [communitiesRes, postsRes]);

  return (
    <div className="donut-chart">
      <h3>Posts summary</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
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

PostsDonutChart.propTypes = {
  communitiesRes: PropTypes.array.isRequired,
  postsRes: PropTypes.array.isRequired,
};

export default PostsDonutChart;
