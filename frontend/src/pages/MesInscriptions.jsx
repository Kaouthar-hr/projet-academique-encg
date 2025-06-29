import React, { useEffect, useState } from 'react';
import api from '../api';

const MesInscriptions = () => {
  const [inscriptions, setInscriptions] = useState([]);

  useEffect(() => {
    const fetchInscriptions = async () => {
      try {
        const response = await api.get('/inscriptions');
        setInscriptions(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des inscriptions', error);
      }
    };

    fetchInscriptions();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Mes inscriptions</h2>
      {inscriptions.length === 0 ? (
        <p>Aucune inscription trouvée.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Type</th>
              <th>Année universitaire</th>
              <th>Niveau</th>
              <th>Filière</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {inscriptions.map((inscription) => (
              <tr key={inscription.id}>
                <td>{inscription.type}</td>
                <td>{inscription.annee_universitaire}</td>
                <td>{inscription.niveau}</td>
                <td>{inscription.filiere ? inscription.filiere.nom : '-'}</td>
                <td>
                  <span
                    className={`badge ${
                      inscription.statut === 'validée'
                        ? 'bg-success'
                        : inscription.statut === 'refusée'
                        ? 'bg-danger'
                        : 'bg-warning text-dark'
                    }`}
                  >
                    {inscription.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MesInscriptions;
