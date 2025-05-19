import React, { useEffect, useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import axios from "axios";
import Menu from "../../../components/Menu";
import "./../../../styles/css/configadd.css";

const AddConfiguration = () => {
  const [components, setComponents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);


  const [totalPrice, setTotalPrice] = useState(0);
  const [totalConsumption, setTotalConsumption] = useState(0);

  useEffect(() => {
    fetchComponents();
  }, []);
  useEffect(() => {
    calculateTotals();
  }, [selectedComponents]);
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = components.filter((c) =>
        c.name_component.toLowerCase().includes(term)
      );
      setFilteredComponents(filtered);

    } else {
      setFilteredComponents(components);
    }
  }, [searchTerm, components]);

  const fetchComponents = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/components`
      );
      setComponents(res.data.components || []);
    } catch (error) {
      console.error("Erreur lors du chargement des composants:", error);
    }
  };

  const calculateTotals = () => {
    const price = selectedComponents.reduce(
      (total, comp) => total + parseFloat(comp.price_component || 0),
      0
    );
    const consumption = selectedComponents.reduce(
      (total, comp) => total + parseInt(comp.consumption_component || 0),
      0
    );

    setTotalPrice(price.toFixed(2));
    setTotalConsumption(consumption);
  };

  const handleSelectComponent = (component) => {
    if (!component || !component.id) return;
    if (selectedComponents.find((c) => c.id === component.id)) return;
    setSelectedComponents([...selectedComponents, component]);
  };

  return (
    <div className="g-0 mainConfig">
      <Menu />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Calculer une configuration</h2>
        <hr className="strictLine" />
        <div className="row">
          <div className="col-md-12 col-lg-12 mt-4 mt-md-0">
            <div className="card border-card">
              <div className="card-body comp-main">
                <h4>Sélectionner les composants</h4>
                <hr className="strictLine" />
                <Form.Control
                  type="text"
                  placeholder="Recherche..."
                  className="mb-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ListGroup>
                  {filteredComponents.map((component) => (
                    <ListGroup.Item
                      key={component.id}
                      action
                      onClick={() => handleSelectComponent(component)}
                    >
                      {component.name_component} – {component.price_component} €
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </div>

            {selectedComponents.length > 0 && (
              <div className="row mt-4">
                <h5 className="text-center mb-3">Les composant du PC que vous avez choisi:</h5>
                <hr className="strictLine" />
                {selectedComponents.map((comp) => (
                  <div className="col-md-6 col-lg-4 mb-3" key={comp.id}>
                    <div className="card h-100 border-card">
                      {comp.image_component && (
                        <img
                          src={`${process.env.REACT_APP_FILE_URL}/${comp.image_component}`}
                          className="card-img-top"
                          alt={comp.name_component}
                          style={{ objectFit: "cover", height: "180px" }}
                        />
                      )}
                      <div className="card-body comp-crd">
                        <h5 className="card-title-comp">{comp.name_component}</h5>
                        <hr className="strictLine" />
                        <p className="card-text-comp">
                          <strong>Catégorie:</strong>
                          <p className="list-comp">
                            {comp.category.name_category}
                          </p>
                        </p>
                        <p className="card-text-comp">
                          <strong>Prix:</strong>
                          <p className="list-comp">
                            {comp.price_component} €
                          </p>
                        </p>
                        <p className="card-text-comp">
                          <strong>Consommation:</strong>
                          <p className="list-comp">
                            {comp.consumption_component} Watt
                          </p>
                        </p>
                        <p className="card-text-comp">
                          <strong>Maeque:</strong>
                          <p className="list-comp">
                            {comp.brand.name_brand} Watt
                          </p>
                        </p>
                        <hr className="strictLine" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="summary-box p-3 bg-light rounded border-card mt-3">
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
        </div>
        <hr className="strictLine" />
        </div>
      </div>
  );
};


export default AddConfiguration;
