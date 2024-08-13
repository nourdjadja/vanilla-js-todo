import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { hashPassword } from './utils/encryption.js';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const SQLiteStore = connectSqlite3(session);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store: new SQLiteStore({
        db: 'sessions.db',
        table: 'sessions'
    }),
    secret: 'votre_clé_secrète',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'Lax',
    }
}));

const db = new sqlite3.Database(path.join(__dirname, 'todo.db'), (err) => {
    if (err) {
        console.error('Impossible d\'ouvrir la base de données : ' + err.message);
    } else {
        console.log('Connexion réussie à la base de données SQLite.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS task (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        content TEXT NOT NULL,
        userId INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id)
    )`);
});

const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send('Veuillez vous connecter.');
    }
    next();
};

app.post('/tasks', authMiddleware, (req, res) => {
    const { content } = req.body;
    const userId = req.session.userId;

    if (!content) {
        return res.status(400).json({ error: 'Le contenu de la tâche est requis.' });
    }

    const stmt = db.prepare('INSERT INTO task (content, userId) VALUES (?, ?)');
    stmt.run(content, userId, function (err) {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la création de la tâche : ' + err.message });
        }
        res.status(201).json({ id: this.lastID, content });
    });
});

app.get('/tasks', authMiddleware, (req, res) => {
    const userId = req.session.userId;

    const query = 'SELECT * FROM task WHERE userId = ?';
    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des tâches : ' + err.message });
        }
        res.json(rows);
    });
});

app.delete('/tasks/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM task WHERE id = ?');
    stmt.run(id, function (err) {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression de la tâche : ' + err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tâche introuvable avec cet ID.' });
        }
        res.status(204).end();
    });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        stmt.run(username, hashedPassword, (err) => {
            if (err) {
                return res.status(500).send('Le nom d\'utilisateur existe déjà.');
            }
            res.status(201).send('Inscription réussie.');
        });
        stmt.finalize();
    } catch (error) {
        res.status(500).send('Erreur lors de l\'inscription.');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    stmt.get(username, async (err, user) => {
        if (err || !user) {
            return res.status(400).send('Identifiants incorrects.');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Identifiants incorrects.');
        }

        req.session.userId = user.id;
        res.status(200).send('Connexion réussie !');
    });
    stmt.finalize();
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erreur lors de la déconnexion.');
        }
        res.clearCookie('connect.sid');
        res.status(200).send('Déconnexion réussie.');
    });
});

app.get('/check-session', (req, res) => {
    if (req.session.userId) {
        res.status(200).send('Session active.');
    } else {
        res.status(401).send('Pas de session active.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
