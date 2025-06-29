import React, { useState } from 'react';
import api from '../api';

function AjouterNote() {
  const [form, setForm] = useState({
    id_user: '',
    id_module: '',
    valeur: '',
    type: '',
    
    date_evaluation: '',
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/enseignant/ajouter-note', form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then(response => {
      alert('Note ajoutée avec succès!');
    })
    .catch(error => {
      console.error('Erreur:', error.response?.data);
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Ajouter une Note</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input type="text" name="id_user" placeholder="ID étudiant" value={form.id_user} onChange={handleChange} className="p-2 border" />
        <input type="text" name="id_module" placeholder="ID module" value={form.id_module} onChange={handleChange} className="p-2 border" />
        <input type="text" name="valeur" placeholder="Valeur" value={form.valeur} onChange={handleChange} className="p-2 border" />
        <input type="text" name="type" placeholder="Type (ex: Examen, TP)" value={form.type} onChange={handleChange} className="p-2 border" />
        
        <input type="date" name="date_evaluation" value={form.date_evaluation} onChange={handleChange} className="p-2 border" />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Ajouter</button>
      </form>
    </div>
  );
}

export default AjouterNote;
