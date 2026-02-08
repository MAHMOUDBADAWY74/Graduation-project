import { Outlet } from "react-router-dom";
import Header from "../components/common/Header/Header";
import { useLocation } from "react-router-dom";
import Footer from "../components/common/Footer/Footer";

export default function MainLayout() {
  const location = useLocation();
  const isCommunityPage = location.pathname === "/community";
  return (
    <>
      <Header />
      <Outlet />
      {!isCommunityPage && <Footer />}
    </>
  );
}
