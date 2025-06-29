import React, { useState, useEffect } from 'react';
import api from '../api';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]); 
  const [filiereFilter, setFiliereFilter] = useState('');
  const [filieres, setFilieres] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ 
    name: '', 
    niveau: '',
    academic_year_id: '',
    filiere_id: '' ,
  });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    role: 'etudiant'
  });
  const [loading, setLoading] = useState({
    groups: false,
    users: false,
    members: false,
    addUser: false,
    createGroup: false,
    removeUser: false,
    filieres: false
  });
  const [error, setError] = useState(null);

  // Charger les groupes
  const fetchGroups = async () => {
    setLoading(prev => ({ ...prev, groups: true }));
    try {
      const res = await api.get('/groups');
      setGroups(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des groupes');
      console.error('Erreur:', err);
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  };

  // Charger les filières
  const fetchFilieres = async () => {
    setLoading(prev => ({ ...prev, filieres: true }));
    setError(null);
    
    try {
      const res = await api.get('/filieres');
      if (res.data && Array.isArray(res.data)) {
        setFilieres(res.data);
      } else {
        console.error('Format de données inattendu:', res.data);
        setError('Format de données incorrect pour les filières');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Erreur inconnue lors du chargement des filières';
      console.error('Erreur:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, filieres: false }));
    }
  };

  // Charger les utilisateurs
  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Erreur:', err.response?.data?.message || err.message);
      setError('Impossible de charger les utilisateurs');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Créer un nouveau groupe
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, createGroup: true }));
    setError(null);
    setSuccessMessage(null);
  
    try {
      const res = await api.post('/groups', newGroup);
      
      setGroups(prevGroups => [...prevGroups, res.data.group]);
      setSuccessMessage('Groupe créé avec succès !');
      setCreateGroupModal(false);
      setNewGroup({ 
        name: '', 
        niveau: '',
        academic_year_id: '',
        filiere_id: '' 
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(prev => ({ ...prev, createGroup: false }));
    }
  };

  // Charger les membres d'un groupe
  const loadGroupMembers = async (groupId) => {
    if (!groupId) return;
    
    setLoading(prev => ({ ...prev, members: true }));
    setError(null);
    
    try {
      const res = await api.get(`/groups/${groupId}/members`);
      setGroupMembers(res.data.members || []);
      
      // Mettre à jour le groupe sélectionné avec les dernières données
      setSelectedGroup(groups.find(g => g.id === groupId) || null);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement des membres');
    } finally {
      setLoading(prev => ({ ...prev, members: false }));
    }
  };

  // Ajouter un utilisateur à un groupe
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!selectedGroup) return;

    setLoading(prev => ({ ...prev, addUser: true }));
    try {
      await api.post(`/groups/${selectedGroup.id}/members`, formData);
      await loadGroupMembers(selectedGroup.id);
      
      setModalVisible(false);
      setFormData({ user_id: '', role: 'etudiant' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally {
      setLoading(prev => ({ ...prev, addUser: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGroupInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer cet utilisateur ?')) return;
    
    setLoading(prev => ({ ...prev, removeUser: true }));
    setError(null);
    try {
      await api.delete(`/groups/${selectedGroup.id}/members`, {
        data: { user_id: userId }
      });
      await loadGroupMembers(selectedGroup.id);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(prev => ({ ...prev, removeUser: false }));
    }
  };

  // Filtrer les groupes par filière
  const filteredGroups = filiereFilter 
    ? groups.filter(group => group.filiere_id.toString() === filiereFilter.toString())
    : groups;

  // Charger les données initiales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchGroups(),
          fetchUsers(),
          fetchFilieres()
        ]);
      } catch (err) {
        console.error('Erreur lors du chargement initial:', err);
        setError('Erreur lors du chargement des données initiales');
      }
    };
  
    loadInitialData();
  }, []);

  // Styles
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
    },
    groupList: {
      flex: 1,
      padding: '20px',
      borderRight: '1px solid #ddd',
      backgroundColor: 'white',
      overflowY: 'auto',
    },
    groupDetails: {
      flex: 2,
      padding: '20px',
      backgroundColor: 'white',
      overflowY: 'auto',
    },
    sectionTitle: {
      color: '#333',
      marginBottom: '20px',
    },
    groupItem: {
      padding: '15px',
      marginBottom: '10px',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      '&:hover': {
        backgroundColor: '#eee',
      },
    },
    activeGroup: {
      backgroundColor: '#e3f2fd',
      borderLeft: '4px solid #2196f3',
    },
    groupName: {
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    groupInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.9em',
      color: '#666',
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginLeft: '10px',
    },
    addButton: {
      padding: '8px 16px',
      backgroundColor: '#2196F3',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '20px',
    },
    removeButton: {
      padding: '5px 10px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '5px',
      width: '500px',
      maxWidth: '90%',
    },
    modalTitle: {
      marginTop: 0,
      color: '#333',
    },
    formGroup: {
      marginBottom: '15px',
    },
    formLabel: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    formInput: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    formSelect: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    formActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '20px',
    },
    submitButton: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginLeft: '10px',
    },
    cancelButton: {
      padding: '8px 16px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    tableHeader: {
      backgroundColor: '#f2f2f2',
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
    },
    tableRow: {
      borderBottom: '1px solid #ddd',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    },
    tableCell: {
      padding: '12px',
    },
    noDataMessage: {
      color: '#666',
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: '20px',
    },
    placeholder: {
      color: '#666',
      fontStyle: 'italic',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '5px',
      width: '80%',
    },
    errorMessage: {
      color: '#f44336',
      backgroundColor: '#ffebee',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px',
    },
    successMessage: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '15px',
      borderRadius: '4px',
      zIndex: 1000,
    },
    loadingText: {
      marginLeft: '10px',
      color: '#666',
      fontSize: '0.9em',
    },
    filterContainer: {
      marginBottom: '20px',
    },
    refreshButton: {
      padding: '8px 16px',
      backgroundColor: '#607d8b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '20px',
    },
    groupHeader: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Colonne de gauche - Liste des groupes */}
      <div style={styles.groupList}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={styles.sectionTitle}>Liste des Groupes</h2>
          <button 
            style={styles.button}
            onClick={() => setCreateGroupModal(true)}
            disabled={loading.createGroup}
          >
            Créer un groupe
          </button>
        </div>

        <div style={styles.filterContainer}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Filtrer par filière</label>
            <select 
              value={filiereFilter} 
              onChange={e => setFiliereFilter(e.target.value)} 
              style={styles.formSelect}
              disabled={loading.filieres}
            >
              <option value="">Toutes les filières</option>
              {filieres.map(f => (
                <option key={f.id} value={f.id}>{f.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          style={styles.refreshButton}
          onClick={fetchGroups}
          disabled={loading.groups}
        >
          {loading.groups ? 'Actualisation...' : 'Actualiser la liste'}
        </button>
        
        <div>
          {loading.groups ? (
            <p style={styles.noDataMessage}>Chargement des groupes...</p>
          ) : filteredGroups.length > 0 ? (
            filteredGroups.map(group => (
              <div
                key={group.id}
                onClick={() => {
                  setSelectedGroup(group);
                  loadGroupMembers(group.id);
                }}
                style={{
                  ...styles.groupItem,
                  ...(selectedGroup?.id === group.id && styles.activeGroup)
                }}
              >
                <div style={styles.groupName}>{group.name}</div>
                <div style={styles.groupInfo}>
                  <div>Année: {group.academic_year_id}</div>
                  <div>Niveau: {group.niveau}</div>
                  <div>Filière: {filieres.find(f => f.id === group.filiere_id)?.nom || 'Non spécifiée'}</div>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noDataMessage}>
              {filiereFilter ? 'Aucun groupe dans cette filière' : 'Aucun groupe disponible'}
            </p>
          )}
        </div>
      </div>

      {/* Colonne de droite - Détails du groupe */}
      <div style={styles.groupDetails}>
        {loading.members ? (
          <div style={styles.placeholder}>Chargement des membres...</div>
        ) : selectedGroup ? (
          <>
            <div style={styles.groupHeader}>
              <h2 style={styles.sectionTitle}>
                Membres du groupe: {selectedGroup.name}
              </h2>
              <button
                style={styles.addButton}
                onClick={() => setModalVisible(true)}
                disabled={loading.addUser}
              >
                Ajouter un membre
              </button>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            {groupMembers.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Nom</th>
                    <th style={styles.tableHeader}>Email</th>
                    <th style={styles.tableHeader}>Rôle</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupMembers.map(member => (
                    <tr key={member.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>{member.name}</td>
                      <td style={styles.tableCell}>{member.email}</td>
                      <td style={styles.tableCell}>
                        {member.pivot?.role === 'enseignant' ? 'Enseignant' : 'Étudiant'}
                      </td>
                      <td style={styles.tableCell}>
                        <button
                          style={styles.removeButton}
                          onClick={() => handleRemoveUser(member.id)}
                          disabled={loading.removeUser}
                        >
                          {loading.removeUser ? 'Traitement...' : 'Retirer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={styles.noDataMessage}>Aucun membre dans ce groupe pour le moment.</p>
            )}
          </>
        ) : (
          <div style={styles.placeholder}>
            Sélectionnez un groupe pour voir ses membres
          </div>
        )}
      </div>

      {/* Modal pour créer un groupe */}
      {createGroupModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Créer un nouveau groupe</h2>
            
            {error && <div style={styles.errorMessage}>{error}</div>}
            {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

            <form onSubmit={handleCreateGroup}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Nom du groupe</label>
                <input
                  type="text"
                  name="name"
                  value={newGroup.name}
                  onChange={handleGroupInputChange}
                  style={styles.formInput}
                  required
                  disabled={loading.createGroup}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Niveau</label>
                <input
                  type="text"
                  name="niveau"
                  value={newGroup.niveau}
                  onChange={handleGroupInputChange}
                  style={styles.formInput}
                  required
                  disabled={loading.createGroup}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Année académique</label>
                <input
                  type="text"
                  name="academic_year_id"
                  value={newGroup.academic_year_id}
                  onChange={handleGroupInputChange}
                  style={styles.formInput}
                  required
                  disabled={loading.createGroup}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Filière</label>
                <select
                  name="filiere_id"
                  value={newGroup.filiere_id}
                  onChange={handleGroupInputChange}
                  style={styles.formSelect}
                  required
                  disabled={loading.createGroup}
                >
                  <option value="">Sélectionnez une filière</option>
                  {filieres.map(filiere => (
                    <option key={filiere.id} value={filiere.id}>
                      {filiere.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setCreateGroupModal(false)}
                  disabled={loading.createGroup}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={loading.createGroup}
                >
                  {loading.createGroup ? 'Création en cours...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'ajout de membre */}
      {modalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Ajouter un membre</h2>
            
            {error && <div style={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleAddUser}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Utilisateur</label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  style={styles.formSelect}
                  required
                  disabled={loading.addUser || loading.users}
                >
                  <option value="">Sélectionnez un utilisateur</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Rôle</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={styles.formSelect}
                  required
                  disabled={loading.addUser}
                >
                  <option value="enseignant">Enseignant</option>
                  <option value="etudiant">Étudiant</option>
                </select>
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => {
                    setModalVisible(false);
                    setError(null);
                  }}
                  disabled={loading.addUser}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={loading.addUser}
                >
                  {loading.addUser ? 'Ajout en cours...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message de succès global */}
      {successMessage && (
        <div style={styles.successMessage}>
          {successMessage}
          <button 
            onClick={() => setSuccessMessage(null)}
            style={{
              marginLeft: '15px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;