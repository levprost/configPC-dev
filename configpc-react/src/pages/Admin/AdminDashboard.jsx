import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaBox,
    FaThList,
    FaCogs,
    FaDatabase,
    FaUsers,
    FaImage,
    FaNewspaper,
} from "react-icons/fa";
import { GoCpu } from "react-icons/go";
import { BsPc } from "react-icons/bs";
import "./../../styles/css/dashboard.css"; // Подключи свой CSS файл
import "bootstrap/dist/css/bootstrap.min.css"; // Подключи Bootstrap CSS

const AdminDashboard = () => {
    const [selectedSection, setSelectedSection] = useState(null);

    const sections = [
        { name: "Brands", path: "/admin/brands", icon: <FaBox /> },
        { name: "Categories", path: "/admin/categories", icon: <FaThList /> },
        { name: "Components", path: "/admin/components", icon: <GoCpu /> },
        { name: "Configurations", path: "/admin/configurations", icon: <BsPc /> },
        { name: "Contacts", path: "/admin/contacts", icon: <FaUsers /> },
        { name: "Media", path: "/admin/media", icon: <FaImage /> },
        { name: "Posts", path: "/admin/posts", icon: <FaNewspaper /> },
    ];

    const handleCardClick = (index) => {
        setSelectedSection(index === selectedSection ? null : index);
    };

    return (
        <section className="mainadmin">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <main className="col-md-8">
                        <h2>Admin Panel</h2>
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                            {sections.map((section, index) => (
                                <div className="col" key={index}>
                                    <div
                                        className={`card-admin h-100 ${selectedSection === index ? "selected" : ""}`}
                                        onClick={() => handleCardClick(index)}
                                    >
                                        <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                            {selectedSection !== index ? (
                                                <>
                                                    <div className="icon-wrapper">
                                                        {section.icon}
                                                    </div>
                                                    <h5 className="card-title mt-2 text-center">{section.name}</h5>
                                                </>
                                            ) : (
                                                <div className="d-flex flex-column gap-2">
                                                    <Link to={`${section.path}/`} className="btn btn-dark">
                                                        Voir la liste
                                                    </Link>
                                                    <Link to={`${section.path}/add`} className="btn btn-outline-success">
                                                        Créér {section.name}
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                    <div className="col-md-2">
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;