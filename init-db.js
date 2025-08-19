import { db } from './helpers/db.js';
import './loadEnv.js';

async function initDatabase() {
  try {
    console.log('🔄 Initialisation de la base de données...');

    // Création des tables
    await db.schema
      .createTable('users')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
      .addColumn('displayName', 'varchar(255)', (col) => col.notNull())
      .addColumn('avatarUrl', 'varchar(500)')
      .addColumn('role', 'varchar(50)', (col) => col.notNull().defaultTo('user'))
      .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(db.fn.now()))
      .addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(db.fn.now()))
      .execute();

    await db.schema
      .createTable('userPasswords')
      .addColumn('userId', 'integer', (col) => col.references('users.id').onDelete('cascade'))
      .addColumn('passwordHash', 'varchar(255)', (col) => col.notNull())
      .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(db.fn.now()))
      .addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(db.fn.now()))
      .execute();

    await db.schema
      .createTable('sessions')
      .addColumn('id', 'varchar(255)', (col) => col.primaryKey())
      .addColumn('userId', 'integer', (col) => col.references('users.id').onDelete('cascade'))
      .addColumn('createdAt', 'timestamp', (col) => col.notNull())
      .addColumn('lastAccessed', 'timestamp', (col) => col.notNull())
      .addColumn('expiresAt', 'timestamp', (col) => col.notNull())
      .execute();

    await db.schema
      .createTable('loginAttempts')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('email', 'varchar(255)', (col) => col.notNull())
      .addColumn('attemptedAt', 'timestamp', (col) => col.notNull())
      .addColumn('success', 'boolean', (col) => col.notNull().defaultTo(false))
      .addColumn('ipAddress', 'varchar(45)')
      .addColumn('userAgent', 'text')
      .execute();

    await db.schema
      .createTable('categories')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('name', 'varchar(255)', (col) => col.notNull())
      .addColumn('nameFr', 'varchar(255)')
      .addColumn('description', 'text')
      .addColumn('descriptionFr', 'text')
      .addColumn('color', 'varchar(7)')
      .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(db.fn.now()))
      .execute();

    await db.schema
      .createTable('commands')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('categoryId', 'integer', (col) => col.references('categories.id').onDelete('cascade'))
      .addColumn('command', 'varchar(255)', (col) => col.notNull())
      .addColumn('syntax', 'text', (col) => col.notNull())
      .addColumn('description', 'text', (col) => col.notNull())
      .addColumn('descriptionFr', 'text')
      .addColumn('example', 'text')
      .addColumn('exampleFr', 'text')
      .addColumn('context', 'text')
      .addColumn('tags', 'text[]')
      .addColumn('commonErrors', 'text[]')
      .addColumn('solutions', 'text[]')
      .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(db.fn.now()))
      .execute();

    await db.schema
      .createTable('practiceExercises')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('categoryId', 'integer', (col) => col.references('categories.id').onDelete('cascade'))
      .addColumn('title', 'varchar(255)', (col) => col.notNull())
      .addColumn('titleFr', 'varchar(255)')
      .addColumn('description', 'text', (col) => col.notNull())
      .addColumn('descriptionFr', 'text')
      .addColumn('commandToExecute', 'text', (col) => col.notNull())
      .addColumn('expectedOutput', 'text')
      .addColumn('expectedOutputFr', 'text')
      .addColumn('difficulty', 'varchar(50)', (col) => col.notNull())
      .addColumn('hints', 'text[]')
      .addColumn('learningPoints', 'text[]')
      .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(db.fn.now()))
      .execute();

    await db.schema
      .createTable('quizQuestions')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('categoryId', 'integer', (col) => col.references('categories.id').onDelete('cascade'))
      .addColumn('question', 'text', (col) => col.notNull())
      .addColumn('questionFr', 'text')
      .addColumn('questionType', 'varchar(50)', (col) => col.notNull())
      .addColumn('correctAnswer', 'text', (col) => col.notNull())
      .addColumn('wrongAnswers', 'text[]')
      .addColumn('explanation', 'text', (col) => col.notNull())
      .addColumn('explanationFr', 'text')
      .addColumn('difficulty', 'varchar(50)', (col) => col.notNull())
      .addColumn('points', 'integer', (col) => col.defaultTo(1))
      .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(db.fn.now()))
      .execute();

    await db.schema
      .createTable('userPracticeProgress')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('sessionId', 'varchar(255)', (col) => col.notNull())
      .addColumn('exerciseId', 'integer', (col) => col.references('practiceExercises.id').onDelete('cascade'))
      .addColumn('completed', 'boolean', (col) => col.defaultTo(false))
      .addColumn('attempts', 'integer', (col) => col.defaultTo(0))
      .addColumn('completedAt', 'timestamp')
      .execute();

    await db.schema
      .createTable('userQuizResults')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('sessionId', 'varchar(255)', (col) => col.notNull())
      .addColumn('categoryId', 'integer', (col) => col.references('categories.id').onDelete('cascade'))
      .addColumn('difficulty', 'varchar(50)', (col) => col.notNull())
      .addColumn('score', 'integer', (col) => col.notNull())
      .addColumn('totalQuestions', 'integer', (col) => col.notNull())
      .addColumn('passed', 'boolean', (col) => col.notNull())
      .addColumn('completedAt', 'timestamp', (col) => col.defaultTo(db.fn.now()))
      .execute();

    await db.schema
      .createTable('userSessions')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('sessionId', 'varchar(255)', (col) => col.notNull())
      .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(db.fn.now()))
      .execute();

    console.log('✅ Base de données initialisée avec succès !');
    
    // Création d'un utilisateur de test
    const { hash } = await import('bcryptjs');
    const passwordHash = await hash('password123', 10);
    
    await db
      .insertInto('users')
      .values({
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'user'
      })
      .execute();

    const user = await db
      .selectFrom('users')
      .select('id')
      .where('email', '=', 'test@example.com')
      .executeTakeFirst();

    if (user) {
      await db
        .insertInto('userPasswords')
        .values({
          userId: user.id,
          passwordHash: passwordHash
        })
        .execute();
      
      console.log('✅ Utilisateur de test créé : test@example.com / password123');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    await db.destroy();
  }
}

initDatabase();
