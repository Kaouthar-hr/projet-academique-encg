import React, { useState, useEffect } from 'react';
import api from './api';
import 'bootstrap/dist/css/bootstrap.min.css';

const EspaceEtudiant = () => {
  // États principaux
  const [type, setType] = useState('inscription');
  const [niveau, setNiveau] = useState('1A');
  const [semestre, setSemestre] = useState('Semestre 2');
  const [anneeUniversitaire, setAnneeUniversitaire] = useState('');
  const [filiereId, setFiliereId] = useState('');
  const [filieres, setFilieres] = useState([]);
  const [bacDocument, setBacDocument] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Informations personnelles
  const [cin, setCin] = useState('');
  const [cne, setCne] = useState('');
  const [nomFr, setNomFr] = useState('');
  const [nomAr, setNomAr] = useState('');
  const [prenomFr, setPrenomFr] = useState('');
  const [prenomAr, setPrenomAr] = useState('');
  const [lieuNaissanceFr, setLieuNaissanceFr] = useState('');
  const [lieuNaissanceAr, setLieuNaissanceAr] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [sexe, setSexe] = useState('');
  const [nationaliter, setNationaliter] = useState('');
  const [situationFamiliale, setSituationFamiliale] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');

  // Informations géographiques
  const [province, setProvince] = useState('');
  const [ville, setVille] = useState('');
  const [payeLibelle, setPayeLibelle] = useState('');

  // Informations parents
  const [cinMere, setCinMere] = useState('');
  const [nomMere, setNomMere] = useState('');
  const [prenomMere, setPrenomMere] = useState('');
  const [cinPere, setCinPere] = useState('');
  const [nomPere, setNomPere] = useState('');
  const [prenomPere, setPrenomPere] = useState('');
  const [adresseParent, setAdresseParent] = useState('');
  const [telParent, setTelParent] = useState('');
  const [professionPere, setProfessionPere] = useState('');
  const [professionMere, setProfessionMere] = useState('');

  // Informations baccalauréat
  const [mentionBac, setMentionBac] = useState('');
  const [anneeBac, setAnneeBac] = useState('');
  const [lycee, setLycee] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [universite, setUniversite] = useState('');
  const [anneePremiereInscens, setAnneePremiereInscens] = useState('');
  const [lnscens, setLnscens] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);
  const [inscriptionData, setInscriptionData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const provincesVilles = {
    "Tanger-Tétouan-Al Hoceïma": ["Tanger", "Tétouan", "Al Hoceïma", "Larache"],
    "Fès-Meknès": ["Fès", "Meknès", "Ifrane", "Sefrou"],
    "Rabat-Salé-Kénitra": ["Rabat", "Salé", "Kénitra", "Sidi Kacem"],
    "Casablanca-Settat": ["Casablanca", "Mohammedia", "Settat", "El Jadida"],
    "Marrakech-Safi": ["Marrakech", "Safi", "Essaouira", "Youssoufia"],
    "Béni Mellal-Khénifra": ["Béni Mellal", "Khénifra", "Fquih Ben Salah"],
    "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Zagora"],
    "Souss-Massa": ["Agadir", "Inezgane", "Tiznit", "Taroudant"],
    "Guelmim-Oued Noun": ["Guelmim", "Tan-Tan"],
    "Laâyoune-Sakia El Hamra": ["Laâyoune", "Tarfaya"],
    "Dakhla-Oued Ed-Dahab": ["Dakhla"]
  };

  useEffect(() => {
    if (niveau === '3A' || niveau === '4A' || niveau === '5A') {
      api.get('/filieres')
        .then(res => setFilieres(res.data))
        .catch(err => {
          console.error(err);
          setError('Erreur lors du chargement des filières');
        });
    } else {
      setFilieres([]);
      setFiliereId('');
    }
  }, [niveau]);
  useEffect(() => {
    if (niveau === '3A' || niveau === '4A' || niveau === '5A') {
      api.get('/filieres')
        .then(res => setFilieres(res.data))
        .catch(err => {
          console.error(err);
          setError('Erreur lors du chargement des filières');
        });
    } else {
      setFilieres([]);
      setFiliereId('');
    }
  }, [niveau]);


  const handleGeneratePdf = async () => {
    if (!inscriptionData?.id) {
      setError("Veuillez d'abord compléter l'inscription avant de générer le reçu");
      return; // Arrête l'exécution si aucune inscription n'existe
    }
  
    let link;
    try {
      setError('');
      setIsGeneratingPdf(true);
  
      const response = await api.get(`/recu/${inscriptionData.id}`, {
        responseType: 'blob',
      });
  
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      setPdfUrl(fileURL);
  
      link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `recu_${inscriptionData.id}.pdf`);
      document.body.appendChild(link);
      link.click();
    }catch (error) {
      let errorMessage = "Erreur lors de la génération du PDF";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      setError(errorMessage);
    }
    finally {
      if (link) {
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(link.href);
        }, 100);
      }
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    setIsSuccess(false);
    if (nationaliter === 'Marocaine' && (!province || !ville)) {
      setError('Les champs Province et Ville sont obligatoires pour les Marocains');
      setIsSubmitting(false);
      return;
    }
   // Validation des champs obligatoires
   const requiredFields = {
    anneeUniversitaire,
    niveau,
    sexe,
    nationaliter,
    cin,
    cne,
    nomFr,
    prenomFr,
    dateNaissance,
    telephone,
    bacDocument,
    photo,
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      const fieldNames = {
        anneeUniversitaire: "Année universitaire",
        niveau: "Niveau",
        sexe: "Sexe",
        nationaliter: "Nationalité",
        province: "Province",
        ville: "Ville",
        cin: "CIN",
        cne: "CNE",
        nomFr: "Nom (français)",
        prenomFr: "Prénom (français)",
        dateNaissance: "Date de naissance",
        telephone: "Téléphone",
        bacDocument: "Document du Bac",
        photo: "Photo"
    };
    
    setError(`${fieldNames[field]} est obligatoire`);
    setIsSubmitting(false);
    return;
  }
}

    if ((niveau === '3A' || niveau === '4A' || niveau === '5A') && !filiereId) {
      setError('Veuillez sélectionner une filière');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    // Ajout de tous les champs au FormData
    formData.append('type', type);
    formData.append('annee_universitaire', anneeUniversitaire);
    formData.append('niveau', niveau);
    if (filiereId) formData.append('filiere_id', filiereId);
    formData.append('bac', bacDocument);
    formData.append('photo', photo);
    
    // Informations personnelles
    formData.append('cin', cin);
    formData.append('cne', cne);
    formData.append('nom_fr', nomFr);
    formData.append('nom_ar', nomAr);
    formData.append('prenom_fr', prenomFr);
    formData.append('prenom_ar', prenomAr);
    formData.append('lieuNaissance_fr', lieuNaissanceFr);
    formData.append('lieuNaissance_ar', lieuNaissanceAr);
    formData.append('dateNaissance', dateNaissance);
    formData.append('sexe', sexe);
    formData.append('nationaliter', nationaliter);
    formData.append('situation_familiale', situationFamiliale);
    formData.append('telephone', telephone);
    formData.append('adresse', adresse);
    
    // Informations géographiques  formData.append('province', nationaliter === 'Marocaine' ? province : 'Non applicable');
  formData.append('ville_libelle_stud', nationaliter === 'Marocaine' ? ville : 'Non applicable');
    formData.append('paye_libelle', payeLibelle);
    
    // Informations parents
    formData.append('cin_mere', cinMere);
    formData.append('nom_mere', nomMere);
    formData.append('prenom_mere', prenomMere);
    formData.append('cinpere', cinPere);
    formData.append('nompere', nomPere);
    formData.append('prenompere', prenomPere);
    formData.append('adresseparent', adresseParent);
    formData.append('telparent', telParent);
    formData.append('professionpere', professionPere);
    formData.append('professionmere', professionMere);
    formData.append('nationaliter', nationaliter);
    if (nationaliter === 'Marocaine') {
      formData.append('province', province);
      formData.append('ville_libelle_stud', ville);
    } else {
      // Pour les non-Marocains, envoyer null
      formData.append('province', null);
      formData.append('ville_libelle_stud', null);
    }
    // Informations baccalauréat
    formData.append('mention_bac', mentionBac);
    formData.append('annee_bac', anneeBac);
    formData.append('lycee', lycee);
    formData.append('province_name', provinceName);
    formData.append('universite', universite);
    formData.append('anneePremiereInscens', anneePremiereInscens);
    formData.append('lnscens', lnscens);

   
      
      try {
        const response = await api.post('/inscriptions', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        console.log("Réponse API:", response.data);
        
        if (response.data && response.data.inscription) {
          setInscriptionData(response.data.inscription);
          setMessage('Inscription terminée avec succès !');
          setIsSuccess(true);
        } else {
          setError('Réponse inattendue du serveur ');
        }
      } catch (err) {
        console.error('Erreur d\'inscription:', err);
        
        const serverError = err.response?.data?.error || err.message;
        setError(`  Erreur d\'inscription: ${serverError}`);
      } finally {
        setIsSubmitting(false);
      }
    };

  const resetForm = () => {
    setType('inscription');
    setNiveau('1A');
    setAnneeUniversitaire('');
    setFiliereId('');
    setCin('');
    setCne('');
    setNomFr('');
    setNomAr('');
    setPrenomFr('');
    setPrenomAr('');
    setLieuNaissanceFr('');
    setLieuNaissanceAr('');
    setDateNaissance('');
    setSexe('');
    setNationaliter('');
    setSituationFamiliale('');
    setTelephone('');
    setAdresse('');
    setProvince('');
    setVille('');
    setPayeLibelle('');
    setCinMere('');
    setNomMere('');
    setPrenomMere('');
    setCinPere('');
    setNomPere('');
    setPrenomPere('');
    setAdresseParent('');
    setTelParent('');
    setProfessionPere('');
    setProfessionMere('');
    setMentionBac('');
    setAnneeBac('');
    setLycee('');
    setProvinceName('');
    setUniversite('');
    setAnneePremiereInscens('');
    setLnscens('');
    setBacDocument(null);
    setPhoto(null);
  };

  return (
    <div className="container py-5">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 mb-0 text-center">Formulaire d'Inscription</h2>
        </div>
        <div className="card-body p-4">
          {isSuccess && (
            <div className="alert alert-success text-center" role="alert">
              <h4 className="alert-heading">Votre inscription est effectuée avec succès !</h4>
              
              <p>
              <button
  onClick={handleGeneratePdf}
  disabled={!inscriptionData?.id || isGeneratingPdf}
  className={`btn btn-primary ${isGeneratingPdf ? 'disabled' : ''}`}
>
  {isGeneratingPdf ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Génération en cours...
    </>
  ) : (
    <>
      <i className="bi bi-file-earmark-pdf me-2"></i>
      Télécharger le reçu
    </>
  )}
</button>
              </p>
            </div>
          )}
          
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {message && !isSuccess && <div className="alert alert-info" role="alert">{message}</div>}

          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              {/* Section 1: Type et année universitaire */}
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Type*</label>
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value)} 
                    className="form-select"
                    required
                  >
                    <option value="inscription">Inscription</option>
                    <option value="réinscription">Réinscription</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Année universitaire*</label>
                  <input 
                    type="text" 
                    value={anneeUniversitaire} 
                    onChange={e => setAnneeUniversitaire(e.target.value)} 
                    placeholder="2024/2025" 
                    className="form-control" 
                    required 
                  />
                </div>
              </div>

              {/* Section 2: Informations personnelles */}
              <div className="card mb-4 bg-light">
                <div className="card-header bg-secondary text-white">
                  <h3 className="h5 mb-0">Informations Personnelles</h3>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {/* CIN et CNE */}
                    <div className="col-md-6">
                      <label className="form-label">CIN*</label>
                      <input 
                        type="text" 
                        value={cin} 
                        onChange={e => setCin(e.target.value)} 
                        className="form-control" 
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">CNE*</label>
                      <input 
                        type="text" 
                        value={cne} 
                        onChange={e => setCne(e.target.value)} 
                        className="form-control" 
                        required 
                      />
                    </div>

                    {/* Noms et prénoms */}
                    <div className="col-md-6">
                      <label className="form-label">Nom (Français)*</label>
                      <input 
                        type="text" 
                        value={nomFr} 
                        onChange={e => setNomFr(e.target.value)} 
                        className="form-control" 
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Prénom (Français)*</label>
                      <input 
                        type="text" 
                        value={prenomFr} 
                        onChange={e => setPrenomFr(e.target.value)} 
                        className="form-control" 
                        required 
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">الإسم العائلي</label>
                      <input 
                        type="text" 
                        value={nomAr} 
                        onChange={e => setNomAr(e.target.value)} 
                        className="form-control" 
                        dir="rtl"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">الإسم الشخصي</label>
                      <input 
                        type="text" 
                        value={prenomAr} 
                        onChange={e => setPrenomAr(e.target.value)} 
                        className="form-control" 
                        dir="rtl"
                      />
                    </div>

                    {/* Date et lieu de naissance */}
                    <div className="col-md-6">
                      <label className="form-label">Date de naissance*</label>
                      <input 
                        type="date" 
                        value={dateNaissance} 
                        onChange={e => setDateNaissance(e.target.value)} 
                        className="form-control" 
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Lieu de naissance (Français)</label>
                      <input 
                        type="text" 
                        value={lieuNaissanceFr} 
                        onChange={e => setLieuNaissanceFr(e.target.value)} 
                        className="form-control" 
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Lieu de naissance (Arabe)</label>
                      <input 
                        type="text" 
                        value={lieuNaissanceAr} 
                        onChange={e => setLieuNaissanceAr(e.target.value)} 
                        className="form-control" 
                        dir="rtl"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Téléphone*</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                        <input 
                          type="tel" 
                          value={telephone} 
                          onChange={e => setTelephone(e.target.value)} 
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>

                    {/* Sexe et nationalité */}
                    <div className="col-md-6">
                      <label className="form-label">Sexe*</label>
                      <select 
                        value={sexe} 
                        onChange={e => setSexe(e.target.value)} 
                        className="form-select" 
                        required
                      >
                        <option value="">-- Sélectionner --</option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                      </select>
                    </div>
                    <div className="col-md-6">
  <label className="form-label">Nationalité*</label>
  <select 
    value={nationaliter} 
    onChange={e => {
      setNationaliter(e.target.value);
      // Réinitialiser province et ville si on change de nationalité
      if (e.target.value !== 'Marocaine') {
        setProvince('');
        setVille('');
      }
    }} 
    className="form-select" 
    required
  >
                        <option value="">-- Sélectionner --</option>
                        <option value="Afghane">Afghane</option>
