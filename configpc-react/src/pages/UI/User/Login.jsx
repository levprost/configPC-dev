import Container from "react-bootstrap/Container";
import LoginForm from "../../../components/Auth/LoginForm";
import Menu from "../../../components/Menu";
import "./../../../styles/css/logreg.css";


function Login() {
  return (
    <>
      <Menu />
      <div className="background">
        <Container fluid className="container col-lg-12 col-md-12 loginContainer">
          <LoginForm />
        </Container>
      </div>
    </>
  );
}

export default Login; 