// Import.
let fs = require('fs');

/**
 * Log to file.
 * @param {string} text - Text to log.
 * @param {string} [file] - Log file path.
 */
function logToFile(text, file) {
	// Define file name.
	let filename = file !== undefined ? file : 'log.txt';
	// Define log text.
	let logText = text + '\r\n';
	// Save log to file.
	fs.appendFile(filename, logText, 'utf8', function(err) {
		if (err) {
			// If error - show in console.
			console.log(err);
		}
	});
}

// Export.
module.exports = logToFile;
