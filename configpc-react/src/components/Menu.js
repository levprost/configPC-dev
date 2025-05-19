import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import axios from "axios";
import Button from "react-bootstrap/Button";
import LogoutButton from "./Auth/LogoutButton";
import ButtonNav from "./constructs/ButtonNav";
import "./../styles/css/navbar.css";
import "./../styles/css/buttonNav.css";


const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Pas de token!");
        return;
      }

      const res = await axios.get("http://127.0.0.1:8000/api/currentuser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("La reponse de serveur:", res.data);
      setUser(res.data.data.user);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de User",
        error.response || error
      );
    }
  };



  return (
    <div className="navigation">
      <nav className="navbar navbar-expand-lg customColor">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <Logo />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Button
                  onClick={() => navigate("/posts")}
                  className="btnStyle m-2"
                >
                  Actualités
                </Button>
              </li>
              <li className="nav-item">
                <Button
                  onClick={() => navigate("/addconfiguration")}
                  className="btnStyle m-2"
                >
                  Composants
                </Button>
              </li>
              <li className="nav-item">
                <Button
                  onClick={() => navigate("/configurations")}
                  className="btnStyle m-2"
                >
                  Configurations
                </Button>
              </li>
              {user ? (
                <>
                  <li className="nav-item m-2">
                    <span className="nav-link customLink">
                      {user.nick_name}
                    </span>
                  </li>
                  <li className="nav-item m-2">
                    <LogoutButton></LogoutButton>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item m-2">
                    <a href="/login">
                      <ButtonNav
                        text="Se connecter"
                        variant="hsl(120, 100%, 50%)"
                        glow={true}
                      />
                    </a>
                  </li>
                  <li className="nav-item">
                    <Button
                      onClick={() => navigate("/register")}
                      className="btnStyle m-2"
                    >
                      S'inscrire
                    </Button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
