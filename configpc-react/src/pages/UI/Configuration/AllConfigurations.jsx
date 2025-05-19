import React, { useState, useEffect } from "react";
import { Card, Col, Row, Container } from "react-bootstrap";
import { FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { GiElectric } from "react-icons/gi";
import axios from "axios";
import Menu from "../../../components/Menu";
import { Link } from "react-router-dom";
import "./../../../styles/css/allconfig.css";

const AllConfigurations = () => {
    const [configurations, setConfigurations] = useState([]);

    useEffect(() => {
        fetchAllConfigurations();
    }, []);

    const fetchAllConfigurations = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/configurations`
            );
            setConfigurations(response.data.data); // Извлекаем массив из response.data.data
        } catch (error) {
            console.error(
                "Erreur lors du chargement des configurations:",
                error
            );
        }
    };

    const calculateTotalPrice = (components) => {
        if (!components || components.length === 0) return 0;
        return components
            .reduce((total, comp) => total + parseFloat(comp.price_component), 0)
            .toFixed(2);
    };

    const calculateTotalConsumption = (components) => {
        if (!components || components.length === 0) return 0;
        return components.reduce(
            (total, comp) => total + parseInt(comp.consumption_component),
            0
        );
    };

    return (
        <div className="mainconfig">
            <Menu />
            <Container className="mt-5">
                <h1>Toutes les Configurations</h1>
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {configurations.map((config) => (
                        <Col key={config.id} className="">
                            <Link to={`/showConfiguration/${config.id}`} className="text-decoration-none">
                                <Card className="configuration-card h-100 shadow-sm configcard">
                                    <Card.Body className="d-flex flex-column config-border">
                                        <h5 className="card-title">{config.title_config}</h5>
                                        <p className="card-text flex-grow-1">{config.subtitle_config}</p>
                                        <hr className="my-2" />
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span>
                                                <FaCalendarAlt />{" "}
                                                {new Date(config.created_at).toLocaleDateString("fr-FR")}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span>
                                                <GiElectric /> {calculateTotalConsumption(config.components)} W
                                            </span>
                                            <span>
                                                <FaDollarSign /> {calculateTotalPrice(config.components)} €
                                            </span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default AllConfigurations;