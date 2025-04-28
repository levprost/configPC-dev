import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";

const LogoutButton = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Supprimer le token
    toast.success("Déconnexion réussie !", { position: "top-right" });

    setTimeout(() => {
      navigate("/login", { replace: true }); 
    }, 1500);
  };
  if (!token) {
    return null;
  }

  return (
    <Button variant="danger" className='glowing-btn' onClick={handleLogout}>
      Déconnexion
    </Button>
  );
};

export default LogoutButton;