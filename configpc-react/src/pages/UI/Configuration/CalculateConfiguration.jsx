import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  InputGroup,
  ListGroup,
  Button,
  OverlayTrigger,
  Tooltip,
  Image
} from "react-bootstrap";
import Menu from "../../../components/Menu";

const CalculateConfiguration = () => {
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalConsumption, setTotalConsumption] = useState(0);

  useEffect(() => {
    fetchComponents();
  }, []);
  useEffect(() => {
    if (searchTerm) {
      searchComponents(searchTerm);
    } else {
      setFilteredComponents(components);
      setShowResults(false);
    }
  }, [searchTerm, components]);

  useEffect(() => {
    calculateTotals();
  }, [selectedComponents]);

  const fetchComponents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/components");
      console.log("Réponse de l'API:", res.data);
      if (Array.isArray(res.data.components)) {
        setComponents(res.data.components);
        setFilteredComponents(res.data.components);
      } else {
        console.error("Les données reçues ne sont pas un tableau:", res.data);
        setComponents([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des composants:", error);
    }
  };

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

  const calculateTotals = () => {
    const price = selectedComponents.reduce(
      (total, comp) => total + parseFloat(comp.price_component || 0),
      0
    );
    setTotalPrice(price.toFixed(2));

    const consumption = selectedComponents.reduce(
      (total, comp) => total + parseInt(comp.consumption_component || 0),
      0
    );
    setTotalConsumption(consumption);
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
  const removeComponent = (id) => {
    setSelectedComponents(selectedComponents.filter((c) => c.id !== id));
  };

  return (
    <>
      <Menu />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-12 col-md-8">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="card-title">Calculateur de configuration</h4>
                <hr />
                <div className="search-component-container position-relative">
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
                    <ListGroup className="position-absolute w-100 mt-1 shadow-sm rounded z-index-1000">
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
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Composants sélectionnés</h4>
                <hr />

                {selectedComponents.length > 0 ? (
                  <>
                    <ListGroup className="selected-components-list mb-4">
                      {selectedComponents.map((comp) => (
                        <ListGroup.Item
                          key={comp.id}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <h5>{comp.name_component}</h5>
                            <p className="mb-0 text-muted">
                              Prix: {comp.price_component}€ | Consommation:{" "}
                              {comp.consumption_component} W
                            </p>
                            {comp.image_component ? (
                                <Image
                                  src={`http://127.0.0.1:8000/storage/uploads/${comp.image_component}`}
                                  alt="Image Composant"
                                  thumbnail
                                  className="shadow-sm rounded w-100"
                                />
                            ) : (
                                <p>Pas d'image pour ce composant</p>
                            )}
                          </div>
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
                              onClick={() => removeComponent(comp.id)}
                              className="remove-btn"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    <div className="summary-box p-3 bg-light rounded">
                      <h5>Récapitulatif</h5>
                      <div className="d-flex justify-content-between">
                        <span>Prix total:</span>
                        <span className="fw-bold">{totalPrice}€</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Consommation totale:</span>
                        <span className="fw-bold">{totalConsumption} W</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-center">Aucun composant sélectionné</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalculateConfiguration;
