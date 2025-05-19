import Container from "react-bootstrap/Container";
import RegisterForm from "../../../components/Auth/RegisterForm";
import Menu from "../../../components/Menu";
import "./../../../styles/css/logreg.css";

function Register() {
  return (
    <div>
      <Menu />
      <div className="background">
      <Container fluid className="container">
        <RegisterForm />
      </Container>
      </div>
    </div>
  );
}

export default Register;