<option value="Albanaise">Albanaise</option>
<option value="Algerienne">Algérienne</option>
<option value="Allemande">Allemande</option>
<option value="Americaine">Américaine</option>
<option value="Andorrane">Andorrane</option>
<option value="Angolaise">Angolaise</option>
<option value="Antiguaise-et-barbudienne">Antiguaise-et-barbudienne</option>
<option value="Argentine">Argentine</option>
<option value="Armenienne">Arménienne</option>
<option value="Australienne">Australienne</option>
<option value="Autrichienne">Autrichienne</option>
<option value="Azerbaïdjanaise">Azerbaïdjanaise</option>
<option value="Bahamienne">Bahamienne</option>
<option value="Bahreinienne">Bahreïnienne</option>
<option value="Bangladaise">Bangladaise</option>
<option value="Barbadienne">Barbadienne</option>
<option value="Belge">Belge</option>
<option value="Belizienne">Belizienne</option>
<option value="Beninoise">Béninoise</option>
<option value="Bhoutanaise">Bhoutanaise</option>
<option value="Bielorusse">Biélorusse</option>
<option value="Birmane">Birmane</option>
<option value="Bolivienne">Bolivienne</option>
<option value="Bosnienne">Bosnienne</option>
<option value="Botswanaise">Botswanaise</option>
<option value="Bresilienne">Brésilienne</option>
<option value="Britannique">Britannique</option>
<option value="Bruneienne">Brunéienne</option>
<option value="Bulgare">Bulgare</option>
<option value="Burkinabe">Burkinabé</option>
<option value="Burundaise">Burundaise</option>
<option value="Cambodgienne">Cambodgienne</option>
<option value="Camerounaise">Camerounaise</option>
<option value="Canadienne">Canadienne</option>
<option value="Cap-verdienne">Cap-verdienne</option>
<option value="Centrafricaine">Centrafricaine</option>
<option value="Chilienne">Chilienne</option>
<option value="Chinoise">Chinoise</option>
<option value="Chypriote">Chypriote</option>
<option value="Colombienne">Colombienne</option>
<option value="Comorienne">Comorienne</option>
<option value="Congolaise">Congolaise</option>
<option value="Costaricaine">Costaricaine</option>
<option value="Croate">Croate</option>
<option value="Cubaine">Cubaine</option>
<option value="Danoise">Danoise</option>
<option value="Djiboutienne">Djiboutienne</option>
<option value="Dominicaine">Dominicaine</option>
<option value="Dominiquaise">Dominiquaise</option>
<option value="Egyptienne">Égyptienne</option>
<option value="Emirienne">Émirienne</option>
<option value="Equatorienne">Équatorienne</option>
<option value="Erythreenne">Érythréenne</option>
<option value="Espagnole">Espagnole</option>
<option value="Est-timoraise">Est-timoraise</option>
<option value="Estonienne">Estonienne</option>
<option value="Ethiopienne">Éthiopienne</option>
<option value="Fidjienne">Fidjienne</option>
<option value="Finlandaise">Finlandaise</option>
<option value="Francaise">Française</option>
<option value="Gabonaise">Gabonaise</option>
<option value="Gambienne">Gambienne</option>
<option value="Georgienne">Géorgienne</option>
<option value="Ghaneenne">Ghanéenne</option>
<option value="Grecque">Grecque</option>
<option value="Grenadienne">Grenadienne</option>
<option value="Guatemalteque">Guatémaltèque</option>
<option value="Guineenne">Guinéenne</option>
<option value="Guineenne-equatoriale">Guinéenne-équatoriale</option>
<option value="Guyanaise">Guyanaise</option>
<option value="Haitienne">Haïtienne</option>
<option value="Hellenique">Hellénique (Grecque)</option>
<option value="Hondurienne">Hondurienne</option>
<option value="Hongroise">Hongroise</option>
<option value="Indienne">Indienne</option>
<option value="Indonesienne">Indonésienne</option>
<option value="Irakienne">Irakienne</option>
<option value="Iranienne">Iranienne</option>
<option value="Irlandaise">Irlandaise</option>
<option value="Islandaise">Islandaise</option>
<option value="Israelienne">Israélienne</option>
<option value="Italienne">Italienne</option>
<option value="Ivoirienne">Ivoirienne</option>
<option value="Jamaicaine">Jamaïcaine</option>
<option value="Japonaise">Japonaise</option>
<option value="Jordanienne">Jordanienne</option>
<option value="Kazakhstanaise">Kazakhstanaise</option>
<option value="Kenyane">Kenyane</option>
<option value="Kirghize">Kirghize</option>
<option value="Kiribatienne">Kiribatienne</option>
<option value="Kittitienne-et-nevicienne">Kittitienne-et-névicienne</option>
<option value="Koweitienne">Koweïtienne</option>
<option value="Laotienne">Laotienne</option>
<option value="Lesothane">Lesothane</option>
<option value="Lettone">Lettone</option>
<option value="Libanaise">Libanaise</option>
<option value="Liberienne">Libérienne</option>
<option value="Libyenne">Libyenne</option>
<option value="Liechtensteinoise">Liechtensteinoise</option>
<option value="Lituanienne">Lituanienne</option>
<option value="Luxembourgeoise">Luxembourgeoise</option>
<option value="Macedonienne">Macédonienne</option>
<option value="Malaisienne">Malaisienne</option>
<option value="Malawienne">Malawienne</option>
<option value="Maldivienne">Maldivienne</option>
<option value="Malienne">Malienne</option>
<option value="Maltaise">Maltaise</option>
<option value="Marocaine">Marocaine</option>
<option value="Marshallaise">Marshallaise</option>
<option value="Mauricienne">Mauricienne</option>
<option value="Mauritanienne">Mauritanienne</option>
<option value="Mexicaine">Mexicaine</option>
<option value="Micronesienne">Micronésienne</option>
<option value="Moldave">Moldave</option>
<option value="Monegasque">Monégasque</option>
<option value="Mongole">Mongole</option>
<option value="Montenegrine">Monténégrine</option>
<option value="Mozambicaine">Mozambicaine</option>
<option value="Namibienne">Namibienne</option>
<option value="Nauruane">Nauruane</option>
<option value="Neerlandaise">Néerlandaise</option>
<option value="Neo-zelandaise">Néo-zélandaise</option>
<option value="Nepalaise">Népalaise</option>
<option value="Nicaraguayenne">Nicaraguayenne</option>
<option value="Nigeriane">Nigériane</option>
<option value="Nigerienne">Nigérienne</option>
<option value="Nord-coreenne">Nord-coréenne</option>
<option value="Norvegienne">Norvégienne</option>
<option value="Omanaise">Omanaise</option>
<option value="Ougandaise">Ougandaise</option>
<option value="Ouzbeke">Ouzbèke</option>
<option value="Pakistanaise">Pakistanaise</option>
<option value="Palau">Paluane</option>
<option value="Palestinienne">Palestinienne</option>
<option value="Panameenne">Panaméenne</option>
<option value="Papouane-neo-guineenne">Papouane-néo-guinéenne</option>
<option value="Paraguayenne">Paraguayenne</option>
<option value="Peruvienne">Péruvienne</option>
<option value="Philippine">Philippine</option>
<option value="Polonaise">Polonaise</option>
<option value="Portugaise">Portugaise</option>
<option value="Qatarienne">Qatarienne</option>
<option value="Roumaine">Roumaine</option>
<option value="Russe">Russe</option>
<option value="Rwandaise">Rwandaise</option>
<option value="Saint-lucienne">Saint-lucienne</option>
<option value="Saint-marinaise">Saint-marinaise</option>
<option value="Saint-vincentaise-et-grenadine">Saint-vincentaise-et-grenadine</option>
<option value="Salomonaise">Salomonaise</option>
<option value="Salvadorienne">Salvadorienne</option>
<option value="Samoane">Samoane</option>
<option value="Santomeenne">Santomeenne</option>
<option value="Saoudienne">Saoudienne</option>
<option value="Senegalaise">Sénégalaise</option>
<option value="Serbe">Serbe</option>
<option value="Seychelloise">Seychelloise</option>
<option value="Sierra-leonaise">Sierra-léonaise</option>
<option value="Singapourienne">Singapourienne</option>
<option value="Slovaque">Slovaque</option>
<option value="Slovene">Slovène</option>
<option value="Somalienne">Somalienne</option>
<option value="Soudanaise">Soudanaise</option>
<option value="Sri-lankaise">Sri-lankaise</option>
<option value="Sud-africaine">Sud-africaine</option>
<option value="Sud-coreenne">Sud-coréenne</option>
<option value="Suedoise">Suédoise</option>
<option value="Suisse">Suisse</option>
<option value="Surinamaise">Surinamaise</option>
<option value="Swazie">Swazie</option>
<option value="Syrienne">Syrienne</option>
<option value="Tadjike">Tadjike</option>
<option value="Tanzanienne">Tanzanienne</option>
<option value="Tchadienne">Tchadienne</option>
<option value="Tcheque">Tchèque</option>
<option value="Thaïlandaise">Thaïlandaise</option>
<option value="Togolaise">Togolaise</option>
<option value="Tonguienne">Tonguienne</option>
<option value="Trinidadienne">Trinidadienne</option>
<option value="Tunisienne">Tunisienne</option>
<option value="Turkmene">Turkmène</option>
<option value="Turque">Turque</option>
<option value="Tuvaluane">Tuvaluane</option>
<option value="Ukrainienne">Ukrainienne</option>
<option value="Uruguayenne">Uruguayenne</option>
<option value="Vanuatuane">Vanuatuane</option>
<option value="Venezuelienne">Vénézuélienne</option>
<option value="Vietnamienne">Vietnamienne</option>
<option value="Yemenite">Yéménite</option>
<option value="Zambienne">Zambienne</option>
<option value="Zimbabweenne">Zimbabwéenne</option>
                      </select>
                    </div>

                    {/* Situation familiale et adresse */}
                    <div className="col-md-6">
                      <label className="form-label">Situation familiale</label>
                      <select 
                        value={situationFamiliale} 
                        onChange={e => setSituationFamiliale(e.target.value)} 
                        className="form-select"
                      >
                        <option value="">-- Sélectionner --</option>
                        <option value="Célibataire">Célibataire</option>
                        <option value="Marié(e)">Marié(e)</option>
                        <option value="Divorcé(e)">Divorcé(e)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Adresse*</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
                        <input 
                          type="text" 
                          value={adresse} 
                          onChange={e => setAdresse(e.target.value)} 
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Informations géographiques */}
              <div className="card mb-4 bg-light">
                <div className="card-header bg-secondary text-white">
                  <h3 className="h5 mb-0">Informations Géographiques</h3>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                    <label className="form-label">Province{nationaliter === 'Marocaine' && '*'}</label>
  <select 
    value={province} 
    onChange={e => {
      setProvince(e.target.value);
      setVille('');
    }} 
    className="form-select" 
    required={nationaliter === 'Marocaine'}
    disabled={nationaliter !== 'Marocaine'}
  >
    <option value="">-- Sélectionner une province --</option>
    {Object.keys(provincesVilles).map(p => (
      <option key={p} value={p}>{p}</option>
    ))}
  </select>
                    </div>
                    <div className="col-md-6">
                    <label className="form-label">Ville{nationaliter === 'Marocaine' && '*'}</label>
  <select 
    value={ville} 
    onChange={e => setVille(e.target.value)} 
    className="form-select" 
    required={nationaliter === 'Marocaine'} 
    disabled={!province || nationaliter !== 'Marocaine'}
  >
    <option value="">-- Sélectionner une ville --</option>
    {province && provincesVilles[province].map(v => (
      <option key={v} value={v}>{v}</option>
    ))}
  </select>
                    </div>

                    <div className="col-12">
                    <label className="form-label">Pays</label>
