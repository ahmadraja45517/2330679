const fs = require('fs');
const path = require('path');

// This will create a log file in the same folder
const logFilePath = path.join(__dirname, 'application.log');

const logger = {
    info: (message) => {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[INFO] [${timestamp}] ${message}\n`;
        
        // Print to terminal without using console.log
        process.stdout.write(formattedMessage);
        
        // Save to file
        fs.appendFileSync(logFilePath, formattedMessage);
    },
    error: (message) => {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[ERROR] [${timestamp}] ${message}\n`;
        
        // Print to terminal error stream without using console.error
        process.stderr.write(formattedMessage);
        
        // Save to file
        fs.appendFileSync(logFilePath, formattedMessage);
    }
};

module.exports = logger;