import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Carreras.css';

// Importa tus imágenes (asegúrate de tenerlas en tu carpeta assets)
import softwareImg from '../../assets/Software.jpg';
import telecomImg from '../../assets/Telecomunicaciones.png';
import tiImg from '../../assets/TI.png';
import industrialImg from '../../assets/industrial.jpg';
import roboticaImg from '../../assets/robotica.jpg';

const CATEGORIES_DATA = [
  { 
    id: 1, 
    name: 'SOFTWARE', 
    image: softwareImg,
    route: '/cursos?carrera=software'
  },
  { 
    id: 2, 
    name: 'TELECOMUNICACIONES', 
    image: telecomImg,
    route: '/cursos?carrera=telecomunicaciones'
  },
  { 
    id: 3, 
    name: 'TI', 
    image: tiImg,
    route: '/cursos?carrera=ti'
  },
  { 
    id: 4, 
    name: 'INDUSTRIAL', 
    image: industrialImg,
    route: '/cursos?carrera=industrial'
  },
  { 
    id: 5, 
    name: 'ROBÓTICA', 
    image: roboticaImg,
    route: '/cursos?carrera=robotica'
  }
];

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(category.route);
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <div className="category-image-container">
        <img 
          src={category.image} 
          alt={category.name}
          className="category-image"
          loading="lazy"
        />
        <div className="image-overlay"></div>
      </div>
      <h3 className="category-title">{category.name}</h3>
    </div>
  );
};

const CategoriesSection = () => {
  return (
    <section className="categories-section">
      <div className="section-container">
        <header className="section-header">
          <h2 className="section-title">Explora por Carreras</h2>
          <p className="section-subtitle">
            Descubre eventos y cursos relacionados con tu área de estudio
          </p>
        </header>
        
        <div className="categories-grid">
          {CATEGORIES_DATA.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;