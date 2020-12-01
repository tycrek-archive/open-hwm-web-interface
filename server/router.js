const { log, path } = require('./utils');
const fs = require('fs-extra');
const Sass = require('node-sass');
const fetch = require('node-fetch');
const minify = require('@node-minify/core');
const uglify = require('@node-minify/uglify-es');
const router = require('express').Router();

module.exports = router;

//router.use(require('express-fileupload')()); //TODO

// Compile and compress Sass
router.get('/css', (_req, res, next) => {
	Sass.render({
		file: path('../sass/main.scss'),
		outputStyle: 'compressed'
	}, (err, result) => {
		err ? next(err) : res.type('css').send(result.css);
	});
});

// Compress all JavaScript files using Uglify-ES
router.get('*.js', (req, res, next) => {
	fs.readFile(path(`../javascript${req.url}`))
		.then((bytes) => bytes.toString())
		.then((javascript) => minify({ compressor: uglify, content: javascript }))
		.then((minified) => res.type('js').send(minified))
		.catch((err) => next(err));
});

router.get('/data/:address/:port', (req, res) => {
	fetch(`http://${req.params.address}:${req.params.port}/data.json`)
		.then((response) => response.json())
		.then((json) => res.type('json').send(json))
		.catch((err) => res.send(err.message));
});

// All other routes
router.get('*', (req, res, next) => {
	let url = req.url;

	if (url !== '/' && !url.endsWith('/'))
		return res.redirect(301, url + '/');

	let page = url === '/' ? 'index' : url.substring(1, url.length - 1);
	res.render(page, {
		isProd: process.env.NODE_ENV === 'production'
	});
});

// HTTP 404
router.use((_req, res) => res.status(404).send('lol error 404'));

// HTTP 500
router.use((err, _req, res, _next) => {
	log.error(err.stack);
	res.status(500).send('lol error 500');
});