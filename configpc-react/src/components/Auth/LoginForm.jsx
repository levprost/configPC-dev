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

      let res = await axios.post("http://127.0.0.1:8000/api/login", formData, {
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
    <div className="login-form row justify-content-center mt-5">
      <ToastContainer /> 
      <Form onSubmit={handleSubmit(login)} className="col-5">
        <Form.Group controlId="email">
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

        <Button variant="primary" type="submit" className="mt-3">
          Connexion
        </Button>
      </Form>
    </div>
  );
}

export default LoginForm;