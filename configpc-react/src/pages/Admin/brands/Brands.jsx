import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Menu from "../../../components/Menu";
import axios from "axios";
import { Link } from "react-router-dom";

const Brand = () => {
  const [brands, setBrands] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    displayBrands(); 
  }, [currentPage]);  

  const displayBrands = async () => {
    await axios
      .get(`http://127.0.0.1:8000/api/brands?page=${currentPage}`)
      .then((res) => {
        setBrands(res.data.data);  // Данные брендов
        setCurrentPage(res.data.current_page);  // Текущая страница
        setTotalPages(res.data.last_page);  // Общее количество страниц
      });
  };

  // Удаление бренда
  const deleteBrand = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/brands/${id}`).then(() => {
      displayBrands();  // Перезагружаем данные после удаления
    });
  };


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); 
    }
  };

  return (
    <div>
      <Menu />
      <div className="container mt-5">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nom de marque</th>
              <th>Logo de marque</th>
              <th>Description de la marque</th>
              <th>Couleur de marque</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>{brand.name_brand}</td>
                <td>
                  <img
                    src={`http://127.0.0.1:8000/storage/uploads/${brand.logo_brand}`}
                    width="75px"
                    alt="pas d'images"
                  />
                </td>
                <td>{brand.description_brand}</td>
                <td>
                  <div
                    style={{
                      backgroundColor: brand.color_brand,
                      width: "50px",
                      height: "30px",
                      border: "1px solid #ccc",
                    }}
                  ></div>
                </td>
                <Link
                  to={`/admin/brands/edit/${brand.id}`}
                  className="btn btn-success me-2"
                >
                  Edit
                </Link>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => deleteBrand(brand.id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="pagination">
          <Button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>

          <span>{`Page ${currentPage} of ${totalPages}`}</span>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Brand;
