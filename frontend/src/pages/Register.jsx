import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'etudiant',
    cne: '',
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/register', form);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setSuccess('Inscription réussie !');
      navigate('/login');
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erreur lors de l’inscription';
      setError(errMsg);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f1f6fb' }}>
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h3 className="mb-4 text-center text-primary">Créer un compte</h3>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Nom complet</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Ex: Sara El Amrani"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Adresse Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="ex: etudiant@encg.ma"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmer le mot de passe</label>
            <input
              type="password"
              name="password_confirmation"
              className="form-control"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

         
          {form.role === 'etudiant' && (
            <div className="mb-3">
              <label className="form-label">CNE</label>
              <input
                type="text"
                name="cne"
                className="form-control"
                placeholder="Ex: G123456789"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
