import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { incrementTime } from "../store/activity/activitySlice";

const useTrackActivity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      dispatch(incrementTime(today));
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);
};

export default useTrackActivity;
