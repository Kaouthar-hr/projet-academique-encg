import React, { useEffect, useState } from 'react';
import api from '../api';

const MesDemandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Vérifiez si le token existe avant de faire la requête
        if (!token) {
          setError('Token manquant');
          setLoading(false);
          return;
        }

        const response = await api.get('/mes-demandes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Vérifiez si la réponse est un tableau valide
        if (Array.isArray(response.data)) {
          setDemandes(response.data);
        } else {
          setError('Les données des demandes ne sont pas valides');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes :', error);
        setError('Une erreur est survenue lors de la récupération des demandes');
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'validee':
        return 'badge bg-success';
      case 'refusee':
        return 'badge bg-danger';
      default:
        return 'badge bg-warning text-dark';
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4 text-primary">Mes demandes administratives</h2>

              {loading ? (
                <p className="text-center text-muted">Chargement des données...</p>
              ) : error ? (
                <p className="text-center text-danger">{error}</p> // Affiche l'erreur si elle existe
              ) : demandes.length === 0 ? (
                <p className="text-center text-muted">Vous n'avez encore fait aucune demande.</p>
              ) : (
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Type</th>
                      <th scope="col">Message</th>
                      <th scope="col">Statut</th>
                      <th scope="col">Commentaire admin</th>
                      <th scope="col">Document</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demandes.map((d) => (
                      <tr key={d.id}>
                        <td className="text-capitalize">{d.type.replace('_', ' ')}</td>
                        <td>{d.message || '-'}</td>
                        <td>
                          <span className={getStatutBadge(d.status)}>{d.status}</span>
                        </td>
                        <td>{d.admin_comment || '-'}</td>
                        <td>
                          {d.document_path ? (
                            <a
                              href={`http://localhost:8000/storage/${d.document_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              Télécharger
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesDemandes;
