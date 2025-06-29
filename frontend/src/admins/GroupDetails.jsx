import React, { useState } from 'react';
import axios from 'axios';

const GroupDetails = () => {
  const [groupId, setGroupId] = useState('');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetGroupDetails = async () => {
    if (!groupId) {
      setError('Veuillez entrer un ID de groupe.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Récupérer les étudiants et enseignants pour le groupe
      const studentsResponse = await axios.get(`/api/groups/${groupId}/etudiants`);
      const teachersResponse = await axios.get(`/api/groups/${groupId}/enseignants`);

      setStudents(studentsResponse.data);
      setTeachers(teachersResponse.data);
    } catch (err) {
      setError('Une erreur est survenue lors de la récupération des données.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Détails du Groupe</h2>
      
      {/* Formulaire pour entrer l'ID du groupe */}
      <div>
        <input
          type="number"
          placeholder="Entrez l'ID du groupe"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
        <button onClick={handleGetGroupDetails}>Obtenir les Détails</button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {loading && <div>Chargement...</div>}

      {/* Affichage des étudiants */}
      <div>
        <h3>Étudiants du groupe</h3>
        <ul>
          {students.length > 0 ? (
            students.map((student) => (
              <li key={student.id}>{student.name} - {student.email}</li>
            ))
          ) : (
            <li>Aucun étudiant trouvé pour ce groupe.</li>
          )}
        </ul>
      </div>

      {/* Affichage des enseignants */}
      <div>
        <h3>Enseignants du groupe</h3>
        <ul>
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <li key={teacher.id}>{teacher.name} - {teacher.email}</li>
            ))
          ) : (
            <li>Aucun enseignant trouvé pour ce groupe.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroupDetails;
