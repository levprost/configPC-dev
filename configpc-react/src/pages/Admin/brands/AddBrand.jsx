import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Menu from "../../../components/Menu";

import { HexColorPicker } from "react-colorful";

const AddBrand = () => {
  const navigate = useNavigate();

  const [nameBrand, setNameBrand] = useState("");
  const [logoBrand, setLogoBrand] = useState("");
  const [descriptionBrand, setDescriptionBrand] = useState("");
  const [colorBrand, setColorBrand] = useState("");
  const [validationError, setValidationError] = useState({});

  const changeHandler = (event) => {
    setLogoBrand(event.target.files[0]);
  };

  //Fonction d'ajout de Brand
  const addBrand = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name_brand", nameBrand);
    formData.append("logo_brand", logoBrand);
    formData.append("description_brand", descriptionBrand);
    formData.append("color_brand", colorBrand);
    await axios
      .post(`http://127.0.0.1:8000/api/brands`, formData)
      .then(navigate("/admin/brands"))
      .catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors);
        }
      });
  };
  return (
    <div>
      <Menu />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Ajouter une nouvelle marque</h4>
                <hr />
                <div className="form-wrapper">
                  {Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {Object.entries(validationError).map(
                              ([key, value]) => (
                                <li key={key}>{value}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  <Form onSubmit={addBrand}>
                    <Row>
                      <Col>
                        <Form.Group controlId="Name">
                          <Form.Label>Nom de marque</Form.Label>
                          <Form.Control
                            type="text"
                            value={nameBrand}
                            onChange={(event) => {
                              setNameBrand(event.target.value);
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="Name">
                          <Form.Label>Description de la marque</Form.Label>
                          <Form.Control
                            type="text"
                            value={descriptionBrand}
                            onChange={(event) => {
                              setDescriptionBrand(event.target.value);
                            }}
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
                          />{" "}
                          {/* Color Picker */}
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
                    <Button
                      variant="primary"
                      className="mt-2"
                      size="lg"
                      block="block"
                      type="submit"
                    >
                      Créer
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

export default AddBrand;
