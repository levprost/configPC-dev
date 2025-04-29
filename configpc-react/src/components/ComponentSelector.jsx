import React, { useState, useEffect } from "react";
import axios from "axios";

const ComponentSelector = ({ categoryName, categoryKey, onSelect }) => {
  const [categories, setCategories] = useState([]); // Pour stocker les catégories
  const [components, setComponents] = useState([]); // Pour stocker tous les composants
  const [filteredComponents, setFilteredComponents] = useState([]); // Pour filtrer les composants
  const [searchTerm, setSearchTerm] = useState(""); // Pour la recherche
  const [selectedCategory, setSelectedCategory] = useState(null); // Catégorie sélectionnée

  // Charger les catégories au moment du montage du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categories"
        );
        setCategories(response.data.categories || []); // Supposons que l'API renvoie les catégories
      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchFilteredComponents = async () => {
      if (searchTerm) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/components/?term=${searchTerm}`
          );
          setFilteredComponents(response.data.components || []);
        } catch (error) {
          console.error("Ошибка при поиске компонентов", error);
        }
      } else {
        setFilteredComponents(components); // Если строка поиска пуста, показываем все компоненты
      }
    };

    fetchFilteredComponents();
  }, [searchTerm, components]);

  // Charger les composants lorsque la catégorie sélectionnée change
  useEffect(() => {
    if (selectedCategory) {
      const fetchComponentsByCategory = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/components/category/${selectedCategory}`
          );
          setComponents(response.data.components); // Enregistrer les composants pour la catégorie sélectionnée
          setFilteredComponents(response.data.components); // Filtrer les composants immédiatement
        } catch (error) {
          console.error(
            "Erreur lors du chargement des composants pour la catégorie",
            error
          );
        }
      };

      fetchComponentsByCategory();
    }
  }, [selectedCategory]); // Charger les composants lorsque la catégorie sélectionnée change

  // Filtrer les composants par nom
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); // Обновляем строку поиска
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId); // Définir la catégorie sélectionnée
  };

  const handleClick = (component) => {
    onSelect(component); // Retourner le composant sélectionné au composant parent
  };

  return (
    <div>
      <h5>{categoryName}</h5>

      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher un composant..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      {/* Liste des catégories */}
      <div>
        <h6>Sélectionnez une catégorie :</h6>
        <ul>
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              style={{
                cursor: "pointer",
                marginBottom: "10px",
                padding: "10px",
                backgroundColor:
                  selectedCategory === category.id ? "#d3d3d3" : "",
              }}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Vérification si des composants sont disponibles */}
      {filteredComponents.length === 0 ? (
        <p>Aucun résultat trouvé 🚫</p>
      ) : (
        <div className="component-list">
          {filteredComponents.map((component) => (
            <div
              key={component.id}
              className="component-card"
              onClick={() => handleClick(component)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={component.image}
                alt={component.name}
                style={{ width: "150px", height: "auto" }}
              />
              <h6>{component.name}</h6>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentSelector;
