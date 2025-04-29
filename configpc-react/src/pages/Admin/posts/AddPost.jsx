import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Menu from "../../../components/Menu";
import AddMedia from "../media/AddMedia";

const AddPost = () => {
  const [titlePost, setTitlePost] = useState("");
  const [content1Post, setContent1Post] = useState("");
  const [content2Post, setContent2Post] = useState("");
  const [content3Post, setContent3Post] = useState("");
  const [subtitlePost, setSubtitlePost] = useState("");
  const [descriptionPost, setDescriptionPost] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [orderPost, setOrderPost] = useState(null);
  const [userPost, setUserPost] = useState("");
  const [step, setStep] = useState(1);

  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Токен отсутствует!");
        return;
      }

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/currentuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Reponse de serveur:", res.data);
      setUserPost(res.data.data.user.id); 
    } catch (error) {
      console.error(
        "Erreur de la récuperation d'utilisateur:",
        error.response || error
      );
    }
  };

  const addPost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token"); 
      if (!token) {
        console.error("Utilisateur non authentifié !");
        return;
      }

      const formData = new FormData();
      formData.append("title_post", titlePost);
      formData.append("content_post", content1Post);
      formData.append("content_post_1", content2Post);
      formData.append("content_post_2", content3Post);
      formData.append("subtitle_post", subtitlePost);
      formData.append("description_post", descriptionPost);
      formData.append("is_published", isPublished);
      formData.append("order_post", orderPost);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (res.data) {
        setStep(2);
      } else {
        console.error("ID du post non reçu !");
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        console.error("Le post n'a été pas créé", error);
      }
    }
  };

  return (
    <>
      <Menu />
      <div className="container">
        {step === 1 ? (
          <div className="row justify-content-center">
            <div className="col-12 col-sm-12 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Création d'un nouvel post</h4>
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
                    <Form onSubmit={addPost}>
                      <Row>
                        <Col>
                          <Form.Group controlId="Name">
                            <Form.Label>Titre du post</Form.Label>
                            <Form.Control
                              type="text"
                              value={titlePost}
                              onChange={(event) =>
                                setTitlePost(event.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Group controlId="Name">
                            <Form.Label>Sous-titre du post</Form.Label>
                            <Form.Control
                              type="text"
                              value={subtitlePost}
                              onChange={(event) =>
                                setSubtitlePost(event.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Group controlId="Content1Post">
                            <Form.Label>Premier contenu du poste</Form.Label>
                            <Form.Control
                              type="text"
                              value={content1Post}
                              onChange={(event) =>
                                setContent1Post(event.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Group controlId="Content2Post">
                            <Form.Label>Deuxième contenu d'article</Form.Label>
                            <Form.Control
                              type="text"
                              value={content2Post}
                              onChange={(event) =>
                                setContent2Post(event.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Group controlId="Content3Post">
                            <Form.Label>Troisième contenu d'article</Form.Label>
                            <Form.Control
                              type="text"
                              value={content3Post}
                              onChange={(event) =>
                                setContent3Post(event.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Group controlId="DescriptionPost">
                            <Form.Label>Déscription du post</Form.Label>
                            <Form.Control
                              type="text"
                              value={descriptionPost}
                              onChange={(event) =>
                                setDescriptionPost(event.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Group controlId="IsPublished">
                            <Form.Check
                              type="switch"
                              label="Publier"
                              checked={isPublished}
                              onChange={(event) =>
                                setIsPublished(event.target.checked ? 1 : 0)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <Form.Group controlId="OrderPost">
                            <Form.Label>Ordre du post (1-10)</Form.Label>
                            <Form.Control
                              type="number"
                              min="1"
                              max="10"
                              value={orderPost}
                              onChange={(event) => {
                                let value = parseInt(event.target.value, 10);
                                if (value >= 1 && value <= 10) {
                                  setOrderPost(value);
                                }
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button
                        variant="primary"
                        className="mt-2 w-100"
                        size="lg"
                        type="submit"
                      >
                        Prochaine étape
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AddMedia />
        )}
      </div>
    </>
  );
};

export default AddPost;