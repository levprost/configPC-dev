import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./../../styles/css/homePage.css";
import "./../../styles/css/logreg.css"

function RegisterForm() {
  document.title = "Créer un compte";

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();


  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    if (!data.acceptConditions) {
      toast.error("Vous devez accepter les conditions de notre politique de confidentialité et le RGPD pour vous inscrire.", { position: "top-right" });
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/register`, data);
      if (res.status === 201) {
        toast.success("Compte créé avec succès ! 🚀", { position: "top-right" });
        navigate("/admin/brands");
      }
    } catch (err) {
      toast.error("Erreur lors de la création du compte", { position: "top-right" });
    }
  };

  return (
    <div className="login-form row justify-content-center ">
      <ToastContainer />
      <Form onSubmit={handleSubmit(onSubmit)} className="col-lg-8 col-md-10 col-sm-12 mainlogreg">
        <h3 className="Auth-form-title">Créer un compte</h3>
        <div className="mainlogreg">

        <Form.Group className="mb-3" controlId="formBasicText">
          <Form.Label>Pseudo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Votre pseudo"
            {...register("nick_name", { required: "Pseudo obligatoire" })}
          />
          {errors.nick_name && (
            <Form.Text className="text-danger">{errors.nick_name.message}</Form.Text>
          )}
        </Form.Group>

        {/* Champ Email */}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Adresse mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="johndoe@unknown.fr"
            {...register("email_user", { required: "Adresse mail obligatoire" })}
          />
          {errors.email_user && (
            <Form.Text className="text-danger">{errors.email_user.message}</Form.Text>
          )}
        </Form.Group>

        {/* Champ Mot de passe */}
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Mot de passe</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              {...register("password", {
                required: "Mot de passe est obligatoire",
                minLength: {
                  value: 8,
                  message: "Longueur minimale de 8 caractères",
                },
                pattern: {
                  value: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#:$%^&])/,
                  message:
                    "Le mot de passe doit contenir une minuscule, une majuscule, un chiffre et un caractère spécial",
                },
              })}
            />
            <InputGroup.Text onClick={handleClickShowPassword} style={{ cursor: "pointer" }}>
              {showPassword ? <AiOutlineEye /> : <AiTwotoneEyeInvisible />}
            </InputGroup.Text>
          </InputGroup>
          {errors.password && (
            <Form.Text className="text-danger">{errors.password.message}</Form.Text>
          )}
        </Form.Group>


        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label={
              <span className="plustext">
                J'accepte les <a href="/confident" target="_blank" rel="noopener noreferrer">conditions de notre politique de confidentialité</a> et le <a href="https://www.economie.gouv.fr/entreprises/reglement-general-protection-donnees-rgpd" _blank>RGPD</a>.
              </span>
            }
            {...register("acceptConditions", { required: true })}
          />
          {errors.acceptConditions && (
            <Form.Text className="text-danger">Vous devez accepter les conditions pour vous inscrire.</Form.Text>
          )}
        </Form.Group>

        <Button className="btnLogReg col-12" type="submit">
          Créer un compte
        </Button>
        </div>
      </Form>
    </div>
  );
}


export default RegisterForm;
