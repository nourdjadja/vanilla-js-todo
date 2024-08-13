# vanilla-js-todo
A pretty basic vanilla-js todolist webapp featuring a basic SQLite3 database and ExpressJS endpoints.

# English
Welcome to the Simple TodoList WebApp! 🌟 This is a straightforward application built with Node.js and SQLite3 to help you manage your daily tasks. Each user has their own space where they can log in, manage their tasks, and have their sessions persist between visits.


## Setup
Clone the repository

git clone https://github.com/your-username/todolist-webapp.git


## Install the dependencies

npm install


## Start the server

node server.js


## Features
User Authentication: Register and log in to manage your personal todo list. 🔒
Session Management: User sessions are stored in a local SQLite3 database, ensuring that your todos are linked to your account. 📦
Task Management: Add, delete, and view tasks. The middleware ensures that tasks are correctly associated with the logged-in user. 📋

## Project Structure
server.js: The main server file that handles routes and server setup. 🌐
public/: Contains static assets like HTML, CSS, and JavaScript. 📁
utils/: Contains utility functions like password hashing. 🛠️



# Français
Bienvenue dans la Simple TodoList WebApp ! 🌟 Il s'agit d'une application simple construite avec Node.js et SQLite3 pour vous aider à gérer vos tâches quotidiennes. Chaque utilisateur dispose de son propre espace où il peut se connecter, gérer ses tâches et conserver ses sessions d'une visite à l'autre.

## Installation
Clonez le dépôt


git clone https://github.com/votre-nom-utilisateur/todolist-webapp.git
#Installez les dépendances


npm install
## Lancez le serveur

node server.js


## Fonctionnalités
Authentification des utilisateurs: Inscrivez-vous et connectez-vous pour gérer votre liste de tâches personnelle. 🔒
Gestion des sessions: Les sessions utilisateur sont stockées dans une base de données SQLite3 locale, garantissant que vos tâches sont liées à votre compte. 📦
Gestion des tâches: Ajoutez, supprimez et affichez les tâches. Le middleware s'assure que les tâches sont correctement associées à l'utilisateur connecté. 📋


## Structure du projet
server.js: Le fichier principal du serveur qui gère les routes et la configuration du serveur. 🌐
public/: Contient les fichiers statiques comme HTML, CSS et JavaScript. 📁
utils/: Contient des fonctions utilitaires comme le hachage des mots de passe. 🛠️
Développé avec passion et café par NABD. ☕️
