// Création de la classe Personne avec les paramètres prénom, nom et statut (par défaut à false)
class Personne {
  constructor(prenom, nom, statut = false) {
      this.prenom = prenom;  // Attribue le prénom à la personne
      this.nom = nom;        // Attribue le nom à la personne
      this.statut = statut;  // Définit le statut de la personne (par défaut à false)
  }
}

// Création d'un tableau `personnes` récupéré du localStorage ou vide si non disponible
const personnes = JSON.parse(localStorage.getItem('personnes')) || [];

// Fonction pour supprimer une personne par son ID depuis la base de données
function enleverPersonne(id) {
  // Envoie une requête DELETE pour supprimer la personne par son ID
  axios.delete(`http://127.0.0.1:3000/personne/${id}`)
    .then(response => {
      console.log('La personne a bien était supprimée:', response.data); // Affiche la réponse de l'API après la suppression
      afficherPersonnes();  // Met à jour l'affichage de la liste des personnes
    })
    .catch(error => {
      console.error("La personne n'a pas pu être surimer:", error); // Gère les erreurs
    });
}

// Fonction pour ajouter une personne à la base de données
function ajouterPersonne(prenom, nom) {
  // Crée un objet représentant une nouvelle personne à partir des paramètres
  const Newpers = { first_name: prenom, name: nom, statut: false };
  console.log(Newpers); // Affiche dans la console les données de la nouvelle personne
  // Envoie une requête POST pour ajouter la personne à la base de données
  axios.post('http://127.0.0.1:3000/save-personne', Newpers)
    .then(response => {
      console.log('Personne ajoutée avec succès:', response.data); // Affiche la réponse de l'API après l'ajout
      afficherPersonnes();  // Met à jour la liste des personnes affichées
      document.getElementById('prenom').value = ''; // Réinitialise le champ prénom
      document.getElementById('nom').value = '';    // Réinitialise le champ nom
    })
    .catch(error => {
      console.error("Erreur lors de l'ajout :", error); // Gère les erreurs d'ajout
    });
}

// Fonction pour changer le statut (actif/inactif) d'une personne
function changerStatut(id, statut) {
  // Envoie une requête PUT pour mettre à jour le statut d'une personne
  axios.put(`http://127.0.0.1:3000/personne/${id}`, { statut })
    .then(response => {
      console.log('Statut mis à jour:', response.data); // Affiche la réponse après mise à jour
      afficherPersonnes();  // Met à jour la liste des personnes affichées
    })
    .catch(error => {
      console.error('Erreur lors du changement de statut:', error); // Gère les erreurs de mise à jour du statut
    });
}

// Fonction pour afficher toutes les personnes dans la table
function afficherPersonnes() {
  // Envoie une requête GET pour récupérer toutes les personnes de la base de données
  axios.get('http://127.0.0.1:3000/personnes')
    .then(response => {
      const personnes = response.data; // Récupère les données des personnes depuis l'API
      if (!Array.isArray(personnes)) {
        console.error("La réponse de l'API n'est pas un tableau :", personnes);
        alert("Erreur lors de la récupération des données.");
        return;  // Si la réponse n'est pas un tableau, arrête l'exécution de la fonction
      }
      console.log(personnes)
      const tbody = document.getElementById('myTbody'); // Récupère le corps de la table
      tbody.innerHTML = ''; // Vide le contenu existant de la table

      // Parcours chaque personne et crée une ligne de tableau pour l'afficher
      personnes.forEach((personne, index) => {
        const template = document.getElementById('templateTr'); // Récupère le modèle de ligne
        const tr = template.content.cloneNode(true).querySelector('tr'); // Clone la ligne de modèle

        // Remplit les cellules de la ligne avec les informations de la personne
        tr.children[0].textContent = personne.first_name; // Prénom
        tr.children[1].textContent = personne.name;        // Nom
        tr.classList.add(personne.statut ? 'table-success' : 'table-danger'); // Ajoute une classe selon le statut

        // Ajout de l'événement pour supprimer la personne
        const btndelete = tr.children[2].querySelector('button');
        btndelete.addEventListener('click', () => {
          enleverPersonne(personne._id); // Supprime la personne en cliquant sur le bouton
        });

        // Ajout de l'événement pour changer le statut de la personne
        const btnChangerStatut = tr.children[3].querySelector('button');
        btnChangerStatut.onclick = () => {
          changerStatut(personne._id, !personne.statut); // Change le statut de la personne
        };

        tbody.appendChild(tr); // Ajoute la ligne à la table
      });
    })
    .catch(error => {
      console.error("Erreur lors de l'affichage des personnes:", error); // Gère les erreurs d'affichage
      alert("Erreur lors de la récupération des données (l'API peut être désactiver)"); // Alerte utilisateur en cas d'erreur
    });
}

// Fonction pour gérer l'événement de l'ajout d'une personne
function initAjouterPersonne() {
  // Récupère le bouton "Ajouter" et lui ajoute un événement "click"
  const btnAjouter = document.getElementById('btnAjouter');
  btnAjouter.addEventListener('click', () => {
    // Récupère les valeurs des champs prénom et nom
    const prenom = document.getElementById('prenom').value;
    const nom = document.getElementById('nom').value;

    // Vérifie si les champs sont remplis
    if (prenom && nom) {
      ajouterPersonne(prenom, nom); // Appelle la fonction d'ajout de personne
    } else {
      alert("Veuillez entrer un prénom et un nom."); // Alerte si les champs sont vides
    }
  });
}
// Lance l'affichage des personnes et initialise l'ajout au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
  afficherPersonnes();  // Affiche les personnes au chargement
  initAjouterPersonne(); // Initialise l'ajout de personnes
});





