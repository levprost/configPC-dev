import {
  Card,
  Row,
  Col,
  Image,
  Container,
  ListGroup,
  Form,
  Button,
} from "react-bootstrap";
import { FaUser, FaCalendarAlt, FaDollarSign, FaStar } from "react-icons/fa";
import { GiElectric } from "react-icons/gi";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./../../../styles/css/showpost.css";
import Menu from "../../../components/Menu";

const ShowConfiguration = () => {
  const { configuration } = useParams();
  const [configData, setConfigData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [score, setScore] = useState([]);
  const [userComment, setUserComment] = useState(null);
  const [commentFavorite, setCommentFavorite] = useState("");
  const [ratingFavorite, setRatingFavorite] = useState(3);
  const [validationError, setValidationError] = useState({});
  const [auteur, setAuteur] = useState({});

  //===========COMPONENTS============
  const [components, setComponents] = useState("");


  useEffect(() => {
    displayConfig();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Utilisateur non authentifié !");
        return;
      }

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/currentuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setUserComment(res.data.data.user.id);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    }
  };

  const displayConfig = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/configurations/${configuration}`
      );
      setConfigData(res.data.configuration);
      setRatings(res.data.ratings);
      setScore(res.data.score);
      setAuteur(res.data.auteur);
      setComponents(res.data.configuration.components);
      console.log(res.data.configuration.components);
    } catch (error) {
      console.log("Erreur lors du chargement de la configuration:", error);
    }
  };

  const addRating = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Utilisateur non authentifié !");
        return;
      }

      const formData = new FormData();
      formData.append("comment_favorite", commentFavorite);
      formData.append("rating_favorite", ratingFavorite);
      formData.append("configuration_id", configuration);
      formData.append("user_id", userComment);

      await axios.post(
        `${process.env.REACT_APP_API_URL}/UserConfigurations`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentFavorite("");
      setRatingFavorite(3);

      displayConfig();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        console.error("Le commentaire n'a pas été créé", error);
      }
    }
  };

  if (!configData) {
    return (
      <p className="text-center mt-5">Chargement de la configuration...</p>
    );
  }

  //for calculate price of configuration

  const calculateTotalPrice = () => {
    if (!components || components.length === 0) return 0;
    return components
      .reduce((total, comp) => total + parseFloat(comp.price_component), 0)
      .toFixed(2);
  };

  //for calculate consumption of configuration
  const calculateTotalConsumption = () => {
    if (!components || components.length === 0) return 0;
    return components.reduce(
      (total, comp) => total + parseInt(comp.consumption_component),
      0
    );
  };

  return (
    <div className="mainPost">
      <Menu />
      <Container className="mt-5">
        <Row className="justify-content-center post-card">
          <Col lg={8}>
            <Card className="p-4 post-card-border text-white">
              <Card.Body>
                <h2 className="text-center title-post">{configData.title_config}</h2>
                <h5 className="text-center subtitle-post">
                  {configData.subtitle_config}
                </h5>
                <hr className="strictLine" />
                <div className="row">
                  <div className="col-12 col-md-6 d-flex align-items-center mb-2">
                    <FaUser /> Auteur: {auteur.nick_name}
                  </div>
                  <div className="col-12 col-md-6 d-flex align-items-center mb-2">
                    <FaCalendarAlt /> Publié le:{" "}
                    {new Date(configData.created_at).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </Card.Body>
              <Card.Body>
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <GiElectric /> Consommation de toute la configuration:{" "}
                    {calculateTotalConsumption()} W
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <FaDollarSign /> Prix de toute la configuration:{" "}
                    {calculateTotalPrice()} €
                  </div>
                </div>
              </Card.Body>
              <Card.Body>
                <p>{configData.explication_config}</p>
                <blockquote className="blockquote">
                  {configData.description_config}
                </blockquote>
              </Card.Body>
              <Card.Body className="border-general">
                {components && components.length > 0 ? (
                  components.map((comp, index) => (
                    <a href={`/showComponent/${comp.id}`} className="cardComp">
                    <div key={index} className="component-card my-3">
                      <h5>{comp.name_component}</h5>
                      <p>Prix: {comp.price_component} €</p>
                      <p>Consommation: {comp.consumption_component} W</p>
                      {comp.image_component && (
                        <img
                          src={`http://127.0.0.1:8000/storage/uploads/${comp.image_component}`}
                          alt={comp.name_component}
                          className="img-fluid"
                        />
                      )}
                    </div>
                    </a>
                  ))
                ) : (
                  <p className="text-white">Pas de composants pour cette configuration</p>
                )}
              </Card.Body>
              <Card.Body>
                <h4 className="mb-3">Images</h4>
                <Row>
                  <Col md={6}>
                    <Image
                      src={`http://127.0.0.1:8000/storage/uploads/${configData.image_config}`}
                      alt="Configuration"
                      thumbnail
                      className="shadow-sm rounded w-100 mb-2"
                    />
                  </Col>
                  <Col md={6}>
                    <Image
                      src={`http://127.0.0.1:8000/storage/uploads/${configData.benchmark_config}`}
                      alt="Benchmark"
                      thumbnail
                      className="shadow-sm rounded w-100 mb-2"
                    />
                  </Col>
                </Row>
              </Card.Body>

              <Card.Body>
                <h4 className="mb-3">
                  <FaStar /> Évaluations
                </h4>
                <p>
                  Score total: <strong>{score[0]?.total_score || 0}</strong>
                </p>
                <p>
                  Note moyenne:{" "}
                  <strong>
                    {score[0]?.avg_score
                      ? parseFloat(score[0].avg_score).toFixed(2)
                      : "N/A"}
                  </strong>
                </p>

                {ratings.length > 0 ? (
                  <ListGroup variant="flush rounded border-general  text-white">
                    {ratings.map((rating, index) => (
                      <ListGroup.Item
                        key={index}
                        className="border-0 d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong className="nickname text-black">{rating.nick_name}</strong> -{" "}
                          <span className="text-warning">
                            {rating.rating_favorite} ★
                          </span>
                          <p className="mb-1">{rating.comment_favorite}</p>
                          <small className="text-muted">
                            Posté le{" "}
                            {new Date(rating.created_at).toLocaleDateString(
                              "fr-FR"
                            )}
                          </small>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-white">Aucune évaluation pour le moment.</p>
                )}
              </Card.Body>

              {ratings.some((rating) => rating.user_id === userComment) ? (
                <p className="text-white">
                  Vous avez déjà laissé un commentaire.
                </p>
              ) : (
                <Card.Body>
                  <h4 className="mb-3">Ajouter une évaluation</h4>
                  <Form onSubmit={addRating}>
                    <Form.Group controlId="rating">
                      <Form.Label>Votre note (1 à 5):</Form.Label>
                      <Form.Control
                        as="select"
                        value={ratingFavorite}
                        onChange={(e) => setRatingFavorite(e.target.value)}
                        required
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} ★
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="comment">
                      <Form.Label>Votre commentaire:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={commentFavorite}
                        onChange={(e) => setCommentFavorite(e.target.value)}
                        required
                      />
                    </Form.Group>
                    {validationError && (
                      <p className="text-danger mt-2">
                        {validationError.comment_favorite}
                      </p>
                    )}
                    <Button variant="primary" type="submit" className="mt-3 btnStyle col-12">
                      Publier
                    </Button>
                  </Form>
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShowConfiguration;