<select 
  type="text" 
  value={payeLibelle} 
  onChange={e => setPayeLibelle(e.target.value)} 
  className="form-control"
>
  <option value="">Sélectionnez un pays</option>
  <option value="Afghanistan">Afghanistan</option>
  <option value="Afrique du Sud">Afrique du Sud</option>
  <option value="Albanie">Albanie</option>
  <option value="Algérie">Algérie</option>
  <option value="Allemagne">Allemagne</option>
  <option value="Andorre">Andorre</option>
  <option value="Angola">Angola</option>
  <option value="Antigua-et-Barbuda">Antigua-et-Barbuda</option>
  <option value="Arabie saoudite">Arabie saoudite</option>
  <option value="Argentine">Argentine</option>
  <option value="Arménie">Arménie</option>
  <option value="Australie">Australie</option>
  <option value="Autriche">Autriche</option>
  <option value="Azerbaïdjan">Azerbaïdjan</option>
  <option value="Bahamas">Bahamas</option>
  <option value="Bahreïn">Bahreïn</option>
  <option value="Bangladesh">Bangladesh</option>
  <option value="Barbade">Barbade</option>
  <option value="Belgique">Belgique</option>
  <option value="Belize">Belize</option>
  <option value="Bénin">Bénin</option>
  <option value="Bhoutan">Bhoutan</option>
  <option value="Biélorussie">Biélorussie</option>
  <option value="Birmanie">Birmanie</option>
  <option value="Bolivie">Bolivie</option>
  <option value="Bosnie-Herzégovine">Bosnie-Herzégovine</option>
  <option value="Botswana">Botswana</option>
  <option value="Brésil">Brésil</option>
  <option value="Brunei">Brunei</option>
  <option value="Bulgarie">Bulgarie</option>
  <option value="Burkina Faso">Burkina Faso</option>
  <option value="Burundi">Burundi</option>
  <option value="Cambodge">Cambodge</option>
  <option value="Cameroun">Cameroun</option>
  <option value="Canada">Canada</option>
  <option value="Cap-Vert">Cap-Vert</option>
  <option value="Chili">Chili</option>
  <option value="Chine">Chine</option>
  <option value="Chypre">Chypre</option>
  <option value="Colombie">Colombie</option>
  <option value="Comores">Comores</option>
  <option value="Congo">Congo</option>
  <option value="Corée du Nord">Corée du Nord</option>
  <option value="Corée du Sud">Corée du Sud</option>
  <option value="Costa Rica">Costa Rica</option>
  <option value="Côte d'Ivoire">Côte d'Ivoire</option>
  <option value="Croatie">Croatie</option>
  <option value="Cuba">Cuba</option>
  <option value="Danemark">Danemark</option>
  <option value="Djibouti">Djibouti</option>
  <option value="Dominique">Dominique</option>
  <option value="Égypte">Égypte</option>
  <option value="Émirats arabes unis">Émirats arabes unis</option>
  <option value="Équateur">Équateur</option>
  <option value="Érythrée">Érythrée</option>
  <option value="Espagne">Espagne</option>
  <option value="Estonie">Estonie</option>
  <option value="Eswatini">Eswatini</option>
  <option value="États-Unis">États-Unis</option>
  <option value="Éthiopie">Éthiopie</option>
  <option value="Fidji">Fidji</option>
  <option value="Finlande">Finlande</option>
  <option value="France">France</option>
  <option value="Gabon">Gabon</option>
  <option value="Gambie">Gambie</option>
  <option value="Géorgie">Géorgie</option>
  <option value="Ghana">Ghana</option>
  <option value="Grèce">Grèce</option>
  <option value="Grenade">Grenade</option>
  <option value="Guatemala">Guatemala</option>
  <option value="Guinée">Guinée</option>
  <option value="Guinée équatoriale">Guinée équatoriale</option>
  <option value="Guinée-Bissau">Guinée-Bissau</option>
  <option value="Guyana">Guyana</option>
  <option value="Haïti">Haïti</option>
  <option value="Honduras">Honduras</option>
  <option value="Hongrie">Hongrie</option>
  <option value="Inde">Inde</option>
  <option value="Indonésie">Indonésie</option>
  <option value="Irak">Irak</option>
  <option value="Iran">Iran</option>
  <option value="Irlande">Irlande</option>
  <option value="Islande">Islande</option>
  <option value="Israël">Israël</option>
  <option value="Italie">Italie</option>
  <option value="Jamaïque">Jamaïque</option>
  <option value="Japon">Japon</option>
  <option value="Jordanie">Jordanie</option>
  <option value="Kazakhstan">Kazakhstan</option>
  <option value="Kenya">Kenya</option>
  <option value="Kirghizistan">Kirghizistan</option>
  <option value="Kiribati">Kiribati</option>
  <option value="Koweït">Koweït</option>
  <option value="Laos">Laos</option>
  <option value="Lesotho">Lesotho</option>
  <option value="Lettonie">Lettonie</option>
  <option value="Liban">Liban</option>
  <option value="Liberia">Liberia</option>
  <option value="Libye">Libye</option>
  <option value="Liechtenstein">Liechtenstein</option>
  <option value="Lituanie">Lituanie</option>
  <option value="Luxembourg">Luxembourg</option>
  <option value="Macédoine du Nord">Macédoine du Nord</option>
  <option value="Madagascar">Madagascar</option>
  <option value="Malaisie">Malaisie</option>
  <option value="Malawi">Malawi</option>
  <option value="Maldives">Maldives</option>
  <option value="Mali">Mali</option>
  <option value="Malte">Malte</option>
  <option value="Maroc">Maroc</option>
  <option value="Marshall">Marshall</option>
  <option value="Maurice">Maurice</option>
  <option value="Mauritanie">Mauritanie</option>
  <option value="Mexique">Mexique</option>
  <option value="Micronésie">Micronésie</option>
  <option value="Moldavie">Moldavie</option>
  <option value="Monaco">Monaco</option>
  <option value="Mongolie">Mongolie</option>
  <option value="Monténégro">Monténégro</option>
  <option value="Mozambique">Mozambique</option>
  <option value="Namibie">Namibie</option>
  <option value="Nauru">Nauru</option>
  <option value="Népal">Népal</option>
  <option value="Nicaragua">Nicaragua</option>
  <option value="Niger">Niger</option>
  <option value="Nigeria">Nigeria</option>
  <option value="Norvège">Norvège</option>
  <option value="Nouvelle-Zélande">Nouvelle-Zélande</option>
  <option value="Oman">Oman</option>
  <option value="Ouganda">Ouganda</option>
  <option value="Ouzbékistan">Ouzbékistan</option>
  <option value="Pakistan">Pakistan</option>
  <option value="Palaos">Palaos</option>
  <option value="Panama">Panama</option>
  <option value="Papouasie-Nouvelle-Guinée">Papouasie-Nouvelle-Guinée</option>
  <option value="Paraguay">Paraguay</option>
  <option value="Pays-Bas">Pays-Bas</option>
  <option value="Pérou">Pérou</option>
  <option value="Philippines">Philippines</option>
  <option value="Pologne">Pologne</option>
  <option value="Portugal">Portugal</option>
  <option value="Qatar">Qatar</option>
  <option value="Roumanie">Roumanie</option>
  <option value="Royaume-Uni">Royaume-Uni</option>
  <option value="Russie">Russie</option>
  <option value="Rwanda">Rwanda</option>
  <option value="Saint-Christophe-et-Niévès">Saint-Christophe-et-Niévès</option>
  <option value="Sainte-Lucie">Sainte-Lucie</option>
  <option value="Saint-Marin">Saint-Marin</option>
  <option value="Saint-Vincent-et-les-Grenadines">Saint-Vincent-et-les-Grenadines</option>
  <option value="Salomon">Salomon</option>
  <option value="Salvador">Salvador</option>
  <option value="Samoa">Samoa</option>
  <option value="Sao Tomé-et-Principe">Sao Tomé-et-Principe</option>
  <option value="Sénégal">Sénégal</option>
  <option value="Serbie">Serbie</option>
  <option value="Seychelles">Seychelles</option>
  <option value="Sierra Leone">Sierra Leone</option>
  <option value="Singapour">Singapour</option>
  <option value="Slovaquie">Slovaquie</option>
  <option value="Slovénie">Slovénie</option>
  <option value="Somalie">Somalie</option>
  <option value="Soudan">Soudan</option>
  <option value="Soudan du Sud">Soudan du Sud</option>
  <option value="Sri Lanka">Sri Lanka</option>
  <option value="Suède">Suède</option>
  <option value="Suisse">Suisse</option>
  <option value="Suriname">Suriname</option>
  <option value="Syrie">Syrie</option>
  <option value="Tadjikistan">Tadjikistan</option>
  <option value="Tanzanie">Tanzanie</option>
  <option value="Tchad">Tchad</option>
  <option value="Tchéquie">Tchéquie</option>
  <option value="Thaïlande">Thaïlande</option>
  <option value="Timor oriental">Timor oriental</option>
  <option value="Togo">Togo</option>
  <option value="Tonga">Tonga</option>
  <option value="Trinité-et-Tobago">Trinité-et-Tobago</option>
  <option value="Tunisie">Tunisie</option>
  <option value="Turkménistan">Turkménistan</option>
  <option value="Turquie">Turquie</option>
  <option value="Tuvalu">Tuvalu</option>
  <option value="Ukraine">Ukraine</option>
  <option value="Uruguay">Uruguay</option>
  <option value="Vanuatu">Vanuatu</option>
  <option value="Vatican">Vatican</option>
  <option value="Venezuela">Venezuela</option>
  <option value="Viêt Nam">Viêt Nam</option>
  <option value="Yémen">Yémen</option>
  <option value="Zambie">Zambie</option>
  <option value="Zimbabwe">Zimbabwe</option>
