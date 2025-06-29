import React, { useState, useEffect } from 'react';
import api from '../api';

const UploadAdmis = () => {
  const [file, setFile] = useState(null);
  const [previewCNEs, setPreviewCNEs] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur connecté est admin
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setIsAdmin(user.role === 'admin');
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage('');
    setError('');

    // Lecture locale pour aperçu
    if (selectedFile && selectedFile.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const lines = event.target.result.split('\n').slice(0, 10);
        const cnes = lines.map(line => line.trim()).filter(cne => cne !== '');
        setPreviewCNEs(cnes);
      };
      reader.readAsText(selectedFile);
    } else {
      setPreviewCNEs([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un fichier .csv.");
      return;
    }
  
    setIsLoading(true);
    setError('');
    setMessage('');
    
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const token = localStorage.getItem("token");
      const response = await api.post('/admin/upload-admis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      setMessage(`${response.data.message} (${response.data.count || ''} CNEs importés)`);
      setFile(null);
      setPreviewCNEs([]);
      e.target.reset();
    } catch (err) {
      const errMsg = err.response?.data?.error || 
                    err.response?.data?.message || 
                    'Erreur lors de l\'importation';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };
  

  if (!isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          {error || "Accès non autorisé. Seuls les administrateurs peuvent importer des fichiers."}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <h4 className="mb-4 text-primary text-center">Importer la liste des CNE admis</h4>

        {message && (
          <div className="alert alert-success">
            <i className="bi bi-check-circle me-2"></i>
            {message}
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="csvFile" className="form-label">
              Fichier CSV des CNE
            </label>
            <input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="form-control"
              required
              disabled={isLoading}
            />
            <div className="form-text">
              Format attendu : fichier <strong>.csv</strong> avec un CNE par ligne.
              <br />
              
            </div>
          </div>

          {previewCNEs.length > 0 && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Aperçu des 10 premiers CNE :</label>
              <ul className="list-group small">
                {previewCNEs.map((cne, index) => (
                  <li key={index} className="list-group-item font-monospace">{cne}</li>
                ))}
              </ul>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-100 mt-3"
            disabled={isLoading || !file}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Import en cours...
              </>
            ) : (
              <>
                <i className="bi bi-upload me-2"></i>
                Importer
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadAdmis;