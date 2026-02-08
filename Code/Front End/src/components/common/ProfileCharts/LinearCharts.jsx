import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";

  const activityData = [
    { date: "2025-04-10", posts: 2, likes: 5, comments: 3 },
    { date: "2025-04-11", posts: 4, likes: 2, comments: 6 },
    { date: "2025-04-12", posts: 1, likes: 8, comments: 4 },
    { date: "2025-04-13", posts: 3, likes: 4, comments: 2 },
    { date: "2025-04-14", posts: 5, likes: 7, comments: 5 },
    { date: "2025-04-15", posts: 5, likes: 7, comments: 11 },
    { date: "2025-04-16", posts: 5, likes: 10, comments: 1 },
    
    
  ];


  const LinearCharts =() => {
    return (
        <div className="card p-4 my-4">
      <h3 className="text-center mb-3">Your Detailed Activity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={activityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="posts" stroke="#8884d8" name="Posts" />
          <Line type="monotone" dataKey="likes" stroke="#82ca9d" name="Likes" />
          <Line type="monotone" dataKey="comments" stroke="#ff7f7f" name="Comments" />
        </LineChart>
      </ResponsiveContainer>
    </div>

    );
  };

  export default LinearCharts;