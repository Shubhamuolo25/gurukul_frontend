// import Sidebar from "../components/sidebar";
import UserForm from "../components/userForm.jsx";
// import Header from "../components/header.jsx";
import "./createUser.css";
import MainLayout from "../components/layout.jsx";
//TODO: no need for this-Removed loadingState--Done
function CreateProfile() {
  return (
    <MainLayout>
        <div className="createuser-content">
          <UserForm />
        </div>
    </MainLayout>
  );
}
export default CreateProfile;