</select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Informations parents */}
              <div className="card mb-4 bg-light">
                <div className="card-header bg-secondary text-white">
                  <h3 className="h5 mb-0">Informations Parents</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    {/* Père */}
                    <div className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="card-header bg-info bg-opacity-25">
                          <h4 className="h6 mb-0">Père</h4>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label">CIN Père</label>
                              <input 
                                type="text" 
                                value={cinPere} 
                                onChange={e => setCinPere(e.target.value)} 
                                className="form-control" 
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Nom Père</label>
                              <input 
                                type="text" 
                                value={nomPere} 
                                onChange={e => setNomPere(e.target.value)} 
                                className="form-control" 
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Prénom Père</label>
                              <input 
                                type="text" 
                                value={prenomPere} 
                                onChange={e => setPrenomPere(e.target.value)} 
                                className="form-control" 
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Profession Père</label>
                              <input 
                                type="text" 
                                value={professionPere} 
                                onChange={e => setProfessionPere(e.target.value)} 
                                className="form-control" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mère */}
                    <div className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="card-header bg-info bg-opacity-25">
                          <h4 className="h6 mb-0">Mère</h4>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label">CIN Mère</label>
                              <input 
                                type="text" 
                                value={cinMere} 
                                onChange={e => setCinMere(e.target.value)} 
                                className="form-control" 
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Nom Mère</label>
                              <input 
                                type="text" 
                                value={nomMere} 
                                onChange={e => setNomMere(e.target.value)} 
                                className="form-control" 
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Prénom Mère</label>
                              <input 
                                type="text" 
                                value={prenomMere} 
                                onChange={e => setPrenomMere(e.target.value)} 
                                className="form-control" 
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Profession Mère</label>
                              <input 
                                type="text" 
                                value={professionMere}
                                onChange={e => setProfessionMere(e.target.value)} 
                                className="form-control" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Adresse et téléphone parents */}
                    <div className="col-md-6">
                      <label className="form-label">Adresse Parents</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-house"></i></span>
                        <input 
                          type="text" 
                          value={adresseParent} 
                          onChange={e => setAdresseParent(e.target.value)} 
                          className="form-control" 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Téléphone Parents</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                        <input 
                          type="tel" 
                          value={telParent} 
                          onChange={e => setTelParent(e.target.value)} 
                          className="form-control" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Informations académiques */}
              <div className="card mb-4 bg-light">
                <div className="card-header bg-secondary text-white">
                  <h3 className="h5 mb-0">Informations Académiques</h3>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Niveau*</label>
                      <select 
                        value={niveau} 
                        onChange={e => setNiveau(e.target.value)} 
                        className="form-select" 
                        required
                      >
                        <option value="1A">1ère Année</option>
                        <option value="2A">2ème Année</option>
                        <option value="3A">3ème Année</option>
                        <option value="4A">4ème Année</option>
                        <option value="5A">5ème Année</option>
                      </select>
                    </div>

                    {(niveau === '3A' || niveau === '4A' || niveau === '5A') && (
                      <div className="col-md-6">
                        <label className="form-label">Filière*</label>
                        <select 
                          value={filiereId} 
                          onChange={e => setFiliereId(e.target.value)} 
                          className="form-select" 
                          required
                        >
                          <option value="">-- Choisir une filière --</option>
                          {filieres.map(f => (
                            <option key={f.id} value={f.id}>{f.nom}</option>
                          ))}
                        </select>
                      </div>
                    )}
