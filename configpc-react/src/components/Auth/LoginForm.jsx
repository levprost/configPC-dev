import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../../styles/css/logreg.css";

function LoginForm() {

  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "" }
  });

  const email = watch("email", "");
  const password = watch("password", "");
  let navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  let login = async () => {
    try {
      let formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      let res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        localStorage.setItem("access_token", res.data.data.access_token.token);
        toast.success("Connexion réussie !", { position: "top-right" });
        setTimeout(() => navigate("/", { replace: true }), 2000);
      }
    } catch (err) {
      toast.error("Erreur de connexion. Vérifiez vos informations.", { position: "top-right" });
    }
  };

  return (
    <div className="login-form row justify-content-center ">
      <ToastContainer /> 
      <Form onSubmit={handleSubmit(login)} className="col-lg-8 col-md-10 col-sm-12 mainlogreg">
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" {...register("email", { required: true })} />
          {errors.email && <p className="text-danger">Email requis</p>}
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Mot de passe</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
            />
            <Button variant="outline-secondary" onClick={handleClickShowPassword}>
              {showPassword ? <AiTwotoneEyeInvisible /> : <AiOutlineEye />}
            </Button>
          </InputGroup>
          {errors.password && <p className="text-danger">Mot de passe requis</p>}
        </Form.Group>

        <Button type="submit" className="mt-4 col-12 btnLogReg">
          Connexion
        </Button>
      </Form>
    </div>
  );
}

export default LoginForm;