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
import { FaUser, FaCalendarAlt, FaCommentDots } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./../../../styles/css/showpost.css"
import Menu from "../../../components/Menu";

const ShowPost = () => {
  const { post } = useParams();
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [contentComment, setContentComment] = useState([]);
  const [postId, setPostId] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const [userComment, setUserComment] = useState([]);

  const [validationError, setValidationError] = useState({});
  useEffect(() => {
    displayPost();
    fetchUser();
    setLoadingComments(false);
  }, [post]);

  const fetchUser = async () => {
    //Récuperation de utilisateur actuel
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Pas de token!");
        return;
      }

      const res = await axios.get("http://127.0.0.1:8000/api/currentuser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Reponse de serveur:", res.data);
      setUserComment(res.data.data.user.id);
    } catch (error) {
      console.error(
        "Erreur hors de récuperation de utilisateur:",
        error.response || error
      );
    }
  };

  const displayPost = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/posts/${post}`);
      setPostData(res.data);
      setComments(res.data.comments || []);
      setPostId(res.data.id); //for post_id
      console.log(res.data);
    } catch (error) {
      console.log("Erreur lors du chargement du post:", error);
    }
  };
  const addComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Utilisateur non authentifié !");
        return;
      }

      const formData = new FormData();
      formData.append("content_comment", contentComment);
      formData.append("post_id", post);
      formData.append("user_id", userComment);

      const res = await axios.post(
        `http://127.0.0.1:8000/api/comments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments([...comments, res.data]);
      setContentComment("");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        console.error("Le commentaire n'a été pas créé", error);
      }
    }
  };
  if (!postData) {
    return <p className="text-center mt-5">Chargement du post...</p>;
  }
  const deleteComment = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/comments/${id}`).then(displayPost);
  };

  return (
      <div className="mainPost">
      <Menu />
        <Container className="mt-5">
          <Row className="justify-content-center post-card">
            <Col lg={8}>
              <Card className="p-4 post-card-border">
                <Card.Body>
                  <h2 className="text-center title-post">{postData.title_post}</h2>
                  <h5 className="text-center subtitle-post">
                    {postData.subtitle_post}
                  </h5>
                  <hr className="strictLine"/>
                  <div className="d-flex justify-content-between text-muted">
                    <span className="text-white">
                      <FaUser/> Auteur:{" "}
                      {postData.user ? postData.user.nick_name : "Inconnu"}
                    </span>
                    <span className="text-white">
                      <FaCalendarAlt/> Publié le:{" "}
                      {new Date(postData.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </Card.Body>

                <Card.Body className="border rounded bg-white border-general">
                  <p>{postData.content_post}</p>
                  {postData.content_post_1 && <p>{postData.content_post_1}</p>}
                  {postData.content_post_2 && <p>{postData.content_post_2}</p>}
                  <blockquote >
                    {postData.description_post}
                  </blockquote>
                </Card.Body>

                <Card.Body>
                  <h4 className="mb-3 text-white">Médias</h4>
                  {postData.media && postData.media.length > 0 ? (
                    <Row>
                      {postData.media.map((media, index) => (
                        <Col key={index} md={4} className="mb-3">
                          <Image
                            src={`http://127.0.0.1:8000/storage/uploads/${media.media_file}`}
                            alt="Média"
                            thumbnail
                            className="shadow-sm rounded"
                          />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p className="text-muted">Aucun média disponible.</p>
                  )}
                </Card.Body>

                <Card.Body>
                  <h4 className="mb-3 text-white">
                    <FaCommentDots /> Commentaires
                  </h4>
                  {comments.length > 0 ? (
                    <ListGroup variant="flush rounded border-general">
                      {comments.map((comment, index) => (
                        <ListGroup.Item
                          key={index}
                          className="border-0 d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong className="nickname">{comment.user.nick_name}</strong>
                            <p className="mb-1">{comment.content_comment}</p>
                            <small className="text-muted">
                              Posté le{" "}
                              {new Date(comment.created_at).toLocaleDateString(
                                "fr-FR"
                              )}
                            </small>
                          </div>

                          {/* Кнопка удаления (показывается только автору комментария) */}
                          {comment.user.id === userComment && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteComment(comment.id)}
                            >
                              🗑️
                            </Button>
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p className="text-muted">Aucun commentaire pour le moment.</p>
                  )}
                </Card.Body>

                <Card.Body>
                  <h4 className="mb-3">Ajouter un commentaire</h4>
                  <Form onSubmit={addComment}>
                    <Form.Group controlId="comment">
                      <Form.Label>Votre commentaire:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={contentComment}
                        onChange={(e) => setContentComment(e.target.value)}
                        required
                      />
                    </Form.Group>
                    {validationError && (
                      <p className="text-danger mt-2">
                        {validationError.content_comment}
                      </p>
                    )}
                    <Button variant="primary" type="submit" className="mt-3">
                      Publier
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
  );
};

export default ShowPost;
