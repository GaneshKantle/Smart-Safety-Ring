// Emergency Contact List
const emergencyContacts = [
    { name: 'Emergency Services', number: '911' },
    // Add more emergency contacts as needed
];

// Geolocation coordinates
let currentLat = null;
let currentLng = null;

// SOS Function
function sendSOS() {
    const sosButton = document.querySelector('#sos button');
    sosButton.classList.add('pulse');
    sosButton.textContent = 'SOS Activated!';
    sosButton.style.background = 'var(--emergency-color)';
    
    // Get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                currentLat = position.coords.latitude;
                currentLng = position.coords.longitude;
                
                // Simulate sending emergency alert
                console.log(`Emergency alert sent with location: ${currentLat}, ${currentLng}`);
                
                // Simulate contacting emergency services
                emergencyContacts.forEach(contact => {
                    console.log(`Alerting ${contact.name} at ${contact.number}`);
                });
                
                // Show alert
                showAlert('Emergency services and contacts have been notified!', 'emergency');
            },
            error => {
                console.error('Error getting location:', error);
                showAlert('Unable to get location. Emergency contacts notified!', 'warning');
            }
        );
    }
    
    // Reset button after 5 seconds
    setTimeout(() => {
        sosButton.classList.remove('pulse');
        sosButton.textContent = 'Activate SOS';
        sosButton.style.background = 'var(--emergency-color)';
    }, 5000);
}

// Live Location Sharing
function shareLocation() {
    const locationButton = document.querySelector('#location button');
    locationButton.classList.add('shake');
    
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            position => {
                currentLat = position.coords.latitude;
                currentLng = position.coords.longitude;
                
                // Simulate sharing location
                console.log(`Sharing location: ${currentLat}, ${currentLng}`);
                showAlert('Location is being shared with trusted contacts', 'safe');
            },
            error => {
                console.error('Error sharing location:', error);
                showAlert('Unable to share location', 'warning');
            }
        );
    }
    
    setTimeout(() => locationButton.classList.remove('shake'), 500);
}

// Fake Call Feature
function triggerFakeCall() {
    const fakeCallButton = document.querySelector('#fake-call button');
    fakeCallButton.textContent = 'Incoming Call...';
    fakeCallButton.disabled = true;
    
    // Simulate phone vibration
    navigator.vibrate && navigator.vibrate([200, 100, 200]);
    
    // Create fake call audio
    const audio = new Audio('ringtone.mp3'); // Add your ringtone file
    audio.loop = true;
    audio.play().catch(e => console.log('Audio playback failed:', e));
    
    // Show fake caller UI
    showFakeCallerUI();
    
    // Reset after 30 seconds
    setTimeout(() => {
        fakeCallButton.textContent = 'Trigger Fake Call';
        fakeCallButton.disabled = false;
        audio.pause();
        hideFakeCallerUI();
    }, 30000);
}

// Safe Route Navigation
function navigateSafely() {
    const routeButton = document.querySelector('#safe-route button');
    routeButton.classList.add('pulse');
    
    // Get current and destination locations
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                currentLat = position.coords.latitude;
                currentLng = position.coords.longitude;
                
                // Simulate calculating safe route
                console.log(`Calculating safe route from: ${currentLat}, ${currentLng}`);
                showAlert('Safe route calculated! Avoiding unsafe areas.', 'safe');
            },
            error => {
                console.error('Error getting location:', error);
                showAlert('Unable to calculate safe route', 'warning');
            }
        );
    }
    
    setTimeout(() => routeButton.classList.remove('pulse'), 2000);
}

// Smart Safety Ring Alert
function triggerRingAlert() {
    const ringButton = document.querySelector('#ring button');
    ringButton.classList.add('shake');
    
    // Simulate ring alert
    showAlert('Safety Ring Alert Activated! Notifying emergency contacts.', 'emergency');
    
    // Get and share location
    shareLocation();
    
    setTimeout(() => ringButton.classList.remove('shake'), 500);
}

// Utility Functions
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    // Remove alert after 5 seconds
    setTimeout(() => alertDiv.remove(), 5000);
}

function showFakeCallerUI() {
    const callerUI = document.createElement('div');
    callerUI.className = 'fake-caller-ui';
    callerUI.innerHTML = `
        <div class="caller-info">
            <h3>Incoming Call</h3>
            <p>Mom</p>
        </div>
        <div class="caller-actions">
            <button onclick="hideFakeCallerUI()">End Call</button>
        </div>
    `;
    document.body.appendChild(callerUI);
}

function hideFakeCallerUI() {
    const callerUI = document.querySelector('.fake-caller-ui');
    if (callerUI) callerUI.remove();
}

// Add event listeners when document loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips or other UI elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => button.classList.add('hover'));
        button.addEventListener('mouseleave', () => button.classList.remove('hover'));
    });
});