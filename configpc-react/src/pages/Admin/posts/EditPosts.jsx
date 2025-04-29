import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Menu from "../../../components/Menu";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const EditPost = () => {
  const { post } = useParams();

  const navigate = useNavigate();
  const [titlePost, setTitlePost] = useState("");
  const [content1Post, setContent1Post] = useState("");
  const [content2Post, setContent2Post] = useState("");
  const [content3Post, setContent3Post] = useState("");
  const [subtitlePost, setSubtitlePost] = useState("");
  const [descriptionPost, setDescriptionPost] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [orderPost, setOrderPost] = useState(null);
  const [userPost, setUserPost] = useState("");
  const [mediaPost, setMediaPost] = useState("");
  const [postId, setPostId] = useState(null);

  const [mediaFiles, setMediaFiles] = useState([]);

  const [validationError, setValidationError] = useState({});

  const allowedFormats = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/svg+xml",
  ];
  useEffect(() => {
    getPost();
  }, []);
  const getPost = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${post}`);
      setTitlePost(res.data.title_post);
      setContent1Post(res.data.content_post);
      setContent2Post(res.data.content_post_1);
      setContent3Post(res.data.content_post_2);
      setSubtitlePost(res.data.subtitle_post);
      setDescriptionPost(res.data.description_post);
      setIsPublished(res.data.is_published);
      setUserPost(res.data.user ? res.data.user.nick_name : "");
      setMediaPost(res.data.media || []);
      setPostId(res.data.id);
      console.log(res.data);
    } catch (error) {
      console.log("Erreur lors du chargement du post:", error);
    }
  };
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    processFiles(selectedFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    processFiles(droppedFiles);
  };
  const removeFile = (indexToRemove) => {
    setMediaFiles(mediaFiles.filter((_, index) => index !== indexToRemove));
  };
  const processFiles = (files) => {
    const filteredFiles = files.filter((file) =>
      allowedFormats.includes(file.type)
    );

    if (filteredFiles.length < files.length) {
      alert(
        "Certains fichiers ont été rejetés car leur format n'est pas pris en charge."
      );
    }

    if (filteredFiles.length > 0) {
      setMediaFiles([...mediaFiles, ...filteredFiles]);
      addMedia(filteredFiles);
    }
  };

  const addMedia = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("media_file[]", file);
      formData.append("media_type[]", "image"); 
    });

    formData.append("post_id", postId);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/media`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getPost(); 
    } catch (error) {
      console.error("Erreur hors de création de média:", error);
    }
  };

  const updatePost = async (e) => {
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
      formData.append("_method", "PUT");

      await axios.post(
        `${process.env.REACT_APP_API_URL}i/posts/${post}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Post mis à jour avec succès !");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        console.error("Le post n'a pas été mis à jour", error);
      }
    }
  };

  const handleDeleteMedia = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/media/${id}`).then(getPost);
      console.log("Média supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du média:", error);
    }
  };

  return (
    <>
      <Menu />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Modifier l'article</h4>
                <hr />
  
                {/* Display validation errors */}
                {Object.keys(validationError).length > 0 && (
                  <div className="alert alert-danger">
                    <ul className="mb-0">
                      {Object.entries(validationError).map(([key, value]) => (
                        <li key={key}>{value}</li>
                      ))}
                    </ul>
                  </div>
                )}
  
                <Form onSubmit={updatePost}>
                  {/* Title and Subtitle */}
                  <Row>
                    <Col>
                      <Form.Group controlId="titlePost">
                        <Form.Label>Titre</Form.Label>
                        <Form.Control type="text" value={titlePost} onChange={(e) => setTitlePost(e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
  
                  <Row className="mt-3">
                    <Col>
                      <Form.Group controlId="subtitlePost">
                        <Form.Label>Sous-titre</Form.Label>
                        <Form.Control type="text" value={subtitlePost} onChange={(e) => setSubtitlePost(e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
  
                  {/* Content fields */}
                  {[content1Post, content2Post, content3Post].map((content, index) => (
                    <Row className="mt-3" key={index}>
                      <Col>
                        <Form.Group controlId={`contentPost${index + 1}`}>
                          <Form.Label>Contenu {index + 1}</Form.Label>
                          <Form.Control type="text" value={content} onChange={(e) => {
                            if (index === 0) setContent1Post(e.target.value);
                            if (index === 1) setContent2Post(e.target.value);
                            if (index === 2) setContent3Post(e.target.value);
                          }} />
                        </Form.Group>
                      </Col>
                    </Row>
                  ))}
  
                  {/* Description */}
                  <Row className="mt-3">
                    <Col>
                      <Form.Group controlId="descriptionPost">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} value={descriptionPost} onChange={(e) => setDescriptionPost(e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
  
                  {/* Publication and order */}
                  <Row className="mt-3">
                    <Col>
                      <Form.Group controlId="isPublished">
                        <Form.Check type="switch" label="Publié" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked ? 1 : 0)} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="orderPost">
                        <Form.Label>Ordre (1-10)</Form.Label>
                        <Form.Control type="number" min="1" max="10" value={orderPost} onChange={(e) => setOrderPost(parseInt(e.target.value, 10) || 1)} />
                      </Form.Group>
                    </Col>
                  </Row>
  
                  {/* Uploaded media list */}
                  <Row className="mt-4">
                    <Col>
                      <h5>Médias téléchargés</h5>
                      <div className="d-flex flex-wrap gap-3">
                        {mediaPost.length > 0 ? (
                          mediaPost.map((media, index) => (
                            <div key={index} className="position-relative">
                              <img src={`http://127.0.0.1:8000/storage/uploads/${media.media_file}`} width="100" height="100" className="rounded shadow-sm" alt="Média" />
                              <button
                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                onClick={() => handleDeleteMedia(media.id)}
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">Aucun média téléchargé</p>
                        )}
                      </div>
                    </Col>
                  </Row>
  
                  {/* File upload section */}
                  <Row className="mt-4">
                    <Col>
                      <h5>Ajouter des médias</h5>
                      <div
                        className="border p-4 text-center rounded shadow-sm bg-light"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <p className="mb-2">Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</p>
                        <Form.Control type="file" multiple accept=".jpg,.jpeg,.png,.gif,.svg" onChange={handleFileChange} />
                      </div>
  
                      {/* Selected files before upload */}
                      {mediaFiles.length > 0 && (
                        <div className="mt-3">
                          <h6>Fichiers sélectionnés :</h6>
                          {mediaFiles.map((media, index) => (
                            <Row key={index} className="align-items-center mb-2">
                              <Col md={6}>
                                <span>{media.name}</span>
                              </Col>
                              <Col md={4}>
                                <Form.Control as="select" value="image" disabled>
                                  <option value="image">Image</option>
                                </Form.Control>
                              </Col>
                              <Col md={2}>
                                <Button variant="danger" size="sm" onClick={() => removeFile(index)}>
                                  <FaTrash />
                                </Button>
                              </Col>
                            </Row>
                          ))}
                        </div>
                      )}
                    </Col>
                  </Row>
  
                  {/* Save button */}
                  <Button variant="primary" className="mt-4 w-100" size="lg" type="submit">
                    Sauvgarder les changements
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

export default EditPost;
