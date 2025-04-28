import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  document.title = "Créer un compte";

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // ✅ Функция для переключения пароля
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // ✅ Функция для обработки отправки формы
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", data)
      .then(navigate("/admin/brands"))
      ;
      if (res.status === 201) {
        toast.success("Compte créé avec succès ! 🚀", { position: "top-right" });
      }
    } catch (err) {
      toast.error("Erreur lors de la création du compte", { position: "top-right" });
    }
  };

  return (
    <>
      <ToastContainer />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="Auth-form-title">Créer un compte</h3>

        {/* Champ Pseudo */}
        <Form.Group className="mb-3" controlId="formBasicText">
          <Form.Label>Pseudo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Votre pseudo"
            {...register("nick_name", { required: "Pseudo obligatoire" })}
          />
          {errors.name && (
            <Form.Text className="text-danger">{errors.name.message}</Form.Text>
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
          {errors.email && (
            <Form.Text className="text-danger">{errors.email.message}</Form.Text>
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

        <Button variant="primary" type="submit">
          Créer un compte
        </Button>
      </Form>
    </>
  );
}

export default RegisterForm;
