import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Menu";
import "./../styles/css/navbar.css";
import imageCarousel from "./../public/graph.jpg";
import imageDefaultPost from "./../public/logo.png";
import "./../styles/css/homePage.css";
import "./../styles/css/buttonHome.css";
import { Button } from "react-bootstrap";


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [postsActual, setPostsActual] = useState([]);

  useEffect(() => {
    displayPosts();
    displayPostsActual();
  }, []);

  const displayPosts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/order`);
      setPosts(res.data);
    } catch (error) {
      console.error("Erreur d'enrigistrement des posts:", error);
    }
  };
  const displayPostsActual = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/home`);
      console.log(res.data);
      setPostsActual(res.data);
    } catch (error) {
      console.error("Erreur d'enrigistrement des posts:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mainHome">
        <div className="row g-0">
          <div
            id="carouselExampleControls"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row">
                  <div className="col-lg-7 col-md-10 rightSide">
                    <h2 className="titleSlide">
                      Combien d'énergie mon ordinateur consomme-t-il?
                    </h2>
                    <div className="carousel-caption">
                      <button className="glowing-btn btnCalc" >
                      <a href="/calculconfiguration">
                        Calculatrice en ligne
                      </a>
                        
                      </button>
                    </div>
                  </div>
                  <img
                    src={imageCarousel}
                    className="d-block carImg col-lg-5 col-md-2"
                    alt="configuration"
                  />
                  <h2 className="titleSlideImg">
                    Combien d'énergie mon ordinateur consomme-t-il?
                  </h2>
                  <button className="glowing-btn btnCalcImg"  href="/calculator">
                    Calculatrice en ligne
                  </button>
                </div>
              </div>

              {posts.map((post, index) => (
                <div key={post.id} className="carousel-item">
                  {post.media && post.media.length > 0 ? (
                    <img
                      src={`${process.env.REACT_APP_FILE_URL}/${post.media[0].media_file}`}
                      className="d-block carImg"
                      alt={post.title_post}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/800x400"
                      className="d-block w-100"
                      alt={post.title_post}
                    />
                  )}
                  <div className="carousel-caption">
                    <p>{post.title_post}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        {/* =============Posts card=============== */}
        <section className="postsCardsHome mx-1 mx-md-5">
          <div className="row mt-5">
            <h3 className="titleSection1">Actualités</h3>
            <h5 className="subtitleSection1">3 dérnieres articles</h5>
            <hr className="strictLine" />
          </div>
          <div className="row mt-5">
            {postsActual.map((post) => (
              <div key={post.id} className="col-lg-6 col-md-12 mb-4 cardPost ">
                <div className="card cardStylePost">
                  <div className="row g-0">
                    <div className="col-md-4 containerImgPost g-0">
                      {post.media && post.media.length > 0 ? (
                        <img
                          src={`${process.env.REACT_APP_FILE_URL}/${post.media[0].media_file}`}
                          className="rounded-start"
                          style={{
                            objectFit: "cover",
                            height: "200px",
                            width: "100%",
                          }}
                          alt={post.title_post}
                        />
                      ) : (
                        <img
                          src={imageDefaultPost}
                          className="rounded-start"
                          style={{
                            objectFit: "cover",
                            height: "200px",
                            width: "100%",
                          }}
                          alt="Default"
                        />
                      )}
                    </div>
                    <div className="col-md-8">
                      <div className="card-body cardBodyPost">
                        <h5 className="card-title">{post.title_post.length > 2 ? `${post.title_post.substring(0, 20)}` : post.title_post}</h5>
                        <p className="card-text">
                          {post.description_post.length > 100
                            ? `${post.description_post.substring(0, 100)}...`
                            : post.description_post}
                        </p>
                        <a
                          href={`/ShowPost/${post.id}`}
                          className="btn-default12"
                        >
                          Lire la suite
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
