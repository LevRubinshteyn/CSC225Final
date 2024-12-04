

// function to fetch distance from input field
function getDistance(inputId) {
    const input = document.getElementById(inputId);
    return parseFloat(input.value) || 0; // return 0 if input is invalid
}
///function to open camera in new tab, had many many issues calling it through the proxy because its http and wont load on https github pages 
function openCamera() {
    window.open('http://98.14.0.58/webcam/?action=stream', '_blank');
}

/// POST endpoint to send GCODE commands to printer console
function sendCommand(command) {
    fetch('https://octoprint-proxy.onrender.com/command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command })
    });
}


///GET endpoint printer data on page load
document.addEventListener("DOMContentLoaded", () => {
    async function getPrinterData() {
        try {
            const response = await fetch('https://octoprint-proxy.onrender.com/printer');
            const data = await response.json();
            document.getElementById('printerStatus').innerText = data.state.text || 'Unknown';
            document.getElementById('printerReady').innerText = data.state.flags.ready ? 'Yes' : 'No';
            document.getElementById('printerOperational').innerText = data.state.flags.operational ? 'Yes' : 'No';
            document.getElementById('printerPrinting').innerText = data.state.flags.printing ? 'Yes' : 'No';
            document.getElementById('bedTemp').innerText = data.temperature.bed.actual || 'N/A';
            document.getElementById('extruderTemp').innerText = data.temperature.tool0.actual || 'N/A';
            } 
            catch (error) 
            {console.error('Error fetching printer data:', error);}
            }

    getPrinterData();
});



///POST endpoint to move printer via user inputted strings axis and distance
async function move(axis, distance) {
    try {
            await fetch('https://octoprint-proxy.onrender.com/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ axis, distance })
        });

    } catch (error)   
            {console.error('Error moving the printer:', error);}
}
