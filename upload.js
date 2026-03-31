const noblox = require('noblox.js');
const fs = require('fs');
const path = require('path');

// Command line arguments:
// node upload.js <modelFilePath> <name> <description> [groupId] <cookie>
// All arguments are required except groupId (optional).
async function main() {
    const args = process.argv.slice(2);
    if (args.length < 4) {
        console.error('Usage: node upload.js <modelFilePath> <name> <description> [groupId] <cookie>');
        process.exit(1);
    }

    const modelPath = args[0];
    const name = args[1];
    const description = args[2];
    let groupId = null;
    let cookieIndex = 3;

    // If the third argument is a number, treat it as groupId
    if (!isNaN(parseInt(args[3]))) {
        groupId = parseInt(args[3]);
        cookieIndex = 4;
    }

    const cookie = args[cookieIndex];
    if (!cookie) {
        console.error('Cookie not provided');
        process.exit(1);
    }

    try {
        // Set cookie for authentication
        await noblox.setCookie(cookie);

        // Read model file as a stream (supports large files)
        const modelStream = fs.createReadStream(modelPath);

        // Upload options
        const options = {
            name: name,
            description: description,
            copyLocked: false,      // allow copying? adjust as needed
            allowComments: false    // allow comments? adjust as needed
        };
        if (groupId) {
            options.groupId = groupId;
        }

        // Upload the model
        const uploadResult = await noblox.uploadModel(modelStream, options);
        // uploadResult is an object: { assetId, ... } according to noblox.js docs

        // Output the asset ID as JSON
        console.log(JSON.stringify({ success: true, assetId: uploadResult.assetId }));
    } catch (err) {
        console.error(JSON.stringify({ success: false, error: err.message }));
        process.exit(1);
    }
}

main();