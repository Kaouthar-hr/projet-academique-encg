import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminInscriptions = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [selectedInscription, setSelectedInscription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchInscriptions();
  }, []);

  const fetchInscriptions = async () => {
    try {
      const response = await api.get('/admin/inscriptions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setInscriptions(response.data);
    } catch (error) {
      console.error('Erreur de récupération des inscriptions:', error);
    }
  };

  const updateStatut = async (id, statut) => {
    try {
      await api.patch(`/inscriptions/${id}/statut`, { statut }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchInscriptions(); // Refresh list
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
    }
  };

  const viewDetails = (inscription) => {
    setSelectedInscription(inscription);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInscription(null);
  };


  return (
    <div className="p-4">
      <h2 className="h4 fw-bold mb-4">Liste des Inscriptions</h2>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Niveau</th>
            <th>Filière</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inscriptions.map((ins) => (
            <tr key={ins.id}>
              <td>{ins.user?.name}</td>
              <td>{ins.type}</td>
              <td>{ins.niveau}</td>
              <td>{ins.filiere?.nom || 'N/A'}</td>
              <td>{ins.statut}</td>
              <td>
                <button
                  onClick={() => viewDetails(ins)}
                  className="btn btn-primary btn-sm me-2"
                >
                  Voir détails
                </button>
                {ins.statut === 'en attente' && (
                  <>
                    <button
                      onClick={() => updateStatut(ins.id, 'validée')}
                      className="btn btn-success btn-sm me-2"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => updateStatut(ins.id, 'refusée')}
                      className="btn btn-danger btn-sm"
                    >
                      Refuser
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal pour afficher les détails */}
      {/* Modal pour afficher les détails */}
{showModal && selectedInscription && (
  <div className="modal show" style={{ display: 'block', background: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Détails de l'inscription</h5>
          <button
            type="button"
            className="btn-close"
            onClick={closeModal}
          ></button>
        </div>
        <div className="modal-body">
          {/* Section 1: Type et année universitaire */}
          <div className="card mb-3">
            <div className="card-header fw-bold">Type et Année Universitaire</div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Type</label>
                  <p>{selectedInscription.type}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Année Universitaire</label>
                  <p>{selectedInscription.annee_universitaire}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Informations personnelles */}
          <div className="card mb-3">
            <div className="card-header fw-bold">Informations Personnelles</div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label fw-bold">CIN</label>
                  <p>{selectedInscription.cin}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">CNE</label>
                  <p>{selectedInscription.cne}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nom (Français)</label>
                  <p>{selectedInscription.nom_fr}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Prénom (Français)</label>
                  <p>{selectedInscription.prenom_fr}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nom (Arabe)</label>
                  <p dir="rtl">{selectedInscription.nom_ar}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Prénom (Arabe)</label>
                  <p dir="rtl">{selectedInscription.prenom_ar}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Date de naissance</label>
                  <p>{selectedInscription.dateNaissance}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Lieu de naissance</label>
                  <p>{selectedInscription.lieuNaissance_fr}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Sexe</label>
                  <p>{selectedInscription.sexe}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nationalité</label>
                  <p>{selectedInscription.nationaliter}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Situation familiale</label>
                  <p>{selectedInscription.situation_familiale}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Adresse</label>
                  <p>{selectedInscription.adresse}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Informations géographiques */}
          <div className="card mb-3">
            <div className="card-header fw-bold">Informations Géographiques</div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Province</label>
                  <p>{selectedInscription.province_name}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Ville</label>
                  <p>{selectedInscription.ville_libelle_stud}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Pays</label>
                  <p>{selectedInscription.paye_libelle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Informations parents */}
          <div className="card mb-3">
            <div className="card-header fw-bold">Informations Parents</div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-medium">Père</h6>
                  <div className="mb-2">
                    <label className="form-label fw-bold">CIN</label>
                    <p>{selectedInscription.cinpere}</p>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Nom Père</label>
                    <p>{selectedInscription.nompere} {selectedInscription.prenomPere}</p>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Profession</label>
                    <p>{selectedInscription.professionpere}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-medium">Mère</h6>
                  <div className="mb-2">
                    <label className="form-label fw-bold">CIN</label>
                    <p>{selectedInscription.cin_mere}</p>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Nom Mère</label>
                    <p>{selectedInscription.nom_mere} {selectedInscription.prenomMere}</p>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Profession</label>
                    <p>{selectedInscription.professionmere}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Adresse Parents</label>
                  <p>{selectedInscription.adresseparent}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Téléphone Parents</label>
                  <p>{selectedInscription.telparent}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Informations académiques */}
<div className="card mb-3">
  <div className="card-header fw-bold">Informations Académiques</div>
  <div className="card-body">
    <div className="row">
      {/* Niveau */}
      <div className="col-md-6">
        <label className="form-label fw-bold">Niveau</label>
        <p>{selectedInscription.niveau}</p>
      </div>
      {/* Filière */}
      <div className="col-md-6">
        <label className="form-label fw-bold">Filière</label>
        <p>{selectedInscription.filiere?.nom || 'N/A'}</p>
      </div>

      {/* Baccalauréat */}
      <div className="col-md-6">
        <h6 className="fw-medium mt-3">Baccalauréat</h6>
        <div className="mb-2">
          <label className="form-label fw-bold">Mention</label>
          <p>{selectedInscription.mention_bac}</p>
        </div>
        <div className="mb-2">
          <label className="form-label fw-bold">Année</label>
          <p>{selectedInscription.annee_bac}</p>
        </div>
        <div className="mb-2">
          <label className="form-label fw-bold">Lycée</label>
          <p>{selectedInscription.lycee}</p>
        </div>
      </div>

      {/* Province (Bac) */}
      <div className="col-md-6">
        <label className="form-label fw-bold">Province (Bac)</label>
        <p>{selectedInscription.province_name}</p>
      </div>

      {/* Université précédente */}
      <div className="col-md-6">
        <label className="form-label fw-bold">Université précédente</label>
        <p>{selectedInscription.universite}</p>
      </div>

      {/* Année première inscription */}
      <div className="col-md-6">
        <label className="form-label fw-bold">Année première inscription</label>
        <p>{selectedInscription.anneePremiereInscens}</p>
      </div>

      {/* Lieu d'inscription précédent */}
      <div className="col-md-6">
        <label className="form-label fw-bold">Lieu d'inscription précédent</label>
        <p>{selectedInscription.lnscens}</p>
      </div>
    </div>
  </div>
</div>

          {/* Section Documents */}
          <div className="card mb-3">
            <div className="card-header fw-bold">Documents</div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Document Bac</label>
                  {selectedInscription.bac_document_url ? (
                    <a
                      href={selectedInscription.bac_document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-decoration-none"
                    >
                      Télécharger le BAC
                    </a>
                  ) : (
                    <p className="text-muted">Aucun document fourni</p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Photo Étudiant</label>
                  {selectedInscription.photo_url ? (
                    <a
                      href={selectedInscription.photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-decoration-none"
                    >
                      Télécharger la Photo
                    </a>
                  ) : (
                    <p className="text-muted">Aucune photo</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          {selectedInscription.statut === 'en attente' && (
            <>
              <button
                onClick={() => {
                  updateStatut(selectedInscription.id, 'validée');
                  closeModal();
                }}
                className="btn btn-success"
              >
                Valider
              </button>
              <button
                onClick={() => {
                  updateStatut(selectedInscription.id, 'refusée');
                  closeModal();
                }}
                className="btn btn-danger"
              >
                Refuser
              </button>
            </>
          )}
          <button
            onClick={closeModal}
            className="btn btn-secondary"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
)}
</div>
  );
};

export default AdminInscriptions;