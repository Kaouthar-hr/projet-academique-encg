import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        fontFamily: "'Poppins', sans-serif",
        padding: 0,
        margin: 0
      }}
    >
      {/* Hero Section */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0056b3 0%, #003366 100%)',
          color: 'white',
          padding: '6rem 2rem 4rem',
          clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
          marginBottom: '3rem'
        }}
        data-aos="fade"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <img 
                src="/Capture encg.PNG" 
                alt="Logo ENCG" 
                style={{
                  width: '100px',
                  height: '100px',
                  marginBottom: '1.5rem',
                  borderRadius: '50%',
                  border: '3px solid white'
                }}
                data-aos="zoom-in"
              />
              <h1 
                style={{
                  fontSize: '2.8rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  lineHeight: '1.2'
                }}
                data-aos="fade-up"
              >
                École Nationale de Commerce et de Gestion
              </h1>
              <p 
                style={{
                  fontSize: '1.2rem',
                  opacity: '0.9',
                  marginBottom: '2rem'
                }}
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Excellence et Innovation au Service de Votre Avenir
              </p>
              <div data-aos="fade-up" data-aos-delay="400">
                <button 
                  style={{
                    background: '#ff6b00',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 2rem',
                    borderRadius: '50px',
                    fontWeight: '600',
                    margin: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Se connecter
                </button>
                <button 
                  style={{
                    background: 'transparent',
                    color: 'white',
                    border: '2px solid white',
                    padding: '0.8rem 2rem',
                    borderRadius: '50px',
                    fontWeight: '600',
                    margin: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Découvrir nos formations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ marginBottom: '5rem' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* About Section */}
            <div 
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '2.5rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                marginBottom: '2rem'
              }}
              data-aos="fade-up"
            >
              <h2 
                style={{
                  color: '#0056b3',
                  marginBottom: '1.5rem',
                  fontWeight: '600'
                }}
              >
                À propos de l'ENCG
              </h2>
              <p 
                style={{
                  color: '#555',
                  fontSize: '1.1rem',
                  lineHeight: '1.7',
                  marginBottom: '1.5rem'
                }}
              >
                L'École Nationale de Commerce et de Gestion forme des cadres supérieurs dans les domaines du management, de la finance, du marketing et de la stratégie.
              </p>
              
              <h3 
                style={{
                  color: '#0056b3',
                  margin: '1.5rem 0 1rem',
                  fontWeight: '500'
                }}
              >
                Nos services en ligne
              </h3>
              <ul 
                style={{
                  color: '#555',
                  paddingLeft: '1.2rem',
                  listStyleType: 'none'
                }}
              >
                <li style={{ marginBottom: '0.8rem', position: 'relative', paddingLeft: '1.5rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#ff6b00',
                    fontWeight: 'bold'
                  }}>•</span>
                  Gérer vos inscriptions et réinscriptions en ligne
                </li>
                <li style={{ marginBottom: '0.8rem', position: 'relative', paddingLeft: '1.5rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#ff6b00',
                    fontWeight: 'bold'
                  }}>•</span>
                  Consulter vos informations académiques
                </li>
                <li style={{ marginBottom: '0.8rem', position: 'relative', paddingLeft: '1.5rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#ff6b00',
                    fontWeight: 'bold'
                  }}>•</span>
                  Accéder aux services numériques et formulaires
                </li>
                <li style={{ marginBottom: '0.8rem', position: 'relative', paddingLeft: '1.5rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#ff6b00',
                    fontWeight: 'bold'
                  }}>•</span>
                  Télécharger vos documents administratifs
                </li>
              </ul>
            </div>

            {/* Features Grid */}
            <div className="row">
              <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="200">
                <div 
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    height: '100%',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <h3 style={{ color: '#0056b3', fontSize: '1.3rem' }}>Actualités</h3>
                  <p style={{ color: '#666', fontSize: '0.95rem' }}>
                    Restez informé des dernières nouvelles et événements de l'école.
                  </p>
                </div>
              </div>
              
              <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="300">
                <div 
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    height: '100%',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <h3 style={{ color: '#0056b3', fontSize: '1.3rem' }}>Calendrier</h3>
                  <p style={{ color: '#666', fontSize: '0.95rem' }}>
                    Consultez les dates importantes de l'année académique.
                  </p>
                </div>
              </div>
              
              <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="400">
                <div 
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    height: '100%',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <h3 style={{ color: '#0056b3', fontSize: '1.3rem' }}>Contact</h3>
                  <p style={{ color: '#666', fontSize: '0.95rem' }}>
                    Besoin d'aide ? Contactez notre service administratif.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer 
        style={{
          background: '#003366',
          color: 'white',
          padding: '2rem 0',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <p style={{ marginBottom: '0.5rem' }}>
            © 2023 ENCG - Tous droits réservés
          </p>
          <div style={{ marginTop: '1rem' }}>
            <a 
              href="#" 
              style={{
                color: 'white',
                margin: '0 1rem',
                textDecoration: 'none'
              }}
            >
              Mentions légales
            </a>
            <a 
              href="#" 
              style={{
                color: 'white',
                margin: '0 1rem',
                textDecoration: 'none'
              }}
            >
              Contact
            </a>
            <a 
              href="#" 
              style={{
                color: 'white',
                margin: '0 1rem',
                textDecoration: 'none'
              }}
            >
              Plan du site
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;