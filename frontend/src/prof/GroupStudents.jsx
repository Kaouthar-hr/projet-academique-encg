import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function GroupStudents() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // Récupérer les détails du groupe
        const groupResponse = await api.get(`/prof/groups/${groupId}`);
        
        // Récupérer les étudiants du groupe
        const studentsResponse = await api.get(`/prof/groups/${groupId}/students`);

        setGroup(groupResponse.data);
        setStudents(studentsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleAddAbsence = async (studentId) => {
    try {
      await api.post('/prof/absences', {
        user_id: studentId,
        group_id: groupId,
        date: new Date().toISOString().split('T')[0],
        justified: false
      });
      
      // Rafraîchir les données
      const response = await api.get(`/prof/groups/${groupId}/students`);
      setStudents(response.data);
      
      toast.success('Absence enregistrée');
    } catch (err) {
      toast.error("Erreur lors de l'ajout");
      console.error(err);
    }
  };
  
  const handleJustifyAll = async (studentId) => {
    try {
      await api.put(`/prof/absences/${studentId}/justify`, { group_id: groupId });
      
      // Rafraîchir les données
      const response = await api.get(`/prof/groups/${groupId}/students`);
      setStudents(response.data);
      
      toast.success('Absences justifiées');
    } catch (err) {
      toast.error("Erreur lors de la justification");
      console.error(err);
    }
  };
  if (loading) return <div className="text-center my-5">Chargement en cours...</div>;
  if (error) return <div className="alert alert-danger">Erreur: {error}</div>;

  return (
    <div className="container mt-4">
      <Link to="/prof/groups" className="btn btn-secondary mb-3">
        ← Retour à la liste
      </Link>

      <h2 className="mb-4">Détails du groupe: {group?.name}</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Informations</h5>
          <p><strong>Niveau:</strong> {group?.niveau}</p>
          <p><strong>Nombre d'étudiants:</strong> {students.length}</p>
        </div>
      </div>

      <h4 className="mb-3">Liste des étudiants</h4>
      
      {students.length === 0 ? (
        <div className="alert alert-info">Aucun étudiant dans ce groupe</div>
      ) : (
        <table className="table table-striped">
  <thead>
    <tr>
      <th>Nom</th>
      <th>Email</th>
      <th>Total Absences</th>
      <th>Dernières Absences</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {students.map(student => (
      <tr key={student.id}>
        <td>{student.name}</td>
        <td>{student.email}</td>
        <td>
          <span className={student.total_absences > 0 ? "text-danger fw-bold" : ""}>
            {student.total_absences}
          </span>
        </td>
        <td>
          {student.absences.length > 0 ? (
            <ul className="list-unstyled">
              {student.absences.map(absence => (
                <li key={absence.id} className={absence.justified ? "text-muted" : "text-danger"}>
                  {new Date(absence.date).toLocaleDateString()} 
                  {absence.justified && " (Justifiée)"}
                </li>
              ))}
            </ul>
          ) : 'Aucune'}
        </td>
        <td>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleAddAbsence(student.id)}
            >
              <i className="bi bi-plus-circle"></i> Ajouter
            </button>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => handleJustifyAll(student.id)}
              disabled={student.total_absences === 0}
            >
              <i className="bi bi-check-circle"></i> Justifier
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      )}
    </div>
  );
}

export default GroupStudents;