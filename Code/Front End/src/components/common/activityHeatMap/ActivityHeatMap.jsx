import { useSelector } from "react-redux";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "./styles.css"; // We'll define custom colors here
// to test change history to data
// const Data = {
//   "2024-04-11": 5028,
//   "2024-04-12": 1549,
//   "2024-04-13": 2235,
//   "2024-04-14": 6161,
//   "2024-04-15": 10415,
//   "2024-04-16": 649,
//   "2024-04-17": 2184,
//   "2024-04-18": 7485,
//   "2024-04-19": 9560,
//   "2024-04-20": 2127,
//   "2024-04-21": 8017,
//   "2024-04-22": 3759,
//   "2024-04-23": 632,
//   "2024-04-24": 1629,
//   "2024-04-25": 6551,
//   "2024-04-26": 2562,
//   "2024-04-27": 8373,
//   "2024-04-28": 5113,
//   "2024-04-29": 59,
//   "2024-04-30": 1336,
//   "2024-05-01": 4050,
//   "2024-05-02": 3951,
//   "2024-05-03": 1673,
//   "2024-05-04": 6740,
//   "2024-05-05": 4075,
//   "2024-05-06": 5776,
//   "2024-05-07": 1271,
//   "2024-05-08": 6222,
//   "2024-05-09": 8255,
//   "2024-05-10": 7925,
//   "2024-05-11": 7217,
//   "2024-05-12": 5804,
//   "2024-05-13": 6918,
//   "2024-05-14": 9036,
//   "2024-05-15": 8534,
//   "2024-05-16": 5575,
//   "2024-05-17": 8177,
//   "2024-05-18": 2984,
//   "2024-05-19": 8942,
//   "2024-05-20": 546,
//   "2024-05-21": 7047,
//   "2024-05-22": 3780,
//   "2024-05-23": 4327,
//   "2024-05-24": 10703,
//   "2024-05-25": 6110,
//   "2024-05-26": 10449,
//   "2024-05-27": 3656,
//   "2024-05-28": 3043,
//   "2024-05-29": 8847,
//   "2024-05-30": 519,
//   "2024-05-31": 6894,
// };

const ActivityHeatmap = () => {
  // Get the user's activity history from Redux store
  const history = useSelector((state) => state.activity.history);

  // Set date range (1 year back from today)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  // Convert history object to an array compatible with CalendarHeatmap
  const data = Object.entries(history || {}).map(([date, seconds]) => ({
    date,
    count: Math.floor(seconds / 60), // Convert seconds to minutes
  }));

  return (
    <div className="container my-4">
      <div className="p-4 shadow-sm card">
        <h2 className="mb-4 text-center">Overall Daily Activity</h2>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={data}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.count >= 30) return "color-github-4";
            if (value.count >= 20) return "color-github-3";
            if (value.count >= 10) return "color-github-2";
            return "color-github-1";
          }}
          tooltipDataAttrs={(value) => {
            if (!value || !value.date) return null;
            return {
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-content": `${value.date} — ${value.count} minutes`,
            };
          }}
          
          showWeekdayLabels
        />
        <Tooltip id="heatmap-tooltip" />
      </div>
    </div>
  );
};

export default ActivityHeatmap;
