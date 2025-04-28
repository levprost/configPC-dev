import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Menu from "../../../components/Menu";
import axios from "axios";
import { Link } from "react-router-dom";

const Components = () => {
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [component, setComponents] = useState([]);

  useEffect(() => {
    displayComponents();
    fetchBrands();
  }, []);

  const displayComponents = async () => {
      await axios.get("http://127.0.0.1:8000/api/components").then((res) => {
          setComponents(res.data.components);
          console.log(res.data);
    });
  };

  const fetchBrands = async () => {
    await axios.get("http://127.0.0.1:8000/api/brands").then((res) => {
      setBrand(res.data);
    });
  };
  const fetchCategories = async () => {
    await axios.get("http://127.0.0.1:8000/api/categories").then((res) => {
      setCategory(res.data);
    });
  };

  const deleteComponent = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/components/${id}`).then(displayComponents);
  };

  return (
    <div>
      <Menu />
      <div className="container mt-5">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nom du composant</th>
              <th>Sous-titre du composant</th>
              <th>Prix du composant</th>
              <th>Description du composant</th>
              <th>Consommation du composant</th>
              <th>Avis du composant</th>
              <th>Image du composant</th>
              <th>Vidéo du composant</th>
              <th>date de sortie du composant</th>
              <th>Type de composant</th>
              <th>Marque de composant</th>
              <th>Catégorie de composant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {component.map((component) => (
              <tr key={component.id}>
                <td>{component.name_component}</td>
                <td>{component.subtitle_component}</td>
                <td>{component.price_component}</td>
                <td>{component.description_component}</td>
                <td>{component.consumption_component}</td>
                <td>{component.review_component}</td>

                <td>
                  <img
                    src={`http://127.0.0.1:8000/storage/uploads/${component.image_component}`}
                    width="75px"
                    alt="pas d'images"
                  />
                </td>
                <td>{component.video_component}</td>
                <td>{component.release_date_component}</td>
                <td>{component.type_component}</td>
                <td>{component.brand.name_brand}</td>
                <td>{component.category.name_category}</td>
                
                <Link
                  to={`/admin/components/edit/${component.id}`}
                  className="btn btn-success me-2"
                >
                  Edit
                </Link>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => deleteComponent(component.id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Components;
