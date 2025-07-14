const generateCssTask = require("../../../gulp-core/gulptaskCore").generateCssTask;

module.exports = function () {
	const cssFiles = [
		"Content/css/style.css"
	];

	generateCssTask(__filename, cssFiles);

};
