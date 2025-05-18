import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../../../components/Menu";
import { HexColorPicker } from "react-colorful";

const EditBrand = () => {
  const { brand } = useParams(); // Получаем ID из URL
  const navigate = useNavigate();

  const [nameBrand, setNameBrand] = useState("");
  const [logoBrand, setLogoBrand] = useState(null);
  const [descriptionBrand, setDescriptionBrand] = useState("");
  const [colorBrand, setColorBrand] = useState("");
  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    getBrand(); 
  }, []);

  const getBrand = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/brands/${brand}`);
      setNameBrand(res.data.name_brand);
      setDescriptionBrand(res.data.description_brand);
      setColorBrand(res.data.color_brand);
    } catch (error) {
      console.log("Erreur lors du chargement de la marque:", error);
    }
  };

  const changeHandler = (event) => {
    setLogoBrand(event.target.files[0]); 
  };


  const updateBrand = async (e) => {
    e.preventDefault();// Empêche le rechargement de la page

    const formData = new FormData();
    formData.append("_method", "PATCH");// Méthode HTTP simulée via POST 
     // Ajout des données du formulaire
    formData.append("name_brand", nameBrand);
    formData.append("description_brand", descriptionBrand);
    formData.append("color_brand", colorBrand);
    // Ajout du nouveau logo si sélectionné
    if (logoBrand) {
      formData.append("logo_brand", logoBrand);
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/brands/${brand}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
         // Spécifie le bon type de contenu pour l'image
      });

      navigate("/admin/brands");  
    } catch ({ response }) {
      if (response?.status === 422) {
        console.error("Erreur de la valitadtion:", response.data);
        setValidationError(response.data.errors);// Affiche les erreurs de validation
      }
    }
  };

  return (
    <div>
      <Menu />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Modifier un Brand</h4>
                <hr />
                <div className="form-wrapper">
                  {Object.keys(validationError).length > 0 && (
                    <div className="alert alert-danger">
                      <ul className="mb-0">
                        {Object.entries(validationError).map(([key, value]) => (
                          <li key={key}>{value}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Form onSubmit={updateBrand}>
                    <Row>
                      <Col>
                        <Form.Group controlId="Name">
                          <Form.Label>Nom de marque</Form.Label>
                          <Form.Control
                            type="text"
                            value={nameBrand}
                            onChange={(event) => setNameBrand(event.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="Description">
                          <Form.Label>Description de la marque</Form.Label>
                          <Form.Control
                            type="text"
                            value={descriptionBrand}
                            onChange={(event) => setDescriptionBrand(event.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="brandColor">
                          <Form.Label>Couleur de marque</Form.Label>
                          <HexColorPicker
                            color={colorBrand}
                            onChange={setColorBrand}
                          />
                          <Form.Control
                            type="text"
                            value={colorBrand}
                            onChange={(event) => setColorBrand(event.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="Logo" className="mb-3">
                          <Form.Label>Logo de marque</Form.Label>
                          <Form.Control type="file" onChange={changeHandler} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button variant="primary" className="mt-2" type="submit">
                      Modifier
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBrand;
