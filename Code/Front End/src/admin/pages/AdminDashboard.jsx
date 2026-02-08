import AdminVisitsBarchart from "../components/AdminCharts/AdminVisitsBarchart";
import TotalUsersCars from "../AdminCards/TotalUsersCard";
import TotalBooksCars from "../AdminCards/TotalBooksCard";
import TotalCommunityCard from "../AdminCards/TotalCommunityCard";
import PostsDonutChart from "../components/AdminCharts/PostsDonutChart";
import TotalPostsCard from "../AdminCards/TotalPostsCard";
import "./AdminDashboard.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";

export default function AdminDashboard() {
  const downloadPDF = () => {
    const input = document.getElementById("dashboard-content");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("dashboard.pdf");
    });
  };
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [postsCount, setPostsCount] = useState([]);
  const [booksCount, setBooksCount] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const { showError } = useToast();

  useEffect(() => {
    if (!token) return;
    axios
      .get("https://localhost:7159/api/Admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => {
        showError("Error fetching users", "error");
        console.error("Error fetching users:", error);
      });
  }, [token]);

  useEffect(() => {
    if (!token) return;
    axios
      .get("https://localhost:7159/api/Admin/communities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setCommunities(response.data))
      .catch((error) => {
        showError("Error fetching users", "error");
        console.error("Error fetching users:", error);
      });
  }, [token]);

  useEffect(() => {
    if (!token) return;
    axios
      .get("https://localhost:7159/api/Books/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setBooksCount(response.data))
      .catch((error) => {
        showError("Error fetching users", "error");
        console.error("Error fetching users:", error);
      });
  }, [token]);
  console.log("🟩 booksCount: ", booksCount);
  useEffect(() => {
    if (!token) return;
    axios
      .get("https://localhost:7159/api/Admin/community-posts-count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setPostsCount(response))
      .catch((error) => {
        showError("Error fetching users", "error");
        console.error("Error fetching users:", error);
      });
  }, [token]);
  console.log("🟩 postsCount: ", postsCount);

  const totalPosts = Array.isArray(postsCount.data)
    ? postsCount.data.reduce((acc, curr) => acc + curr.postCount, 0)
    : 0;

  return (
    <div className="admin-dashboard-root">
      <div id="dashboard-content" className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          <h2 className="admin-dashboard-title">Admin Dashboard</h2>
          <button className="pdf-button" onClick={downloadPDF}>
            Download Dashboard (PDF)
          </button>
        </div>
        <div className="admin-dashboard-barchart">
          <AdminVisitsBarchart />
        </div>
        <div className="admin-dashboard-summary-header">
          <h4 className="admin-dashboard-summary-title">Quick Summary</h4>
          <div className="admin-dashboard-summary-divider" />
        </div>
        <div className="admin-cards-container admin-dashboard-cards">
          <div className="admin-dashboard-card">
            <TotalUsersCars count={users.length} />
          </div>
          <div className="admin-dashboard-card">
            <TotalBooksCars count={booksCount} />
          </div>
          <div className="admin-dashboard-card">
            <TotalCommunityCard count={communities.length} />
          </div>
        </div>
        <div className="postscharts admin-dashboard-postscharts">
          <div className="admin-dashboard-postschart">
            <PostsDonutChart
              communitiesRes={communities}
              postsRes={postsCount.data}
            />
          </div>
          <div className="admin-dashboard-postscard">
            <TotalPostsCard counts={totalPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
