import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../../../components/Menu";

const EditComponent = () => {
  const { component } = useParams(); // Get component ID from URL
  const navigate = useNavigate();

  // State for form fields
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

  // State for dropdown lists
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBrands(); // Load brands for dropdown
    fetchCategories(); // Load categories for dropdown
    fetchComponent(); // Load component data
  }, []);

  // Fetch component data
  const fetchComponent = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/components/${component}`
      );
      setNameComponent(res.data.component.name_component);
      setSubtitleComponent(res.data.component.subtitle_component);
      setPriceComponent(res.data.component.price_component);
      setDescriptionComponent(res.data.component.description_component);
      setConsumptionComponent(res.data.component.consumption_component);
      setReviewComponent(res.data.component.review_component);
      setVideoComponent(res.data.component.video_component);
      setReleaseDate(res.data.component.release_date);
      setTypeComponent(res.data.component.type_component);
      setBrandId(res.data.component.brand_id);
      setCategoryId(res.data.component.category_id);
    } catch (error) {
      console.error("Error loading component data:", error);
    }
  };

  // Fetch brands for dropdown
  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/brands");
      setBrands(res.data.data);
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/categories");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Handle file input change
  const changeHandler = (event) => {
    setImageComponent(event.target.files[0]);
  };

  // Update component function
  const updateComponent = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PUT"); // Laravel requires this for updates
    formData.append("name_component", nameComponent);
    formData.append("subtitle_component", subtitleComponent);
    formData.append("price_component", priceComponent);
    formData.append("description_component", descriptionComponent);
    formData.append("consumption_component", consumptionComponent);
    formData.append("review_component", reviewComponent);
    formData.append("video_component", videoComponent);
    formData.append("release_date", releaseDate);
    formData.append("type_component", typeComponent);
    formData.append("brand_id", brandId);
    formData.append("category_id", categoryId);

    // Only append image if a new file is selected
    if (imageComponent) {
      formData.append("image_component", imageComponent);
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/components/${component}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      navigate("/admin/components"); // Redirect after successful update
    } catch ({ response }) {
      if (response?.status === 422) {
        console.error("Validation error:", response.data);
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
                <h4 className="card-title">Edit Component</h4>
                <hr />
                {/* Show validation errors */}
                {Object.keys(validationError).length > 0 && (
                  <div className="alert alert-danger">
                    <ul className="mb-0">
                      {Object.entries(validationError).map(([key, value]) => (
                        <li key={key}>{value}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Form onSubmit={updateComponent}>
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
                    Update
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

export default EditComponent;
