import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { FaUserCircle, FaSignOutAlt, FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import api from './api';
import './index.css';


const NavigationLinks = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const isLoggedIn = !!token;
  const userData = user ? JSON.parse(user) : null;
  const isAdmin = userData?.role === 'admin';
  const isEtudiant = userData?.role === 'etudiant';
  const isEnseignant = userData?.role === 'enseignant';
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Erreur lors de la déconnexion');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="border-bottom shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img src="/Logo-encg.png" alt="Logo ENCG" style={{ height: '60px' }} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            <Nav.Link as={Link} to="/"><FaHome /> Accueil</Nav.Link>

            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/login"><FaSignInAlt /> Se connecter</Nav.Link>
                <Nav.Link as={Link} to="/register"><FaUserPlus /> Créer un compte</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/edit-profile"><FaUserCircle /> Profil</Nav.Link>

                {isAdmin && (
                  <Dropdown>
                    <Dropdown.Toggle
                      className="btn-outline-admin"
                      size="sm"
                    >
                      Administration
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/upload-admis">Importer CNE</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/inscriptions">Inscriptions</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/teachers">Enseignants</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/demandes">Demandes</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/notes">Notes</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/modules">Modules</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/groups">Groupes</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}

                {isEtudiant && (
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-success" size="sm">Espace Étudiant</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/inscriptions">Statut Inscriptions</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/espace-etudiant">Inscriptions</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/demandes">Faire une demande</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/mes-demandes">Mes demandes</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/mes-notes">Mes notes</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}

                {isEnseignant && (
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-warning" size="sm">Espace Enseignant</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/enseignant/ajouter-note">Ajouter Note</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/prof/groups">Groupes étudiants</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}

                <Button
                  className="btn-outline-darkred"
                  size="sm"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Se déconnecter
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationLinks;
