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
import "./../../../styles/css/configadd.css";
import ComponentSelector from "../../../components/ComponentSelector";

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

  //==========State of components=========
  // Selected components by category
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedPower, setSelectedPower] = useState(null);
  const [selectedRAM, setSelectedRAM] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  const [currentStep, setCurrentStep] = useState("GPU");

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

  //Function to handle search input change
  const handleSelectComponent = (component) => {
    switch (currentStep) {
      case "GPU":
        setSelectedGPU(component);
        setCurrentStep("Motherboard");
        break;
      case "Motherboard":
        setSelectedMotherboard(component);
        setCurrentStep("CPU");
        break;
      case "CPU":
        setSelectedCPU(component);
        setCurrentStep("Power Supply");
        break;
      case "Power Supply":
        setSelectedPower(component);
        setCurrentStep("RAM");
        break;
      case "RAM":
        setSelectedRAM(component);
        setCurrentStep("Storage");
        break;
      case "Storage":
        setSelectedStorage(component);
        setCurrentStep("Case");
        break;
      case "Case":
        setSelectedCase(component);
        break;
      default:
        break;
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
      console.log(res.data);
      setUserId(res.data.data.user.id);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    }
  };

  // Function to handle component selection

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
    <div className="g-0 mainConfig">
      <Menu />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Ajouter une configuration</h2>

        <div className="row">
          {/* Левая колонка - Форма */}
          <div className="col-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">
                  Informations sur la configuration
                </h4>
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
                <Form>
                  <Form.Group controlId="nameConfig">
                    <Form.Label>Nom de la configuration</Form.Label>
                    <Form.Control
                      type="text"
                      value={nameConfig}
                      onChange={(e) => setNameConfig(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="titleConfig" className="mt-3">
                    <Form.Label>Titre</Form.Label>
                    <Form.Control
                      type="text"
                      value={titleConfig}
                      onChange={(e) => setTitleConfig(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="subtitleConfig" className="mt-3">
                    <Form.Label>Sous-titre</Form.Label>
                    <Form.Control
                      type="text"
                      value={subtitleConfig}
                      onChange={(e) => setSubtitleConfig(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="descriptionConfig" className="mt-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={descriptionConfig}
                      onChange={(e) => setDescriptionConfig(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="explicationConfig" className="mt-3">
                    <Form.Label>Explication</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={explicationConfig}
                      onChange={(e) => setExplicationConfig(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>

          {/* Правая колонка - Выбор компонентов */}
          <div className="col-12 col-md-6 mt-4 mt-md-0">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Sélectionner les composants</h4>
                <div>
                  <div className="configuration-steps">
                    {currentStep === "GPU" && (
                      <ComponentSelector
                        categoryName="Выберите видеокарту (GPU)"
                        categoryKey="gpu"
                        components={filteredComponents.filter(
                          (c) => c.category_id === 1
                        )} // Подставь ID категории для GPU
                        onSelect={handleSelectComponent}
                      />
                    )}

                    {currentStep === "Motherboard" && (
                      <ComponentSelector
                        categoryName="Выберите материнскую плату (Motherboard)"
                        categoryKey="motherboard"
                        components={filteredComponents.filter(
                          (c) => c.category_id === 2
                        )}
                        onSelect={handleSelectComponent}
                      />
                    )}

                    {currentStep === "CPU" && (
                      <ComponentSelector
                        categoryName="Выберите процессор (CPU)"
                        categoryKey="cpu"
                        components={filteredComponents.filter(
                          (c) => c.category_id === 3
                        )}
                        onSelect={handleSelectComponent}
                      />
                    )}

                    {currentStep === "Power Supply" && (
                      <ComponentSelector
                        categoryName="Выберите блок питания (Power Supply)"
                        categoryKey="power"
                        components={filteredComponents.filter(
                          (c) => c.category_id === 4
                        )}
                        onSelect={handleSelectComponent}
                      />
                    )}

                    {currentStep === "RAM" && (
                      <ComponentSelector
                        categoryName="Выберите оперативную память (RAM)"
                        categoryKey="ram"
                        components={filteredComponents.filter(
                          (c) => c.category_id === 5
                        )}
                        onSelect={handleSelectComponent}
                      />
                    )}

                    {currentStep === "Storage" && (
                      <ComponentSelector
                        categoryName="Выберите диск (Storage)"
                        categoryKey="storage"
                        components={filteredComponents.filter(
                          (c) => c.category_id === 6
                        )}
                        onSelect={handleSelectComponent}
                      />
                    )}

                    {currentStep === "Case" && (
                      <ComponentSelector
                        categoryName="Выберите корпус (Case)"
                        categoryKey="case"
                        components={filteredComponents.filter(
                          (c) => c.category_id === 7
                        )}
                        onSelect={handleSelectComponent}
                      />
                    )}
                  </div>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка отправки */}
        <div className="row mt-4">
          <div className="col-12">
            <Button
              variant="primary"
              className="w-100"
              size="lg"
              type="submit"
              onClick={addConfiguration}
            >
              Ajouter la configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddConfiguration;
