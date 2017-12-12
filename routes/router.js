const router = require('express').Router();
const scrapeHandler = require('./handlers/scrape-handler');

router.get('/', (req, res) => res.send('Welcome to butterknife'));

router.get('/scrape', (req, res) => scrapeHandler(req, res));

router.get('*', (req, res) => res.redirect('/'));

module.exports = router;