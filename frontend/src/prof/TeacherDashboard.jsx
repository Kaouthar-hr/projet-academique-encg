import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

function TeacherDashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/prof/groups', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('API Response:', response); // Debug

        // Vérification approfondie des données
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Format de données invalide');
        }

        setGroups(response.data);
        
      } catch (err) {
        console.error('Erreur complète:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return <div className="text-center my-5">Chargement en cours...</div>;
  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger">
        Erreur: {error}
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-sm btn-warning ms-3"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mes Groupes</h2>
      
      {groups.length === 0 ? (
        <div className="alert alert-info">
          Vous n'êtes actuellement assigné à aucun groupe.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {groups.map(group => (
            <div key={group.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{group.name}</h5>
                  <p className="card-text">
                    <strong>Niveau:</strong> {group.niveau}<br />
                    <strong>Étudiants:</strong> {group.students_count || 0}
                  </p>
                  <Link
  to={`/prof/groups/${group.id}`}
  className="btn btn-primary"
>
  Voir détails
</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;