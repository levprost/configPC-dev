import React, { useEffect, useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import axios from "axios";
import Menu from "../../../components/Menu";
import "./../../../styles/css/configadd.css";

const AddConfiguration = () => {
  const [nameConfig, setNameConfig] = useState("");
  const [titleConfig, setTitleConfig] = useState("");
  const [subtitleConfig, setSubtitleConfig] = useState("");
  const [descriptionConfig, setDescriptionConfig] = useState("");
  const [explicationConfig, setExplicationConfig] = useState("");
  const [imageConfig, setImageConfig] = useState(null);
  const [benchmarkConfig, setBenchmarkConfig] = useState(null);
  const [userId, setUserId] = useState(null);
  const [validationError, setValidationError] = useState({});
  const [components, setComponents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchComponents();
  }, []);

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

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/currentuser`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserId(res.data.data.user.id);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    }
  };

  const handleSelectComponent = (component) => {
    if (!component || !component.id) return;
    if (selectedComponents.find((c) => c.id === component.id)) return;
    setSelectedComponents([...selectedComponents, component]);
  };

  const handleImageChange = (e) => setImageConfig(e.target.files[0]);
  const handleBenchmarkChange = (e) => setBenchmarkConfig(e.target.files[0]);

  const addConfiguration = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const formData = new FormData();
      formData.append("name_config", nameConfig);
      formData.append("title_config", titleConfig);
      formData.append("subtitle_config", subtitleConfig);
      formData.append("description_config", descriptionConfig);
      formData.append("explication_config", explicationConfig);
      formData.append("user_id", userId);

      if (imageConfig) formData.append("image_config", imageConfig);
      if (benchmarkConfig) formData.append("benchmark_config", benchmarkConfig);

      selectedComponents.forEach((comp) => {
        formData.append("components[]", comp.id);
      });

      await axios.post(
        `${process.env.REACT_APP_API_URL}/configurations`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Configuration ajoutée avec succès!");

      setNameConfig("");
      setTitleConfig("");
      setSubtitleConfig("");
      setDescriptionConfig("");
      setExplicationConfig("");
      setImageConfig(null);
      setBenchmarkConfig(null);
      setSelectedComponents([]);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        console.error("Erreur lors de l'ajout:", error);
      }
    }
  };

  return (
    <div className="g-0 mainConfig">
      <Menu />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Ajouter une configuration</h2>

        <div className="row">
          <div className="col-md-12 col-lg-6 mb-4">
            <div className="card border-card">
              <div className="card-body comp-main">
                <h4>Informations sur la configuration</h4>
                <hr className="strictLine"/>
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
                    <Form.Label className="text-lab">Nom</Form.Label>
                    <Form.Control
                    className="control-label"
                      type="text"
                      value={nameConfig}
                      onChange={(e) => setNameConfig(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label className="text-lab">Titre</Form.Label>
                    <Form.Control
                    className="control-label"
                      type="text"
                      value={titleConfig}
                      onChange={(e) => setTitleConfig(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label className="text-lab">Sous-titre</Form.Label>
                    <Form.Control
                    className="control-label"
                      type="text"
                      value={subtitleConfig}
                      onChange={(e) => setSubtitleConfig(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label className="text-lab">Description</Form.Label>
                    <Form.Control
                    className="control-label"
                      as="textarea"
                      rows={3}
                      value={descriptionConfig}
                      onChange={(e) => setDescriptionConfig(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label className="text-lab">Explication</Form.Label>
                    <Form.Control
                    className="control-label"
                      as="textarea"
                      rows={3}
                      value={explicationConfig}
                      onChange={(e) => setExplicationConfig(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label className="text-lab">Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label className="text-lab">Benchmark</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleBenchmarkChange}
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-lg-6 mt-4 mt-md-0">
            <div className="card border-card">
              <div className="card-body comp-main">
                <h4>Sélectionner les composants</h4>
                <hr className="strictLine"/>
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
                <h5 className="text-center mb-3">Les composant du PC</h5>
                {selectedComponents.map((comp) => (
                  <div className="col-md-6 col-lg-4 mb-3" key={comp.id}>
                    <div className="card h-100 shadow-sm">
                      {comp.image_component && (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_URL}/${comp.image_component}`}
                          className="card-img-top"
                          alt={comp.name_component}
                          style={{ objectFit: "cover", height: "180px" }}
                        />
                      )}
                      <div className="card-body-comp">
                        <h5 className="card-title-comp">{comp.name_component}</h5>
                        <p className="card-text-comp">
                          <strong>Prix:</strong> {comp.price_component} €
                        </p>
                        <p className="card-text-comp">
                          <strong>Consommation:</strong> {comp.consumption_component} Watt
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
