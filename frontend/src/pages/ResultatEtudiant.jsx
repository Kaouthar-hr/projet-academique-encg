import React, { useEffect, useState } from 'react';
import api from '../api';

function MesNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    api.get('/mes-notes', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
      },
    })
    .then(response => {
      setNotes(response.data);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des notes:', error);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mes Notes</h1>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr>
            <th className="py-2">Module</th>
            <th className="py-2">Valeur</th>
            <th className="py-2">Type</th>
            <th className="py-2">Semestre</th>
            <th className="py-2">Date Évaluation</th>
          </tr>
        </thead>
        <tbody>
          {notes.map(note => (
            <tr key={note.id}>
              <td className="py-2">{note.module?.intitule}</td>
              <td className="py-2">{note.valeur}</td>
              <td className="py-2">{note.type}</td>
              <td className="py-2">{note.semestre}</td>
              <td className="py-2">{new Date(note.date_evaluation).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MesNotes;
