import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA-QAeiONqCX57jmvNiV6usu-ftllnHaIA",
  authDomain: "terminal-d7af0.firebaseapp.com",
  projectId: "terminal-d7af0",
  storageBucket: "terminal-d7af0.firebasestorage.app",
  messagingSenderId: "368550848867",
  appId: "1:368550848867:web:eeea30702312c7fbf5cb56",
  measurementId: "G-6H6265M4EL"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Données de test pour commencer
const categories = [
  {
    id: 1,
    name: 'File Management',
    nameFr: 'Gestion des fichiers',
    color: '#3b82f6',
    language: 'en'
  },
  {
    id: 2,
    name: 'File Management',
    nameFr: 'Gestion des fichiers',
    color: '#3b82f6',
    language: 'fr'
  },
  {
    id: 3,
    name: 'System',
    nameFr: 'Système',
    color: '#ef4444',
    language: 'en'
  },
  {
    id: 4,
    name: 'System',
    nameFr: 'Système',
    color: '#ef4444',
    language: 'fr'
  },
  {
    id: 5,
    name: 'Network',
    nameFr: 'Réseau',
    color: '#10b981',
    language: 'en'
  },
  {
    id: 6,
    name: 'Network',
    nameFr: 'Réseau',
    color: '#10b981',
    language: 'fr'
  }
];

