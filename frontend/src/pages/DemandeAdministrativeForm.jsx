import React, { useState } from 'react';
import api from '../api';

const DemandeAdministrativeForm = () => {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // Récupération du token Passport 

      const response = await api.post('/demandes', { type, message });

      setFeedback('Demande envoyée avec succès !');
      setType('');
      setMessage('');
    } catch (error) {
      setFeedback('❌ Une erreur est survenue.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4 text-primary">Faire une demande administrative</h2>
              <form onSubmit={handleSubmit}>
                {/* Type de demande */}
                <div className="mb-3">
                  <label htmlFor="type" className="form-label fw-bold">
                    Type de demande :
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    className="form-select"
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="certificat_scolarite">Certificat de scolarité</option>
                    <option value="attestation_inscription">Attestation d'inscription</option>
                  </select>
                </div>

                {/* Message optionnel */}
                <div className="mb-3">
                  <label htmlFor="message" className="form-label fw-bold">
                    Message (optionnel) :
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-control"
                    rows="4"
                    placeholder="Ajoutez un message si nécessaire"
                  />
                </div>

                {/* Bouton d'envoi */}
                <div className="d-grid">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer'
                    )}
                  </button>
                </div>

                {/* Feedback */}
                {feedback && (
                  <div className="mt-3 alert alert-info text-center" role="alert">
                    {feedback}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandeAdministrativeForm;