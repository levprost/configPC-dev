import Container from "react-bootstrap/Container"; 
import LoginForm from "../../../components/Auth/LoginForm";
import Menu from "../../../components/Menu";
 
function Login() { 
  return ( 
    <> 
      <Menu /> 
      <Container fluid className="loginContainer"> 
        <LoginForm /> 
      </Container>
    </> 
  ); 
} 
 
export default Login; 