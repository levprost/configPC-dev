import React, { useEffect, useState } from "react";
import {
  ListGroup,
  Form,
  Button,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import Menu from "../../../components/Menu";

const AddConfiguration = () => {
  //=========Configuration========
  const [nameConfig, setNameConfig] = useState("");
  const [titleConfig, setTitleConfig] = useState("");
  const [subtitleConfig, setSubtitleConfig] = useState("");
  const [descriptionConfig, setDescriptionConfig] = useState("");
  const [explicationConfig, setExplicationConfig] = useState("");
  const [imageConfig, setImageConfig] = useState(null);
  const [benchmarkConfig, setBenchmarkConfig] = useState(null);
  const [userId, setUserId] = useState(null);
  const [validationError, setValidationError] = useState({});

  //==========Components=========
  const [component, setComponent] = useState([]);
  const [components, setComponents] = useState([]);
  const [nameComponent, setNameComponent] = useState("");
  const [priceComponent, setPriceComponent] = useState("");
  const [consumptionComponent, setConsumptionComponent] = useState("");
  const [imageComponent, setImageComponent] = useState(null);
  const [releaseComponent, setReleaseComponent] = useState(null);

  //===========Search_System_of_components=========
  const [brandComponent, setBrandComponent] = useState(null);
  const [categoryComponent, setCategoryComponent] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [chosenComponents, setChosenComponents] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchComponents();
  }, []);

  useEffect(() => {
    if (component) {
      getComponent();
    }
  }, [component]);
  useEffect(() => {
    if (searchTerm) {
      searchComponents(searchTerm);
    } else {
      setFilteredComponents(components);
      setShowResults(false);
    }
  }, [searchTerm, components]);

  //Upload all components from API
  const fetchComponents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/components");
      console.log("Réponse de l'API:", res.data);
      if (Array.isArray(res.data.components)) {
        setComponents(res.data.components); //we put data in variable components
        setFilteredComponents(res.data.components);
      } else {
        console.error("Les données reçues ne sont pas un tableau:", res.data);
        setComponents([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des composants:", error);
    }
  };

  //Search system from api with key term
  const searchComponents = async (term) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/components?term=${term}`
      );
      if (Array.isArray(res.data.componentSearch)) {
        setFilteredComponents(res.data.componentSearch);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche des composants:", error);
    }
  };

  //Upload currentuser with bearer Token
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Utilisateur non authentifié !");
        return;
      }

      const res = await axios.get("http://127.0.0.1:8000/api/currentuser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data)
      setUserId(res.data.data.user.id);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    }
  };

  // Function to handle component selection
  const handleChooseComponent = (comp) => {
    if (!comp || !comp.id) {
      console.error("Component not found");
      console.log(comp);
      return; 
    }


    if (selectedComponents.some((component) => component.id === comp.id)) {
      return; 
    }

    setSelectedComponents([...selectedComponents, comp]);
  };

  // Function to remove a selected component
  const removeChosenComponent = (id) => {
    setSelectedComponents(selectedComponents.filter((c) => c.id !== id)); // Теперь обновляем selectedComponents
  };
  const getComponent = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/components/${component}`
      );
      setNameComponent(res.data.name_component);
      setPriceComponent(res.data.price_component);
      setConsumptionComponent(res.data.consumption_component);
      setImageComponent(res.data.image_component);
      setReleaseComponent(res.data.release_date_component);
      setBrandComponent(res.data.brand_id);
      setCategoryComponent(res.data.category_id);
      console.log(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement du composant:", error);
    }
  };

  const addConfiguration = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const token = localStorage.getItem("access_token"); // Get token from local storage
      if (!token) {
        console.error("User is not authenticated!"); // Handle unauthenticated user
        return;
      }

      const formData = new FormData(); // Prepare the form data to be sent
      formData.append("name_config", nameConfig);
      formData.append("title_config", titleConfig);
      formData.append("subtitle_config", subtitleConfig);
      formData.append("description_config", descriptionConfig);
      formData.append("explication_config", explicationConfig);
      formData.append("user_id", userId);

      if (imageConfig) formData.append("image_config", imageConfig); // Attach image if provided
      if (benchmarkConfig) formData.append("benchmark_config", benchmarkConfig); // Attach benchmark if provided

      selectedComponents.forEach((comp) => {
        formData.append("components[]", comp.id);
      });

      // Send the configuration data via POST request
      await axios.post("http://127.0.0.1:8000/api/configurations", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Configuration added successfully!"); // Success message
    } catch (error) {
      // Handle validation or other errors
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
        console.error("Validation error:", error.response.data.errors);
      } else {
        console.error("Error adding configuration", error);
      }
    }
  };

  return (
    <>
      <Menu />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Ajout d'une configuration</h4>
                <hr />
                {Object.keys(validationError).length > 0 && (
                  <div className="alert alert-danger">
                    <ul>
                      {Object.entries(validationError).map(([key, value]) => (
                        <li key={key}>{value}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <Form onSubmit={addConfiguration}>
                  <Form.Group controlId="nameConfig">
                    <Form.Label>Nom de la configuration</Form.Label>
                    <Form.Control
                      type="text"
                      value={nameConfig}
                      onChange={(e) => setNameConfig(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="titleConfig">
                    <Form.Label>Titre</Form.Label>
                    <Form.Control
                      type="text"
                      value={titleConfig}
                      onChange={(e) => setTitleConfig(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="subtitleConfig">
                    <Form.Label>Sous-titre</Form.Label>
                    <Form.Control
                      type="text"
                      value={subtitleConfig}
                      onChange={(e) => setSubtitleConfig(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="descriptionConfig">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={descriptionConfig}
                      onChange={(e) => setDescriptionConfig(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="explicationConfig">
                    <Form.Label>Explication</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={explicationConfig}
                      onChange={(e) => setExplicationConfig(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="imageConfig">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => setImageConfig(e.target.files[0])}
                    />
                  </Form.Group>

                  <Form.Group controlId="benchmarkConfig">
                    <Form.Label>Benchmark</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => setBenchmarkConfig(e.target.files[0])}
                    />
                  </Form.Group>
                  <div className="search-component-container">

                    <Form.Group controlId="searchComponent">
                      <Form.Label>Rechercher un composant</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Entrez le nom du composant..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onFocus={() => setShowResults(true)}
                          onBlur={() =>
                            setTimeout(() => setShowResults(false), 200)
                          } 
                        />
                      </InputGroup>
                    </Form.Group>

                    {showResults && filteredComponents.length > 0 && (
                      <ListGroup className="position-absolute w-100 mt-1 shadow-sm rounded">
                        {filteredComponents.map((comp) => (
                          <ListGroup.Item
                            key={comp.id}
                            action
                            onClick={() => handleChooseComponent(comp)} 
                            className="result-item"
                          >
                            <div className="d-flex justify-content-between">
                              <span>{comp.name_component}</span>
                              <span>{comp.price_component}€</span>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}

                    {/* Выбранные компоненты */}
                    {selectedComponents.length > 0 && (
                      <div className="mt-3">
                        <h5>Composants sélectionnés :</h5>
                        <ListGroup className="selected-components-list">
                          {selectedComponents.map((comp) => (
                            <ListGroup.Item
                              key={comp.id}
                              className="d-flex justify-content-between align-items-center"
                            >
                              <span>
                                {comp.name_component} - {comp.price_component}€
                              </span>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-remove-${comp.id}`}>
                                    Supprimer
                                  </Tooltip>
                                }
                              >
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => removeChosenComponent(comp.id)}
                                  className="remove-btn"
                                >
                                  <FaTrash/>{" "}
                                </Button>
                              </OverlayTrigger>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    className="mt-3 w-100"
                    size="lg"
                    type="submit"
                  >
                    Ajouter la configuration
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddConfiguration;