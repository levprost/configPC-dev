import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Menu from "../../../components/Menu";
import axios from "axios";
import { useParams } from "react-router-dom";

const Contact = () => {
  const { contact } = useParams(); // Используем contact вместо id

  const [subjectContact, setSubjectContact] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [imageContact, setImageContact] = useState(null);
  const [messageContact, setMessageContact] = useState("");
  const [isReadContact, setIsReadContact] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/contacts/${contact}`
        );
        setSubjectContact(res.data.subject_contact);
        setEmailContact(res.data.email_contact);
        setImageContact(res.data.image_contact);
        setMessageContact(res.data.message_contact);
        setIsReadContact(res.data.is_read);
      } catch (error) {
        setError("Error fetching contact");
        console.error("Error fetching contact:", error);
      }
    };

    fetchContact();
  }, [contact]);

  if (error) {
    return (
      <div className="container mt-5">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Menu />
      <div className="container mt-5">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Objet du message</th>
              <th>Email</th>
              <th>Votre message</th>
              <th>Image</th>
              <th>Déjà répondu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{subjectContact}</td>
              <td>{emailContact}</td>
              <td>{messageContact}</td>
              <td>
                {imageContact ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/uploads/${imageContact}`}
                    width="75px"
                    alt="pas d'images"
                  />
                ) : (
                  "Aucune image"
                )}
              </td>
              <td style={{ color: isReadContact ? "green" : "red" }}>
                {isReadContact ? "Read" : "Unread"}
              </td>

            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Contact;
