import { NavLink } from "react-router-dom";
import { PlusCircle, List, Moon, Sun, User } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { theme, toggleTheme } = useAppContext();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h1 className="logo-text"> SMART SPEND</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard/harajatqoshish" 
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <PlusCircle size={22} />
          <span>Xarajat Qo'shish</span>
        </NavLink>

        <NavLink 
          to="/dashboard/songgi" 
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <List size={22} />
          <span>Sõnggi Xarajatlar</span>
        </NavLink>

        <NavLink 
          to="/dashboard/profile" 
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <User size={22} />
          <span>Profil</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? (
            <>
              <Moon size={20} />
              <span>Tungi Rejim</span>
            </>
          ) : (
            <>
              <Sun size={20} />
              <span>Kunduzgi Rejim</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;