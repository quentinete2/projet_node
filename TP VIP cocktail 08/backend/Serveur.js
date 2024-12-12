const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.connection.once('open', () => {
    console.log("Connexion à la base de données effectué");
});
mongoose.connection.on('error', () => {
    console.log("Erreur dans la BDD");
});
mongoose.connect("mongodb://127.0.0.1:27017/VIP_cocktail");
const Personne = mongoose.model('Personne', { name: String, first_name: String, statut: { type: Boolean, default: false }}, 'personnes');
const app = express();
app.use(cors());
app.use(express.json());


app.get('/personnes', async (request, response) => {
    const personnes = await Personne.find();
    return response.json(personnes);
});

app.get('/personne/:id', async (request, response) => {
    const idParam = request.params.id;
    const foundPersonne = await Personne.findOne({'_id' : idParam});
    if (!foundPersonne){
        return response.json({ code : "701" });
    }
    return response.json(foundPersonne); 
});
app.post("/save-personne", async (request, response) => {
    const personne_json = request.body;
    const newPersonne = new Personne(personne_json);
    await newPersonne.save();
    return response.json(newPersonne);
});
app.delete('/personne/:id', async (req, res) => {
    const personneId = req.params.id;
    code = "1"
    const deletePersonne = await Personne.findByIdAndDelete(personneId);
    if (!deletePersonne) {
        code = "200"
        return res.status(404).json({ error: "Personne non trouvé" });
    }
    return res.status(200).json({code: "200"});
});
app.put('/personne/:id', async (req, res) => {
    const idParam = req.params.id;
    const updatedData = req.body;
    try {
        const updatedPersonne = await Personne.findByIdAndUpdate(
            idParam,
            updatedData,
            { new: true }
        );
        if (!updatedPersonne) {
            return res.status(404).json({ error: "Personne non trouvée" });
        }
        return res.status(200).json(updatedPersonne);
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
});
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});