import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminNotes() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState({
    valeur: '',
    type: '',
    semestre: '',
    date_evaluation: '',
  });

  // Charger toutes les notes
  const fetchNotes = () => {
    axios.get('http://localhost:8000/api/admin/notes', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // تأكد التوكن موجود
      },
    })
    .then(response => {
      setNotes(response.data);
    })
    .catch(error => {
      console.error('Erreur lors du chargement des notes:', error);
    });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      axios.delete(`http://localhost:8000/api/admin/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      .then(() => {
        fetchNotes(); // Reload notes
      })
      .catch(error => {
        console.error('Erreur lors de la suppression:', error);
      });
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setForm({
      valeur: note.valeur,
      type: note.type,
      semestre: note.semestre,
      date_evaluation: note.date_evaluation.split('T')[0], // YYYY-MM-DD
    });
  };

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8000/api/admin/notes/${editingNote.id}`, form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then(() => {
      setEditingNote(null);
      fetchNotes();
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour:', error);
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Notes (Admin)</h1>

      {/* Table des Notes */}
      <table className="min-w-full bg-white shadow-md rounded mb-6">
        <thead>
          <tr>
            <th className="py-2">Étudiant</th>
            <th className="py-2">Module</th>
            <th className="py-2">Valeur</th>
            <th className="py-2">Type</th>
            <th className="py-2">Semestre</th>
            <th className="py-2">Date Évaluation</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map(note => (
            <tr key={note.id}>
              <td className="py-2">{note.user?.name}</td>
              <td className="py-2">{note.module?.nom_module}</td>
              <td className="py-2">{note.valeur}</td>
              <td className="py-2">{note.type}</td>
              <td className="py-2">{note.semestre}</td>
              <td className="py-2">{new Date(note.date_evaluation).toLocaleDateString()}</td>
              <td className="py-2 space-x-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulaire de Modification */}
      {editingNote && (
        <div className="bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Modifier la Note</h2>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
            <input type="text" name="valeur" value={form.valeur} onChange={handleChange} className="p-2 border" />
            <input type="text" name="type" value={form.type} onChange={handleChange} className="p-2 border" />
            <input type="text" name="semestre" value={form.semestre} onChange={handleChange} className="p-2 border" />
            <input type="date" name="date_evaluation" value={form.date_evaluation} onChange={handleChange} className="p-2 border" />
            <div className="space-x-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setEditingNote(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminNotes;
