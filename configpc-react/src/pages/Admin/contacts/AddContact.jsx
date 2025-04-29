import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Menu from "../../../components/Menu";

const AddContact = () => {
  const navigate = useNavigate();

  const [subjectContact, setSubjectContact] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [imageContact, setImageContact] = useState(null);
  const [messageContact, setMessageContact] = useState("");
  const [validationError, setValidationError] = useState({});

  const changeHandler = (event) => {
    setImageContact(event.target.files[0]);
  };

  //Fonction d'ajout de Contact
  const addContact = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("subject_contact", subjectContact);
    formData.append("email_contact", emailContact);
    if (imageContact) {
        formData.append("image_contact", imageContact);
      }
    formData.append("message_contact", messageContact);
    

    await axios
      .post(`${process.env.REACT_APP_API_URL}/contacts`, formData)
      .then(navigate("/admin/contacts"))
      .catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors);
        }
      });
  };
  return (
    <div>
      <Menu />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">
                  Envoyer une message à l'Administration
                </h4>
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
                  <Form onSubmit={addContact}>
                    <Row>
                      <Col>
                        <Form.Group controlId="Name">
                          <Form.Label>Objet du message</Form.Label>
                          <Form.Control
                            type="text"
                            value={subjectContact}
                            onChange={(event) => {
                              setSubjectContact(event.target.value);
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="Name">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="text"
                            value={emailContact}
                            onChange={(event) => {
                              setEmailContact(event.target.value);
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="Message">
                          <Form.Label>Votre message</Form.Label>
                          <Form.Control
                            type="text"
                            value={messageContact}
                            onChange={(event) => {
                              setMessageContact(event.target.value);
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="ImageContact" className="mb-3">
                          <Form.Label>Image de contact</Form.Label>
                          <Form.Control type="file" onChange={changeHandler} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button
                      variant="primary"
                      className="mt-2"
                      size="lg"
                      block="block"
                      type="submit"
                    >
                      Créer
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContact;
