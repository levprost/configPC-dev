import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Menu from "../../../components/Menu";
import axios from "axios";
import { Link } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    displayPosts();
  }, [currentPage]);

  const displayPosts = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/posts?page=${currentPage}`)
      .then((res) => {
        console.log(res.data);
        setPosts(res.data.data);
        setCurrentPage(res.data.current_page);
        setTotalPages(res.data.last_page);
      });
  };

  const deletePost = async (id) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Utilisateur non authentifié !");
      return;
    }

    try {
      const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/posts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Токен для авторизации
        },
      }
    );

    console.log("Пост успешно удалён", response.data);
    displayPosts();  // Обновляем список постов после удаления
  } catch (error) {
    console.error("Ошибка при удалении поста:", error.response || error.message);
    alert("Не удалось удалить пост. Попробуйте позже.");
  }
     
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
              <th>Titre du poste</th>
              <th>sous-titre du poste</th>
              <th>Premier contenu du poste</th>
              <th>Deuxième contenu du poste</th>
              <th>Troisième contenu du poste</th>
              <th>Description du poste</th>
              <th>Auteur du poste</th>
            </tr>
          </thead>
          <tbody>
            {posts &&
              posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title_post}</td>
                  <td>{post.subtitle_post}</td>
                  <td>{post.content_post_1}</td>
                  <td>{post.content_post_2}</td>
                  <td>{post.content_post_3}</td>
                  <td>{post.description_post}</td>
                  <td>{post.user_id}</td>

                  <Link
                    to={`/admin/posts/edit/${post.id}`}
                    className="btn btn-success me-2"
                  >
                    Edit
                  </Link>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => deletePost(post.id)}
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

export default Posts;
