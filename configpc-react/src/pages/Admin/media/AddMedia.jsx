import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddMedia = () => {
  const navigate = useNavigate();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [postId, setPostId] = useState(null);
  const [validationError, setValidationError] = useState({});

  // Les formats
  const allowedFormats = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/svg+xml",
  ];

  useEffect(() => {
    const fetchLastPostId = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/posts/last`
        );
        if (response.data && response.data.id) {
          setPostId(response.data.id);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'ID du post :",
          error
        );
      }
    };
    fetchLastPostId();
  }, []);

  // 🔹 Filtres de tyeps(Les format inclus)
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const filteredFiles = selectedFiles.filter((file) =>
      allowedFormats.includes(file.type)
    );

    if (filteredFiles.length < selectedFiles.length) {
      alert(
        "Certains fichiers ont été ignorés car ils ne sont pas dans un format valide."
      );
    }

    const newFiles = filteredFiles.map((file) => ({
      file,
      type: "image", // Par defaut image
    }));
    setMediaFiles([...mediaFiles, ...newFiles]); //Spread operator - pour mettre tous dans MediaFiles
  };

  //Pour mettre le fichier depuis l'ordinateur
  const handleDrop = (event) => {
    event.preventDefault(); //ça va pas afficher le fichier dans nouveau fênetre
    const selectedFiles = Array.from(event.dataTransfer.files); // pour avoir l'accés aux fichiers on les met dans un tableau
    const filteredFiles = selectedFiles.filter((file) =>
      allowedFormats.includes(file.type)
    ); //filtrer tous les fichiers(voir les lignes 34-35)

    if (filteredFiles.length < selectedFiles.length) {
      alert(
        "Certains fichiers ont été ignorés car ils ne sont pas dans un format valide."
      );
    }

    const newFiles = filteredFiles.map((file) => ({
      file, //on mets le fichiers
      type: "image", //type par defaut 'image'
    }));
    setMediaFiles([...mediaFiles, ...newFiles]); // on mets tous dans une tableau pour pouvoir enrigistrer
    //le fichiers qui étaient enrigistrés et cel qui vient d'étre enrigistré
  };
  //si on veut supprimer un fichier dans le liste
  const removeFile = (indexToRemove) => {
    const updatedFiles = mediaFiles.filter((file, index) => {
      return index !== indexToRemove; // supprime tous sauf ce qu'on veut retire de la liste
    });

    setMediaFiles(updatedFiles); // Mettre à jour
  };

  // Changement de type de fichiers
  const updateFileType = (index, newType) => {
    const updatedFiles = [...mediaFiles]; //on copie le mediaFiles avec Spread pour éviter le changement direct(on fait le changement d'abord dans le updateFiles)
    updatedFiles[index].type = newType; //on récupere le fichiers par index puis on change ça valuer type pour newTpe
    setMediaFiles(updatedFiles);
  };

  const addMedia = async (e) => {
    e.preventDefault();
  
    if (mediaFiles.length === 0) {
      alert("Veuillez sélectionner au moins un fichier !"); // Если нет файлов, показываем ошибку
      return;
    }
  
    const formData = new FormData();
  
    mediaFiles.forEach(({ file, type }) => {
      formData.append("media_file[]", file); 
      formData.append("media_type[]", String(type)); 
    });
  
    formData.append("post_id", postId); 
  
    try {
      await axios.post("http://127.0.0.1:8000/api/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/posts");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        console.error("Erreur lors de l'ajout du média :", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Ajouter des médias</h4>
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
              <Form onSubmit={addMedia}>
                <div
                  className="drop-zone border p-4 text-center"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <p>Déposez vos fichiers ici ou cliquez pour sélectionner</p>
                  <Form.Control
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.svg"
                    onChange={handleFileChange}
                  />
                </div>

                {mediaFiles.length > 0 && (
                  <div className="mt-3">
                    <h5>Fichiers sélectionnés :</h5>
                    {mediaFiles.map((media, index) => (
                      <Row key={index} className="align-items-center mb-2">
                        <Col md={6}>
                          <span>{media.file.name}</span>
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            as="select"
                            value={media.type} 
                            onChange={
                              (e) => updateFileType(index, e.target.value) 
                            }
                          >
                            <option value="image">Image</option>
                            <option value="video">Vidéo</option>
                          </Form.Control>
                        </Col>
                        <Col md={2}>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeFile(index)} 
                          >
                            Supprimer
                          </Button>
                        </Col>
                      </Row>
                    ))}
                  </div>
                )}

                <Button
                  variant="primary"
                  className="mt-3 w-100"
                  size="lg"
                  type="submit"
                >
                  Ajouter Média
                </Button>
              </Form>
              {postId && <p className="mt-3">Post ID utilisé : {postId}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedia;
