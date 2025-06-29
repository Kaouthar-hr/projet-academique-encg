import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/register';
import Login from './pages/Login';
import NavigationLinks from './navlink';
import UploadAdmis from './admins/UploadAdmis.jsx';
import EspaceEtudiant from './EspaceEtudiant';
import AdminInscriptions from './admins/AdminInscriptions.jsx';
import MesInscriptions from './pages/MesInscriptions.jsx';
import TeacherManagement from './admins/TeacherManagement.jsx';
import EditProfile from './pages/EditProfile';
import DemandeAdministrativeForm from './pages/DemandeAdministrativeForm';
import MesDemandes from './pages/MesDemandes';
import GestionDemandesAdmin from './admins/GestionDemandesAdmin.jsx';
import MesNotes from './pages/ResultatEtudiant';
import AdminNotes from './admins/GestionNotesAdminEnseignant';
import ModuleManagement from './admins/ModuleManagement';
import GroupManagement from './admins/gestionGroupe';
import AjouterNote from './prof/AjouterNote';
import TeacherDashboard from './prof/TeacherDashboard';
import GroupStudents from './prof/GroupStudents';


function App() {
  return (
    <BrowserRouter>
      <NavigationLinks /> {/* Visible sur toutes les pages */}

      <Routes>


<Route path="/prof/groups/:groupId" element={<GroupStudents />} />
      <Route path="/prof/groups" element={<TeacherDashboard />} />
      <Route path="/groups" element={<GroupManagement />} />
      <Route path="/modules" element={<ModuleManagement />} />
      <Route path="/enseignant/ajouter-note" element={<AjouterNote />} />
      <Route path="/admin/notes" element={<AdminNotes />} />
      <Route path="/mes-notes" element={<MesNotes />} />
      <Route path="/admin/demandes" element={<GestionDemandesAdmin />} />
      <Route path="/mes-demandes" element={<MesDemandes />} />
      <Route path="/demandes" element={<DemandeAdministrativeForm />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/inscriptions" element={<MesInscriptions />} />
        <Route path="/teachers" element={<TeacherManagement />} />
        <Route path="/espace-etudiant" element={<EspaceEtudiant />} />
        <Route path="/admin/inscriptions" element={<AdminInscriptions />} />
        <Route path="/upload-admis" element={<UploadAdmis />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
