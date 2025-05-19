import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap 5

function PolitiqueConfidentialite() {
  const politiqueText = `
    **Politique de confidentialité**

    La présente Politique de confidentialité décrit comment notre site web collecte, utilise et protège vos données personnelles.

    **Collecte et utilisation des données personnelles**

    Nous collectons uniquement votre adresse e-mail lors de votre inscription sur notre site. Cette adresse est utilisée exclusivement pour la création de votre compte et pour vous permettre de vous connecter au site.

    **Sécurité des données**

    Nous prenons des mesures raisonnables pour protéger vos données personnelles. Pour l'authentification des utilisateurs et la protection des données, nous utilisons la technologie JWT (JSON Web Tokens). Notre base de données est également sécurisée grâce aux fonctionnalités d'Eloquent ORM.

    **Droits des utilisateurs**

    Vous avez le droit de demander la suppression de vos données personnelles à tout moment via la section "Contactez nous" de notre site web. Nous nous engageons à traiter votre demande dans les plus brefs délais.

    **Utilisation de cookies**

    Notre site web n'utilise pas de cookies ni de technologies de suivi similaires.

    **Modifications de la politique de confidentialité**

    Nous pouvons être amenés à modifier notre Politique de confidentialité de temps à autre. Les notifications de ces modifications peuvent être publiées sur cette page ou vous être envoyées par e-mail. Nous vous recommandons de consulter régulièrement cette page pour prendre connaissance de la version actuelle de la Politique de confidentialité.

    2 impasse des champs 44117 Saint André des Eaux
    France

    Si vous avez des questions ou des préoccupations concernant notre Politique de confidentialité, veuillez nous contacter à l'adresse e-mail suivante : smolevlev7@gmail.com.
  `;

  const containerStyle = {
    backgroundColor: 'rgb(54, 54, 54)',
    color: 'white', 
    padding: '20px',
    borderRadius: '8px', 
    fontFamily: "'Cascadia Mono', sans-serif",
  };

  const headingStyle = {
    color: '#f8f9fa', 
    marginBottom: '20px',
    textAlign: 'center',
  };

  const textStyle = {
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
  };

  return (
    <div className="container mt-5" style={containerStyle}>
      <h1 className="mb-4" style={headingStyle}>Politique de confidentialité</h1>
      <div style={textStyle}>{politiqueText}</div>
    </div>
  );
}

export default PolitiqueConfidentialite;