// src/pages/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error('Erreur lors du logout', err);
    }
  };

  return <button onClick={handleLogout}>Se déconnecter</button>;
}
