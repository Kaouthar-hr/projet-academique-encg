import React, { useState, useEffect } from 'react';
import api from '../api';

const ModuleManagement = () => {
  // États pour la gestion des données
  const [modules, setModules] = useState([]);
  const [module, setModule] = useState({
    id: '',
    intitule: '',
    coefficient: '',
    volume_horaire: '',
    semestre: 'S1'
  });
  const [selectedSemestre, setSelectedSemestre] = useState('Tous');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Charger les modules au montage du composant
  useEffect(() => {
    fetchModules();
  }, []);

  // Récupérer les modules avec filtrage optionnel
  const fetchModules = async (semestre = null) => {
    setIsLoading(true);
    try {
      let url = '/modules';
      if (semestre && semestre !== 'Tous') {
        url += `?semestre=${semestre}`;
      }
      const response = await api.get(url);
      setModules(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Erreur lors du chargement des modules');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer les changements dans les inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModule(prev => ({ ...prev, [name]: value }));
  };

  // Gérer le changement de semestre
  const handleSemestreChange = (e) => {
    const semestre = e.target.value;
    setSelectedSemestre(semestre);
    fetchModules(semestre);
  };

  // Soumettre le formulaire (ajout ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing) {
        await api.put(`/modules/${module.id}`, module);
        setMessage('Module mis à jour avec succès');
      } else {
        await api.post('/modules', module);
        setMessage('Module ajouté avec succès');
      }
      
      resetForm();
      fetchModules(selectedSemestre !== 'Tous' ? selectedSemestre : null);
    } catch (error) {
      setMessage(`Erreur: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Pré-remplir le formulaire pour modification
  const editModule = (moduleToEdit) => {
    setModule(moduleToEdit);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Supprimer un module
  const deleteModule = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
      setIsLoading(true);
      try {
        await api.delete(`/modules/${id}`);
        setMessage('Module supprimé avec succès');
        fetchModules(selectedSemestre !== 'Tous' ? selectedSemestre : null);
      } catch (error) {
        setMessage('Erreur lors de la suppression du module');
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setModule({
      id: '',
      intitule: '',
      coefficient: '',
      volume_horaire: '',
      semestre: 'S1'
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Gestion des Modules</h2>
      
      {/* Messages d'état */}
      {message && (
        <div className={`alert ${message.includes('succès') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      <div className="card mb-4">
        <div className="card-header">
          <h3>{isEditing ? 'Modifier un Module' : 'Ajouter un Nouveau Module'}</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Intitulé</label>
                <input
                  type="text"
                  className="form-control"
                  name="intitule"
                  value={module.intitule}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Coefficient</label>
                <input
                  type="number"
                  className="form-control"
                  name="coefficient"
                  value={module.coefficient}
                  onChange={handleInputChange}
                  required
                  step="0.1"
                  min="0.1"
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Volume Horaire</label>
                <input
                  type="number"
                  className="form-control"
                  name="volume_horaire"
                  value={module.volume_horaire}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Semestre</label>
                <select
                  className="form-select"
                  name="semestre"
                  value={module.semestre}
                  onChange={handleInputChange}
                  required
                >
                  {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 d-flex align-items-end mb-3">
                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'En cours...' : (isEditing ? 'Mettre à jour' : 'Ajouter')}
                  </button>
                  {isEditing && (
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary" 
                      onClick={resetForm}
                      disabled={isLoading}
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Filtre et liste des modules */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Liste des Modules</h3>
          <div className="d-flex align-items-center">
            <label className="me-2 mb-0">Filtrer par semestre :</label>
            <select
              className="form-select w-auto"
              value={selectedSemestre}
              onChange={handleSemestreChange}
              disabled={isLoading}
            >
              <option value="Tous">Tous les semestres</option>
              {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : modules.length === 0 ? (
            <div className="alert alert-info">Aucun module trouvé</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Intitulé</th>
                    <th>Coefficient</th>
                    <th>Volume Horaire</th>
                    <th>Semestre</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map(mod => (
                    <tr key={mod.id}>
                      <td>{mod.intitule}</td>
                      <td>{mod.coefficient}</td>
                      <td>{mod.volume_horaire}h</td>
                      <td>{mod.semestre}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            onClick={() => editModule(mod)}
                            className="btn btn-sm btn-outline-primary"
                            disabled={isLoading}
                          >
                            <i className="bi bi-pencil"></i> Modifier
                          </button>
                          <button
                            onClick={() => deleteModule(mod.id)}
                            className="btn btn-sm btn-outline-danger"
                            disabled={isLoading}
                          >
                            <i className="bi bi-trash"></i> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleManagement;