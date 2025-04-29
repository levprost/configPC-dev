import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Menu from "../../../components/Menu";


const AddCategory = () => {
  const navigate = useNavigate();

  const [nameCategory, setNameCategory] = useState("");
  const [validationError, setValidationError] = useState({});


  const addCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name_category", nameCategory);
    await axios
      .post(`${process.env.REACT_APP_API_URL}/categories`, formData)
      .then(navigate("/admin/categories"))
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
                <h4 className="card-title">Ajouter une nouvelle catégorie</h4>
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
                  <Form onSubmit={addCategory}>
                    <Row>
                      <Col>
                        <Form.Group controlId="Name">
                          <Form.Label>Nom de marque</Form.Label>
                          <Form.Control
                            type="text"
                            value={nameCategory}
                            onChange={(event) => {
                              setNameCategory(event.target.value);
                            }}
                          />
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

export default AddCategory;
