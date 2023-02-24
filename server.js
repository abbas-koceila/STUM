// Aller chercher les configurations de l'application
import 'dotenv/config';

// Importer les fichiers et librairies
import express, { json, urlencoded } from 'express';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';


import cors from 'cors';
import cspOption from './csp-options.js';

import passport from 'passport';


import bodyParser from 'body-parser';

import middlewareSse from './middleware-sse.js';
import './authentification.js'
import { addPatient } from './model/utilisateur.js';
import { addUrgence } from './model/stum.js';
import { calculNiveauUrgence, calculScore } from './model/urgence.js'

// Création de la base de données de session
const MemoryStore = memorystore(session);

// Création du serveur
const app = express();
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

// Ajout de middlewares
app.use(bodyParser.json());
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
app.use(session({
    cookie: { maxAge: 1800000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 1800000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());


// Ajouter les routes ici ...
app.get('/', async (request, response) => {
    if (request.user) {
        response.render('home', {
            title: 'home',
            styles: ['/css/style.css'],
            scripts: ['/js/home.js'],
            acceptCookie: request.session.accept,
            user: request.user,
            admin: request.user.id_type_utilisateur == 2,
        });
    }
    else {
        response.redirect('/home')
    }
});


app.get('/Admin', async (request, response) => {
    // if (!request.user) {
    //     response.status(401).end();
    // }
    // else if (request.user.id_type_utilisateur != 2) {
    //     response.status(403).end();
    // }
    // else {
    response.render('index', {
        title: 'index',
        styles: ['/css/Infirmier.css'],
        styles: ['/css/style.css'],
        scripts: ['/js/Admin.js'],
        acceptCookie: request.session.accept,
        user: request.user,
        admin: request.user.id_type_utilisateur == 2,

    });
    //}
});
app.get('/modification', (request, response) => {
    response.render('modification', {
        styles: ['/css/Infirmier.css'],
        styles: ['/css/style.css'],
        scripts: ['/js/Admin.js'],
        acceptCookie: request.session.accept,
        user: request.user,
        count: request.session.accept
    });
});
app.get('/home', (request, response) => {
    response.render('home', {
        titre: 'home',
        styles: ['/css/authentification.css', '/css/style.css'],
        scripts: ['/js/counter.js'],
        acceptCookie: request.session.accept,
        user: request.user,
        count: request.session.accept
    });
});
app.get('/connexion', (request, response) => {
    response.render('Connexion', {
        titre: 'Connexion',
        styles: ['/css/authentification.css', '/css/style.css'],
        scripts: ['/js/connexion.js'],
        acceptCookie: request.session.accept,
        user: request.user,
        count: request.session.accept,


    });
});
app.get('/inscription', (request, response) => {
    response.render('Inscription', {
        titre: 'Inscription',
        styles: ['/css/authentification.css', '/css/style.css'],
        scripts: ['/js/inscription.js'],
        user: request.user,
        acceptCookie: request.session.accept
    });
});


app.get('/patient', async (request, response) => {
    if (request.user) {
        response.render('patient', {
            title: 'Page d\'accueil',
            styles: ['/css/style.css'],

            acceptCookie: request.session.accept,
            user: request.user,
            admin: request.user.id_type_utilisateur == 2,



        });
        console.log(request.user)
    }
    else {
        response.redirect('/Connexion');
    }
});

app.post('/accept', (request, response) => {
    request.session.accept = true;
    response.status(200).end();
});
app.post('/inscription', async (request, response, next) => {
    //mettre la validation  des champs venant du client

    if (true) {
        try {
            await addPatient(request.body.nomUtilisateur, request.body.nom, request.body.prenom, request.body.courriel, request.body.motDePasse, request.body.numeroCarteSante, request.body.numeroTel);
            response.status(200).end();
        }
        catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                console.log(request.body);
                response.status(409).end();
            }
            else {
                next(error);
            }
        }
    } else {
        response.status(400).end();
    }

});
app.post('/connexion', (request, response, next) => {
    if (true) {
        passport.authenticate('local', (error, utilisateur, info) => {
            if (error) {
                next(error);
            }
            else if (!utilisateur) {
                response.status(401).json(info);
            }
            else {
                request.logIn(utilisateur, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        response.status(200).end();

                    }
                })
            }
        })(request, response, next);
    } else {
        response.status(400).end();
    }
});



app.post('/addUrgence', async (req, res) => {

    const data = req.body;
    let id_user=req.user.id_utilisateur;

    console.log(id_user);
   

    let point_urgence = await calculScore(data);
    console.log(point_urgence);
    let niveau_urgence = await calculNiveauUrgence(point_urgence);

    try {
        await addUrgence(niveau_urgence, point_urgence,id_user)
    
        res.status(200).json({ message: 'Emergency added' });
    } catch (error) {
        console.error(error);
        if (error.code === 'SQLITE_CONSTRAINT') {
            res.status(409).json({ message: 'Error while adding emergency' });
        } else {
           // next(error);
           console.error(error);
        }
    }
    });
    
    
    
    
    



app.post('/deconnexion', (request, response, next) => {
    request.logOut((error) => {
        if (error) {
            next(error);
        } else {
            response.redirect('/connexion')
        }
    })
});

//AJOUT DE PHILLIPE 
app.get('/formulaire', async (request, response) => {
    if (request.user) {
        response.render('formulaire', {
            title: 'formulaire',
            styles: ['/css/style.css'],
            scripts: ['/js/emergency_form.js'],
            acceptCookie: request.session.accept,
            user: request.user,
            admin: request.user.id_type_utilisateur == 2,



        });
    }
    else {
        response.redirect('/Connexion');
    }
});

app.get('/changeInfo', async (request, response) => {
    response.render('changeInfo', {
        title: 'Page d\'accueil',
        styles: ['/css/style.css'],
        scripts: ['/js/formulaire.js'],
        acceptCookie: request.session.accept,
        user: request.user,
        admin: request.user.id_type_utilisateur == 2,


    });
});

app.get('/annuler', async (request, response) => {
    response.render('annuler', {
        title: 'Page d\'accueil',
        styles: ['/css/style.css'],
        scripts: ['/js/formulaire.js'],
        acceptCookie: request.session.accept,
        user: request.user,
        admin: request.user.id_type_utilisateur == 2,


    });
});

app.get('/rdvPasse', async (request, response) => {
    response.render('rdvPasse', {
        title: 'Page d\'accueil',
        styles: ['/css/style.css'],
        scripts: ['/js/formulaire.js'],
        acceptCookie: request.session.accept,
        user: request.user,
        admin: request.user.id_type_utilisateur == 2,


    });
});

app.get('/rdvFutur', async (request, response) => {
    response.render('rdvFutur', {
        title: 'Page d\'accueil',
        styles: ['/css/style.css'],
        scripts: ['/js/formulaire.js'],
        acceptCookie: request.session.accept,
        user: request.user,
        admin: request.user.id_type_utilisateur == 2,


    });
});


// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(request.originalUrl + ' not found.');
});


// Démarrage du serveur
app.listen(process.env.PORT);
console.info(`Serveurs démarré:`);
console.info(`http://localhost:${process.env.PORT}`);
