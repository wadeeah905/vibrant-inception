const generateCssTask = require("../../../gulp-core/gulptaskCore").generateCssTask;

module.exports = function() {
	const cssFiles = [
		"Content/css/custom.css"
	];
	generateCssTask(__filename, cssFiles);
};