const commands = [
  {
    name: 'ls',
    nameFr: 'ls',
    description: 'List directory contents',
    descriptionFr: 'Lister le contenu du répertoire',
    command: 'ls [options] [file...]',
    categoryId: 1,
    tags: ['file', 'directory', 'listing'],
    language: 'en',
    context: 'File management',
    commonErrors: ['Permission denied', 'No such file or directory'],
    examples: ['ls -la', 'ls /home/user'],
    examplesFr: ['ls -la', 'ls /home/user'],
    createdAt: new Date()
  },
  {
    name: 'ls',
    nameFr: 'ls',
    description: 'List directory contents',
    descriptionFr: 'Lister le contenu du répertoire',
    command: 'ls [options] [file...]',
    categoryId: 2,
    tags: ['file', 'directory', 'listing'],
    language: 'fr',
    context: 'Gestion des fichiers',
    commonErrors: ['Permission refusée', 'Aucun fichier ou répertoire de ce type'],
    examples: ['ls -la', 'ls /home/user'],
    examplesFr: ['ls -la', 'ls /home/user'],
    createdAt: new Date()
  },
  {
    name: 'cd',
    nameFr: 'cd',
    description: 'Change directory',
    descriptionFr: 'Changer de répertoire',
    command: 'cd [directory]',
    categoryId: 1,
    tags: ['navigation', 'directory'],
    language: 'en',
    context: 'File management',
    commonErrors: ['No such file or directory'],
    examples: ['cd /home', 'cd ..'],
    examplesFr: ['cd /home', 'cd ..'],
    createdAt: new Date()
  },
  {
    name: 'cd',
    nameFr: 'cd',
    description: 'Change directory',
    descriptionFr: 'Changer de répertoire',
    command: 'cd [directory]',
    categoryId: 2,
    tags: ['navigation', 'directory'],
    language: 'fr',
    context: 'Gestion des fichiers',
    commonErrors: ['Aucun fichier ou répertoire de ce type'],
    examples: ['cd /home', 'cd ..'],
    examplesFr: ['cd /home', 'cd ..'],
    createdAt: new Date()
  },
  {
    name: 'pwd',
    nameFr: 'pwd',
    description: 'Print working directory',
    descriptionFr: 'Afficher le répertoire de travail actuel',
    command: 'pwd',
    categoryId: 1,
    tags: ['directory', 'path'],
    language: 'en',
    context: 'File management',
    commonErrors: [],
    examples: ['pwd'],
    examplesFr: ['pwd'],
    createdAt: new Date()
  },
  {
    name: 'pwd',
    nameFr: 'pwd',
    description: 'Print working directory',
    descriptionFr: 'Afficher le répertoire de travail actuel',
    command: 'pwd',
    categoryId: 2,
    tags: ['directory', 'path'],
    language: 'fr',
    context: 'Gestion des fichiers',
    commonErrors: [],
    examples: ['pwd'],
    examplesFr: ['pwd'],
    createdAt: new Date()
  },
  {
    name: 'mkdir',
    nameFr: 'mkdir',
    description: 'Make directory',
    descriptionFr: 'Créer un répertoire',
    command: 'mkdir [options] directory...',
    categoryId: 1,
    tags: ['directory', 'create'],
    language: 'en',
    context: 'File management',
    commonErrors: ['Permission denied', 'File exists'],
    examples: ['mkdir newdir', 'mkdir -p parent/child'],
    examplesFr: ['mkdir newdir', 'mkdir -p parent/child'],
    createdAt: new Date()
  },
  {
    name: 'mkdir',
    nameFr: 'mkdir',
    description: 'Make directory',
    descriptionFr: 'Créer un répertoire',
    command: 'mkdir [options] directory...',
    categoryId: 2,
    tags: ['directory', 'create'],
    language: 'fr',
    context: 'Gestion des fichiers',
    commonErrors: ['Permission refusée', 'Le fichier existe'],
    examples: ['mkdir newdir', 'mkdir -p parent/child'],
    examplesFr: ['mkdir newdir', 'mkdir -p parent/child'],
    createdAt: new Date()
  },
  {
    name: 'rm',
    nameFr: 'rm',
    description: 'Remove files or directories',
    descriptionFr: 'Supprimer des fichiers ou répertoires',
    command: 'rm [options] file...',
    categoryId: 1,
    tags: ['file', 'delete', 'remove'],
    language: 'en',
    context: 'File management',
    commonErrors: ['Permission denied', 'No such file or directory'],
    examples: ['rm file.txt', 'rm -rf directory'],
    examplesFr: ['rm file.txt', 'rm -rf directory'],
    createdAt: new Date()
  },
  {
    name: 'rm',
    nameFr: 'rm',
    description: 'Remove files or directories',
    descriptionFr: 'Supprimer des fichiers ou répertoires',
    command: 'rm [options] file...',
    categoryId: 2,
    tags: ['file', 'delete', 'remove'],
    language: 'fr',
    context: 'Gestion des fichiers',
    commonErrors: ['Permission refusée', 'Aucun fichier ou répertoire de ce type'],
    examples: ['rm file.txt', 'rm -rf directory'],
    examplesFr: ['rm file.txt', 'rm -rf directory'],
    createdAt: new Date()
  },
  {
    name: 'cp',
    nameFr: 'cp',
    description: 'Copy files and directories',
    descriptionFr: 'Copier des fichiers et répertoires',
    command: 'cp [options] source... destination',
    categoryId: 1,
    tags: ['file', 'copy'],
    language: 'en',
    context: 'File management',
    commonErrors: ['Permission denied', 'No such file or directory'],
    examples: ['cp file.txt backup/', 'cp -r dir1 dir2'],
    examplesFr: ['cp file.txt backup/', 'cp -r dir1 dir2'],
    createdAt: new Date()
  },
  {
    name: 'cp',
    nameFr: 'cp',
    description: 'Copy files and directories',
    descriptionFr: 'Copier des fichiers et répertoires',
    command: 'cp [options] source... destination',
    categoryId: 2,
    tags: ['file', 'copy'],
    language: 'fr',
    context: 'Gestion des fichiers',
    commonErrors: ['Permission refusée', 'Aucun fichier ou répertoire de ce type'],
    examples: ['cp file.txt backup/', 'cp -r dir1 dir2'],
    examplesFr: ['cp file.txt backup/', 'cp -r dir1 dir2'],
    createdAt: new Date()
  },
  {
    name: 'mv',
    nameFr: 'mv',
    description: 'Move (rename) files',
    descriptionFr: 'Déplacer (renommer) des fichiers',
    command: 'mv [options] source... destination',
    categoryId: 1,
    tags: ['file', 'move', 'rename'],
    language: 'en',
    context: 'File management',
    commonErrors: ['Permission denied', 'No such file or directory'],
    examples: ['mv oldname newname', 'mv file.txt /destination/'],
    examplesFr: ['mv oldname newname', 'mv file.txt /destination/'],
    createdAt: new Date()
  },
  {
    name: 'mv',
    nameFr: 'mv',
    description: 'Move (rename) files',
    descriptionFr: 'Déplacer (renommer) des fichiers',
    command: 'mv [options] source... destination',
    categoryId: 2,
    tags: ['file', 'move', 'rename'],
    language: 'fr',
    context: 'Gestion des fichiers',
    commonErrors: ['Permission refusée', 'Aucun fichier ou répertoire de ce type'],
    examples: ['mv oldname newname', 'mv file.txt /destination/'],
    examplesFr: ['mv oldname newname', 'mv file.txt /destination/'],
    createdAt: new Date()
  },
  {
    name: 'ps',
    nameFr: 'ps',
    description: 'Report process status',
    descriptionFr: 'Afficher l\'état des processus',
    command: 'ps [options]',
    categoryId: 3,
    tags: ['process', 'system'],
    language: 'en',
    context: 'System management',
    commonErrors: [],
    examples: ['ps aux', 'ps -ef'],
    examplesFr: ['ps aux', 'ps -ef'],
    createdAt: new Date()
  },
  {
    name: 'ps',
    nameFr: 'ps',
    description: 'Report process status',
    descriptionFr: 'Afficher l\'état des processus',
    command: 'ps [options]',
    categoryId: 4,
    tags: ['process', 'system'],
    language: 'fr',
    context: 'Gestion du système',
    commonErrors: [],
    examples: ['ps aux', 'ps -ef'],
    examplesFr: ['ps aux', 'ps -ef'],
    createdAt: new Date()
  },
  {
    name: 'kill',
    nameFr: 'kill',
    description: 'Terminate processes',
    descriptionFr: 'Terminer des processus',
    command: 'kill [options] pid...',
    categoryId: 3,
    tags: ['process', 'terminate'],
    language: 'en',
    context: 'System management',
    commonErrors: ['Permission denied', 'No such process'],
    examples: ['kill 1234', 'kill -9 1234'],
    examplesFr: ['kill 1234', 'kill -9 1234'],
    createdAt: new Date()
  },
  {
    name: 'kill',
    nameFr: 'kill',
    description: 'Terminate processes',
    descriptionFr: 'Terminer des processus',
    command: 'kill [options] pid...',
    categoryId: 4,
    tags: ['process', 'terminate'],
    language: 'fr',
    context: 'Gestion du système',
    commonErrors: ['Permission refusée', 'Aucun processus de ce type'],
    examples: ['kill 1234', 'kill -9 1234'],
    examplesFr: ['kill 1234', 'kill -9 1234'],
    createdAt: new Date()
  },
  {
    name: 'ping',
    nameFr: 'ping',
    description: 'Send ICMP ECHO_REQUEST to network hosts',
    descriptionFr: 'Envoyer des requêtes ICMP ECHO_REQUEST aux hôtes réseau',
    command: 'ping [options] destination',
    categoryId: 5,
    tags: ['network', 'connectivity'],
    language: 'en',
    context: 'Network management',
    commonErrors: ['Network is unreachable', 'Name or service not known'],
    examples: ['ping google.com', 'ping -c 4 8.8.8.8'],
    examplesFr: ['ping google.com', 'ping -c 4 8.8.8.8'],
    createdAt: new Date()
  },
  {
    name: 'ping',
    nameFr: 'ping',
    description: 'Send ICMP ECHO_REQUEST to network hosts',
    descriptionFr: 'Envoyer des requêtes ICMP ECHO_REQUEST aux hôtes réseau',
    command: 'ping [options] destination',
    categoryId: 6,
    tags: ['network', 'connectivity'],
    language: 'fr',
    context: 'Gestion du réseau',
    commonErrors: ['Le réseau est inaccessible', 'Nom ou service inconnu'],
    examples: ['ping google.com', 'ping -c 4 8.8.8.8'],
    examplesFr: ['ping google.com', 'ping -c 4 8.8.8.8'],
    createdAt: new Date()
  }
];

async function migrateData() {
  try {
    console.log('🚀 Début de la migration vers Firestore...');
    
    // Migrer les catégories
    console.log('📁 Migration des catégories...');
    for (const category of categories) {
      await addDoc(collection(db, 'categories'), category);
      console.log(`✅ Catégorie ajoutée: ${category.name} (${category.language})`);
    }
    
    // Migrer les commandes
    console.log('💻 Migration des commandes...');
    for (const command of commands) {
      await addDoc(collection(db, 'commands'), command);
      console.log(`✅ Commande ajoutée: ${command.name} (${command.language})`);
    }
    
    console.log('🎉 Migration terminée avec succès !');
    console.log(`📊 ${categories.length} catégories migrées`);
    console.log(`📊 ${commands.length} commandes migrées`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

// Exécuter la migration
migrateData();
