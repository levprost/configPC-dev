import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "../../../styles/css/postsList.css";
import "../../../styles/css/main.css";
import bgCard from "./../../../public/graph.jpg";
import Menu from "./../../../components/Menu";
import { FaEye, FaUserAlt } from "react-icons/fa";

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [media, setMedia] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    displayPosts();
    console.log(media);
  }, [currentPage, media]);

  const displayPosts = async () => {
    await axios
      .get(`http://127.0.0.1:8000/api/posts?page=${currentPage}`)
      .then((res) => {
        console.log(res.data);
        setPosts(res.data.data);
        setCurrentPage(res.data.current_page);
        setTotalPages(res.data.last_page);
        setMedia(res.data.media);
      });
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="main">
        <Menu />
        <div className="container mx-auto mt-4">
          <h2 className="title-list">Toutes les actualités</h2>
          <div className="row d-flex justify-content-center">
            {posts &&
              posts.map((post) => (
                <div key={post.id} className="col-md-4 mb-4">
                  <div className="card card-list me-auto d-flex flex-column">
                    {post.media &&
                    Array.isArray(post.media) &&
                    post.media.length > 0 &&
                    post.media[0].media_file &&
                    /\.(jpg|jpeg|png|gif|webp)$/i.test(
                      post.media[0].media_file
                    ) ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/uploads/${post.media[0].media_file}`}
                        className="card-img-top"
                        alt={post.title_post}
                      />
                    ) : (
                      <img
                        src={bgCard}
                        className="card-img-top"
                        alt="Placeholder"
                      />
                    )}

                    <div className="card-body card-body-list flex-grow-1">
                      <h4 className="card-title">{post.title_post}</h4>
                      <h5 className="card-subtitle my-2 border-bottom">
                        <FaUserAlt className="icon-list" />
                        {post.user.nick_name}
                      </h5>
                      <p className="card-text my-2">
                        {post.description_post.length > 100
                          ? post.description_post.slice(0, 130) + "..."
                          : post.description_post}
                      </p>
                    </div>
                    <div className="card-footer card-footer-list">
                      <Button
                        href={`/showpost/${post.id}`}
                        className="btnList w-100"
                      >
                        <FaEye className="icon mb-1" /> Voir les détails
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="pagination d-flex justify-content-center mt-4">
          <Button
            className="btnPage"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="mx-3">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            className="btnPage"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default PostsList;
