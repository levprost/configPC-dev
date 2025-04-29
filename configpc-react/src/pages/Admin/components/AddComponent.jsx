import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Menu from "../../../components/Menu";

const AddComponent = () => {
  const navigate = useNavigate();

  
  const [nameComponent, setNameComponent] = useState("");
  const [subtitleComponent, setSubtitleComponent] = useState("");
  const [priceComponent, setPriceComponent] = useState("");
  const [descriptionComponent, setDescriptionComponent] = useState("");
  const [consumptionComponent, setConsumptionComponent] = useState("");
  const [reviewComponent, setReviewComponent] = useState("");
  const [imageComponent, setImageComponent] = useState(null);
  const [videoComponent, setVideoComponent] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [typeComponent, setTypeComponent] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [validationError, setValidationError] = useState({});

  
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get("${process.env.REACT_APP_API_URL}/brands");
      setBrands(res.data);
    } catch (error) {
      console.error("Ошибка загрузки брендов:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    }
  };

  
  const changeHandler = (event) => {
    setImageComponent(event.target.files[0]);
  };

  
  const addComponent = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name_component", nameComponent);
    formData.append("subtitle_component", subtitleComponent);
    formData.append("price_component", priceComponent);
    formData.append("description_component", descriptionComponent);
    formData.append("consumption_component", consumptionComponent);
    formData.append("review_component", reviewComponent);
    formData.append("image_component", imageComponent);
    formData.append("video_component", videoComponent);
    formData.append("release_date_component", releaseDate);
    formData.append("type_component", typeComponent);
    formData.append("brand_id", brandId);
    formData.append("category_id", categoryId);

    try {
      await axios.post("http://127.0.0.1:8000/api/components", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin/components"); 
    } catch ({ response }) {
      if (response?.status === 422) {
        setValidationError(response.data.errors);
      }
    }
  };

  return (
    <div>
      <Menu />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-12 col-md-8">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Ajouter un nouveau composant</h4>
                <hr />
                <Form onSubmit={addComponent}>
                  {Object.keys(validationError).length > 0 && (
                    <div className="alert alert-danger">
                      <ul className="mb-0">
                        {Object.entries(validationError).map(([key, value]) => (
                          <li key={key}>{value}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Nom du composant</Form.Label>
                        <Form.Control
                          type="text"
                          value={nameComponent}
                          onChange={(e) => setNameComponent(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Sous-titre</Form.Label>
                        <Form.Control
                          type="text"
                          value={subtitleComponent}
                          onChange={(e) => setSubtitleComponent(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Prix</Form.Label>
                        <Form.Control
                          type="number"
                          value={priceComponent}
                          onChange={(e) => setPriceComponent(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={releaseDate}
                          onChange={(e) => setReleaseDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={descriptionComponent}
                          onChange={(e) => setDescriptionComponent(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Avis de composant</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={reviewComponent}
                          onChange={(e) => setReviewComponent(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Consommation</Form.Label>
                        <Form.Control
                          type="number"
                          value={consumptionComponent}
                          onChange={(e) => setConsumptionComponent(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Type de composant</Form.Label>
                        <Form.Control
                          type="text"
                          value={typeComponent}
                          onChange={(e) => setTypeComponent(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={changeHandler} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Lien Vidéo</Form.Label>
                        <Form.Control
                          type="text"
                          value={videoComponent}
                          onChange={(e) => setVideoComponent(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Marque</Form.Label>
                        <Form.Select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                          <option value="">Sélectionner une marque</option>
                          {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name_brand}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Catégorie</Form.Label>
                        <Form.Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name_category}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="primary" className="mt-3" type="submit">
                    Ajouter
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComponent;