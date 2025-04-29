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
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/components/?term=${searchTerm}`
        );
        if (searchTerm.trim() !== "") {
          setFilteredComponents(response.data.componentSearch.data || []);
        } else {
          setFilteredComponents(response.data.components || []);
        }
      } catch (error) {
        console.error("Erreur hors de la récuperation des composant", error);
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

  const handleSelectComponent = (component) => {
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


      {/* Vérification si des composants sont disponibles */}
      {filteredComponents.length === 0 ? (
        <p>Aucun résultat trouvé 🚫</p>
      ) : (
        <div className="component-list">
          {filteredComponents.map((component) => (
            <div key={component.id} onClick={handleSelectComponent} className="component-card">
              <img
                src={component.image_component}
                alt={component.name_component}
              />
              <h3>{component.name_component}</h3>
              <p>{component.price_component}$</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentSelector;
