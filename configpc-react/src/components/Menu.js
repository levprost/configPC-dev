import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import axios from "axios";
import LogoutButton from "./Auth/LogoutButton";
import ButtonNav from "./constructs/ButtonNav";
import "./../styles/css/navbar.css";
import "./../styles/css/button.css";
import "./../styles/css/buttonNav.css";
import { IoMdExit } from "react-icons/io";

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

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }

    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/");
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
                <a href="">
                <ButtonNav
                  text="Configurations"
                  variant="hsl(0, 0.00%, 100.00%)"
                  glow={true}
                  href="/addconfiguration"
                />
                </a>
              </li>
              <li className="nav-item">
                <ButtonNav
                  text="Actualités"
                  variant="hsl(60, 100%, 50%)"
                  glow={false}
                />
              </li>
              {user ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link customLink">
                      {user.nick_name}
                    </span>
                  </li>
                  <li className="nav-item">
                    <LogoutButton></LogoutButton>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a href="/login">
                    <ButtonNav
                      text="Se connecter"
                      variant="hsl(120, 100%, 50%)"
                      glow={true}
                    />
                    </a>
                  </li>
                  <li className="nav-item">
                    <ButtonNav
                      text="S'inscrire"
                      variant="hsl(0, 0.00%, 100.00%)"
                      glow={false}
                    />
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