<div className="col-md-6">
                      <label className="form-label">Semestre*</label>
                      <select 
                        value={semestre} 
                        onChange={e => setSemestre(e.target.value)} 
                        className="form-select" 
                        required
                      >
                        <option value="1A">Semestre 2</option>
                        <option value="2A">Semestre 4</option>
                        <option value="3A">Semestre 6</option>
                        <option value="4A">Semestre 8</option>
                        <option value="5A">Semestre 10</option>
                      </select>
                    </div>

                    {/* Baccalauréat */}
                    <div className="col-12 mt-4">
                      <div className="card">
                        <div className="card-header bg-info bg-opacity-25">
                          <h4 className="h6 mb-0">Baccalauréat</h4>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-4">
                              <label className="form-label">Mention</label>
                              <select 
                                value={mentionBac} 
                                onChange={e => setMentionBac(e.target.value)} 
                                className="form-select"
                              >
                                <option value="">-- Sélectionner --</option>
                                <option value="Très bien">Très bien</option>
                                <option value="Bien">Bien</option>
                                <option value="Assez bien">Assez bien</option>
                                <option value="Passable">Passable</option>
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Année</label>
                              <input 
                                type="text" 
                                value={anneeBac} 
                                onChange={e => setAnneeBac(e.target.value)} 
                                placeholder="2023/2024" 
                                className="form-control" 
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Lycée</label>
                              <input 
                                type="text" 
                                value={lycee} 
                                onChange={e => setLycee(e.target.value)} 
                                className="form-control" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Autres informations académiques */}
                    <div className="col-md-6">
                      <label className="form-label">Province (Bac)</label>
                      <input 
                        type="text" 
                        value={provinceName} 
                        onChange={e => setProvinceName(e.target.value)} 
                        className="form-control" 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Université précédente</label>
                      <input 
                        type="text" 
                        value={universite} 
                        onChange={e => setUniversite(e.target.value)} 
                        className="form-control" 
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Année première inscription</label>
                      <input 
                        type="text" 
                        value={anneePremiereInscens} 
                        onChange={e => setAnneePremiereInscens(e.target.value)} 
                        className="form-control" 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Lieu d'inscription précédent</label>
                      <input 
                        type="text" 
                        value={lnscens} 
                        onChange={e => setLnscens(e.target.value)} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 6: Documents */}
              <div className="card mb-4 bg-light">
                <div className="card-header bg-secondary text-white">
                  <h3 className="h5 mb-0">Documents</h3>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Documents scannés : BAC et CNI en un seul fichier PDF (+Attestation d'admission + ⁠⁠Attestation d’admissibilité pour ceux du CNAEM)</label>
                      <input 
                        type="file" 
                        onChange={e => setBacDocument(e.target.files[0])} 
                        className="form-control" 
                        accept=".pdf,.png,.jpg,.jpeg" 
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Photo Étudiant*</label>
                      <input 
                        type="file" 
                        onChange={e => setPhoto(e.target.files[0])} 
                        className="form-control" 
                        accept="image/*" 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`btn btn-lg ${isSubmitting ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
                </button>
                <button 
  type="button" 
  onClick={() => {
    resetForm(); // Réinitialise les valeurs et l'état du formulaire
    setIsSubmitting(false); // Annule l'état de soumission si en cours
  }}
  className="btn btn-lg btn-outline-secondary"
>
  Annuler
</button>
              </div> 
            </form>
          ) : (
            <div className="text-center mt-4">
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EspaceEtudiant;