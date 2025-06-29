<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reçu d'inscription</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .info { margin-bottom: 15px; }
        .signature { margin-top: 50px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <div class="header">
  
        <h1>ATTESTATION DE POURSUITE D'ÉTUDES</h1>
        <p>Le Directeur de l’École Nationale de Commerce et de Gestion de Fès atteste que l’étudiant(e) :
        </p>
    </div>

    <div class="info">
        <p><strong>Nom et prénom:</strong> {{ $inscription->nom_fr }} {{ $inscription->prenom_fr }}</p>
        <p><strong>CODE MASSAR/CNE:</strong> {{ $inscription->cne }}</p>
        <p><strong>CIN:</strong> {{ $inscription->cin }}</p>
        <p><strong>Né(e) le:</strong> {{ $inscription->dateNaissance }} <strong>  à:</strong> {{ $inscription->lieuNaissance_fr }}</p>
        <p><strong>Poursuit ses études au</strong> {{ $inscription->semestre }}des Études Préparatoires en Commerce et Gestion à l'E.N.C.G FES</p>
        <p><strong>Filière :</strong> {{ $inscription->filiere_id }}</p>
        <p><strong>Année universitaire:</strong> {{ $inscription->annee_universitaire }}</p>
        <p> La présente attestation est délivrée suite à la demande de l'intéressé(e) pour servir et valoir ce que
de droit.</p>
        <p><strong>  Fait à Fès Le :</strong> {{ $date }}</p>
    </div>
<p>____________________________________________________________________________________________________</p>
    
</body>
</html>