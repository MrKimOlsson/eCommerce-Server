const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // För login -- haschar lösenordet

// Register
router.post('/register', async (req, res) => {
    
    try {
        console.log('user/signup förfrågan');

        // Ta ut namn och lösenord från body
        const name = req.body.name;
        const pass = req.body.pass;

        // Kolla om användaren redan finns i databasen
        const finnsRedan = await User.findOne({ username: name });
        
        if (finnsRedan) {
            console.log("Användare finns redan!");
            res.status(400).send("Användarnamnet finns redan!");
            return; // Hoppa ut om det redan finns en användare
        }

        // Hascha lösenordet innan det sparas
        const hashatPw = await bcrypt.hash(pass, 10);
        console.log("Hashat lösenord: ", hashatPw);

        // Skapa och spara användaren i databasen
        const newUser = new User({
            username: name,
            password: hashatPw,
        });

        await newUser.save(); // spara till databasen

        // skicka svar
        res.status(201).send('Användare registrerad');

    } catch (err) {
        console.error('fel vid registrering:', err);
        res.status(500).send('Kunde inte registrera användaren');
    }
});

// Login 
router.post('/login', async (req, res) => {
    try {
        console.log("trying to login");
        // Hämta användarnamn och lösenord från request
        const name = req.body.name;
        const pass = req.body.pass;

        // Leta efter användaren i databasen
        const user = await User.findOne({ username: name });

        console.log('user found');

        if (!user) {
            res.status(400).send("Användaren finns inte.");
            return;
        }

        // Jämför lösenordet med det hashed lösenord
        const samePw = await bcrypt.compare(pass, user.password);
        console.log('found password');
        if (!samePw) {
            res.status(400).send("Fel lösenord.");
            return;
        }

        res.status(201).send('Inloggad');
    } catch (err) {
        console.error('fel vid registrering:', err);
        res.status(500).send('Kunde inte registrera användaren');
    }

});

module.exports = router;