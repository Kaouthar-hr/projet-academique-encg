import React, { useEffect, useState } from 'react';
import api from '../api';

const GestionDemandesAdmin = () => {
  const [demandes, setDemandes] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [status, setStatus] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [document, setDocument] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const response = await api.get('/demandes');
      setDemandes(response.data);
    } catch (error) {
      console.error('Erreur récupération des demandes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('status', status);
    formData.append('admin_comment', commentaire);
    if (document) {
      formData.append('document', document);
    }

    try {
      await api.post(`/demandes/${selectedDemande.id}?_method=PUT`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setFeedback('✅ Demande mise à jour avec succès.');
      fetchDemandes();
      setSelectedDemande(null);
      setStatus('');
      setCommentaire('');
      setDocument(null);
    } catch (error) {
      console.error(error);
      setFeedback('❌ Erreur lors de la mise à jour.');
    }
  };

  const getBadgeClass = (status) => {
    switch(status) {
      case 'en_attente':
        return 'badge bg-warning text-dark';
      case 'validee':
        return 'badge bg-success';
      case 'refusee':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  const formatType = (type) => {
    return type.replace(/_/g, ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container py-4">
      <div className="card border-0 shadow">
        <div className="card-header bg-primary text-white py-3">
          <h4 className="mb-0">
            <i className="bi bi-clipboard-check me-2"></i>
            Gestion des demandes administratives
          </h4>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : demandes.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              Aucune demande pour l'instant.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Étudiant</th>
                    <th scope="col">Type</th>
                    <th scope="col">Statut</th>
                    <th scope="col">Message</th>
                    <th scope="col" className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {demandes.map((d) => (
                    <tr key={d.id}>
                      <td>{d.user?.name || 'Non défini'}</td>
                      <td>{formatType(d.type)}</td>
                      <td>
                        <span className={getBadgeClass(d.status)}>
                          {d.status === 'en_attente' ? 'En attente' : 
                           d.status === 'validee' ? 'Validée' : 
                           d.status === 'refusee' ? 'Refusée' : d.status}
                        </span>
                      </td>
                      <td>{d.message || '-'}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedDemande(d)}
                        >
                          <i className="bi bi-pencil-square me-1"></i>
                          Traiter
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedDemande && (
            <div className="mt-4 pt-4 border-top">
              <div className="card border-primary">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-pencil me-2"></i>
                    Traitement de la demande #{selectedDemande.id}
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label fw-bold">Statut :</label>
                      <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        className="form-select"
                      >
                        <option value="">-- Choisir --</option>
                        <option value="validee">Validée</option>
                        <option value="refusee">Refusée</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="commentaire" className="form-label fw-bold">Commentaire :</label>
                      <textarea
                        id="commentaire"
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                        className="form-control"
                        rows="4"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="document" className="form-label fw-bold">Document à joindre (PDF ou image) :</label>
                      <input
                        type="file"
                        id="document"
                        onChange={(e) => setDocument(e.target.files[0])}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="form-control"
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setSelectedDemande(null)}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        <i className="bi bi-check-circle me-1"></i>
                        Enregistrer
                      </button>
                    </div>
                  </form>

                  {feedback && (
                    <div className={`alert mt-3 ${feedback.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                      {feedback}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionDemandesAdmin;