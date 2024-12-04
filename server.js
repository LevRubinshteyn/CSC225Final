const express = require('express'); 
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

///the api key obfuscated in a environment variable on my proxy
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL || 'http://98.14.0.58/api';

/// 1ST endpoint (GET)
app.get('/printer', async (req, res) => {
    const response = await fetch(`${BASE_URL}/printer`, {
        headers: { 'X-Api-Key': API_KEY }
    });
    const data = await response.json();
    res.json(data);
});

/// 2ND endpoint (POST) to move the printer
app.post('/move', async (req, res) => {
    const { axis, distance } = req.body;

    ///ensures value is valid
    if (!axis || typeof distance !== 'number') {
        res.status(400).send('Invalid input');
        return;
    }

    await fetch(`${BASE_URL}/printer/command`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': API_KEY
        },
        body: JSON.stringify({ command: 'G91' }) // G91 command enables relative positioning, so the distance is moved from its current location, instead of sending coordinates
    });
    
    //G1 is the command in marlin software to move, and F1500 sets the speed, the axis lettter must be uppercase to meet gcode standards
    const gcodeCommand = `G1 ${axis.toUpperCase()}${distance} F1500`;
    console.log(`Sending G-code: ${gcodeCommand}`);
    await fetch(`${BASE_URL}/printer/command`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': API_KEY
        },
        body: JSON.stringify({ command: gcodeCommand })
    });

    res.send('OK');
});

// 3RD ENDPOINT TO SEND GCODE COMMANDS
app.post('/command', async (req, res) => {
    const { command } = req.body;
    if (!command || typeof command !== 'string') {
        res.status(400).send('Invalid command');
        return;
    }

    await fetch(`${BASE_URL}/printer/command`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': API_KEY
        },
        body: JSON.stringify({ command })
    });

    res.send(`Command "${command}" sent successfully`);
});

/// start the server 3000 dev port
app.listen(3000, () => {
    console.log('Server running on port 3000');
});