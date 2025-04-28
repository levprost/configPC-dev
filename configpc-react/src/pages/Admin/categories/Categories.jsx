import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Menu from "../../../components/Menu";
import axios from "axios";
import { Link } from "react-router-dom";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    displayCategory();
  }, []);

  const displayCategory = async () => {
    await axios.get(`http://127.0.0.1:8000/api/categories?page=${currentPage}`).then((res) => {
      setCategory(res.data.data);
      setCurrentPage(res.data.current_page); 
      setTotalPages(res.data.last_page); 
    });
  };


  const deleteCategory = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/categories/${id}`).then(displayCategory);
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
              <th>Nom de catégorie</th>
            </tr>
          </thead>
          <tbody>
            {category.map((category) => (
              <tr key={category.id}>
                <td>{category.name_category}</td>
                <Link
                  to={`/admin/categories/edit/${category.id}`}
                  className="btn btn-success me-2"
                >
                  Edit
                </Link>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => deleteCategory(category.id)}
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

export default Category;
