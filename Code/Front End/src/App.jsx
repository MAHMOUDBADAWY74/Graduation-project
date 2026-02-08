import "bootstrap/dist/css/bootstrap.min.css";
import "../src/styles/animation.css";
import "../src/styles/variables.css";
import "../src/styles/colors.css";
import "./App.css";
import "@react-pdf-viewer/core/lib/styles/index.css";

import AppRoute from "./routes/AppRoute";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import useTrackActivity from "./hooks/useTrackActivity";

function App() {
  useTrackActivity();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <AppRoute />
    </>
  );
}

export default App;
