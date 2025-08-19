const functions = require('firebase-functions');
const { Hono } = require('hono');

const app = new Hono();

// API pour les commandes
app.get('_api/commands', async c => {
  try {
    const { handle } = require("../endpoints/commands_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message, 500)
  }
});

// API pour les catégories
app.get('_api/categories', async c => {
  try {
    const { handle } = require("../endpoints/categories_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message, 500)
  }
});

// API pour les exercices pratiques
app.get('_api/practice-exercises', async c => {
  try {
    const { handle } = require("../endpoints/practice-exercises_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message, 500)
  }
});

// API pour sauvegarder la progression
app.post('_api/practice-progress', async c => {
  try {
    const { handle } = require("../endpoints/practice-progress_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message, 500)
  }
});

// Export de la fonction Firebase
exports.api = functions.https.onRequest((req, res) => {
  return app.fetch(req, res);
});
