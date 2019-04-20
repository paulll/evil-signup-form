const { src, dest, parallel } = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');

const html = () => src('views/*.pug')
	.pipe(pug())
	.pipe(dest('site'));

const css = () => src(['style/*.styl', 'style/*.css'])
	.pipe(stylus({compress: true}))
	.pipe(dest('site/style'));

const assets = () => src('assets/**/*')
	.pipe(dest('site'));

exports.default = parallel(html, assets, css);