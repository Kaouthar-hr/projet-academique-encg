import React, { useState, useEffect } from 'react';
import api from '../api';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    password_confirmation: '',
    cni: '',
    specialite: '',
    grade: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    api.get('/teachers')
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
        setErrors({ fetch: 'Failed to fetch teachers' });
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');

    if (editingId) {
      api.put(`/teachers/${editingId}`, formData)
        .then(response => {
          setSuccessMsg('Teacher updated successfully');
          fetchTeachers();
          resetForm();
        })
        .catch(error => {
          if (error.response && error.response.data.errors) {
            setErrors(error.response.data.errors);
          } else {
            setErrors({ submit: 'Error updating teacher' });
          }
        });
    } else {
      api.post('/teachers', formData)
        .then(response => {
          setSuccessMsg('Teacher created successfully');
          fetchTeachers();
          resetForm();
        })
        .catch(error => {
          if (error.response && error.response.data.errors) {
            setErrors(error.response.data.errors);
          } else {
            setErrors({ submit: 'Error creating teacher' });
          }
        });
    }
  };

  const handleEdit = (teacher) => {
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: '',
      password_confirmation: '',
      cni: teacher.cni,
      specialite: teacher.specialite,
      grade: teacher.grade
    });
    setEditingId(teacher.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      api.delete(`/teachers/${id}`)
        .then(() => {
          setSuccessMsg('Teacher deleted successfully');
          fetchTeachers();
        })
        .catch(error => {
          setErrors({ delete: 'Error deleting teacher' });
        });
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      email: '', 
      password: '', 
      password_confirmation: '',
      cni: '',
      specialite: '',
      grade: ''
    });
    setEditingId(null);
  };

  return (
    <div className="container">
      <h2>Gestion des enseignants</h2>
      
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className="text-danger">{errors.name[0]}</div>}
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <div className="text-danger">{errors.email[0]}</div>}
        </div>
        
        <div className="form-group">
          <label>CNI</label>
          <input
            type="text"
            name="cni"
            className="form-control"
            value={formData.cni}
            onChange={handleInputChange}
          />
          {errors.cni && <div className="text-danger">{errors.cni[0]}</div>}
        </div>
        
        <div className="form-group">
          <label>Spécialité</label>
          <input
            type="text"
            name="specialite"
            className="form-control"
            value={formData.specialite}
            onChange={handleInputChange}
          />
          {errors.specialite && <div className="text-danger">{errors.specialite[0]}</div>}
        </div>
        
        <div className="form-group">
          <label>Grade</label>
          <select
            name="grade"
            className="form-control"
            value={formData.grade}
            onChange={handleInputChange}
          >
            <option value="">Sélectionner un grade</option>
            <option value="Professeur">Professeur</option>
            <option value="Maître de conférences">Maître de conférences</option>
            <option value="Chargé de cours">Chargé de cours</option>
            <option value="Assistant">Assistant</option>
          </select>
          {errors.grade && <div className="text-danger">{errors.grade[0]}</div>}
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <div className="text-danger">{errors.password[0]}</div>}
        </div>
        
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="password_confirmation"
            className="form-control"
            value={formData.password_confirmation}
            onChange={handleInputChange}
          />
        </div>
        
        <button type="submit" className="btn btn-primary">
          {editingId ? 'Update Teacher' : 'Add Teacher'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="btn btn-secondary ml-2">
            Cancel
          </button>
        )}
        
        {errors.submit && <div className="text-danger mt-2">{errors.submit}</div>}
      </form>

      <h3>Teachers List</h3>
      {errors.fetch && <div className="text-danger">{errors.fetch}</div>}
      
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>CNI</th>
            <th>Spécialité</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(teacher => (
            <tr key={teacher.id}>
              <td>{teacher.name}</td>
              <td>{teacher.email}</td>
              <td>{teacher.cni}</td>
              <td>{teacher.specialite}</td>
              <td>{teacher.grade}</td>
              <td>
                <button 
                  onClick={() => handleEdit(teacher)}
                  className="btn btn-sm btn-warning mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(teacher.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherManagement;