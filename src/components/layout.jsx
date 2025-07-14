import Header from "./header.jsx";
import Sidebar from "./sidebar.jsx";
// If Sidebar is a named export, use:
// import { Sidebar } from "./sidebar.jsx";
import "../App.css";
import "./layout.css";

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
