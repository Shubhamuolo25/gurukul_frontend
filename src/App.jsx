import "./App.css";
import Header from "./components/header.jsx";
import Sidebar from "./components/sidebar.jsx";
import PaginatedCards from "./components/paginatedCards.jsx";

function App() {
  return (
    <div>
      <Header />
      <div id="main-container">
        <Sidebar />
        <div className="content">
          <h2 id="headingInContent">Our Team</h2>
          <PaginatedCards />
        </div>
      </div>
    </div>
  );
}

export default App;