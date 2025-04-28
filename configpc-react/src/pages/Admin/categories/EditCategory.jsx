import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../../../components/Menu";
import { HexColorPicker } from "react-colorful";

const EditCategory = () => {
  const { category } = useParams(); 
  const navigate = useNavigate();


  const [nameCategory, setNameCategory] = useState("");

  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    getCategory(); 
  }, []);


  const getCategory = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/categories/${category}`);
      setNameCategory(res.data.name_category);
    } catch (error) {
      console.log("Error not loading category:", error);
    }
  };

  const updateCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name_category", nameCategory);
    formData.append("_method", 'PUT');

    try {
      await axios.post(`http://127.0.0.1:8000/api/categories/${category}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      navigate("/admin/categories"); 
    } catch ({ response }) {
      if (response?.status === 422) {
        console.error("Error:", response.data);
        setValidationError(response.data.errors);
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
                <h4 className="card-title">Modifier une Catégorie</h4>
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
                  <Form onSubmit={updateCategory}>
                    <Row>
                      <Col>
                        <Form.Group controlId="Name">
                          <Form.Label>Nom de catégorie</Form.Label>
                          <Form.Control
                            type="text"
                            value={nameCategory}
                            onChange={(event) => setNameCategory(event.target.value)}
                          />
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

export default EditCategory;
