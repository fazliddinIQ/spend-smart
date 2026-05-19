import { Outlet } from "react-router-dom";
import Sidebar from "../../component/Sidebar/Sidebar";
import Navbar from "../../component/Navbar/Navbar";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="main-content-area p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;