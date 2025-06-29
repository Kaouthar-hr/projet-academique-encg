import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Form, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaSave, FaArrowLeft } from 'react-icons/fa';
import '../index.css'; // Créez ce fichier CSS pour les styles personnalisés

const EditProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/profile');
        setUser({
          ...response.data,
          password: '',
          password_confirmation: ''
        });
      } catch (err) {
        setError('Erreur de chargement du profil');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.put('/profile', user);
      setMessage('Profil mis à jour avec succès');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <Container className="edit-profile-container py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="profile-card shadow-lg">
            <Card.Header className="profile-card-header">
              <Button 
                variant="link" 
                className="back-button"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft /> Retour
              </Button>
              <h2 className="profile-title">
                <FaUser className="me-2" />
                Modifier le Profil
              </h2>
            </Card.Header>
            
            <Card.Body className="p-4">
              {message && (
                <Alert variant="success" className="alert-message">
                  {message}
                </Alert>
              )}
              
              {error && (
                <Alert variant="danger" className="alert-message">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <FaUser className="me-2" />
                    Nom complet
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <FaEnvelope className="me-2" />
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <FaLock className="me-2" />
                    Nouveau mot de passe (laisser vide si inchangé)
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="••••••••"
                  />
                  <Form.Text className="text-muted">
                    Minimum 8 caractères
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <FaLock className="me-2" />
                    Confirmer le mot de passe
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirmation"
                    value={user.password_confirmation}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="••••••••"
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="outline-secondary" 
                    className="action-button"
                    onClick={() => navigate(-1)}
                  >
                    Annuler
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="action-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enregistrement...' : (
                      <>
                        <FaSave className="me-2" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;