// Main Application JavaScript

// Ring Status Management
class RingStatus {
    constructor() {
        this.batteryLevel = 100;
        this.isConnected = true;
        this.lastLocation = null;
        this.emergencyMode = false;
    }

    updateBattery(level) {
        this.batteryLevel = level;
        document.getElementById('battery-level')?.style.width = `${level}%`;
    }

    updateConnection(status) {
        this.isConnected = status;
        const connectionEl = document.getElementById('connection-status');
        if (connectionEl) {
            connectionEl.className = `status-value ${status ? 'connected' : 'disconnected'}`;
            connectionEl.textContent = status ? 'Connected' : 'Disconnected';
        }
    }

    simulateBatteryDrain() {
        setInterval(() => {
            if (this.batteryLevel > 0) {
                this.updateBattery(this.batteryLevel - 1);
            }
        }, 300000); // Update every 5 minutes
    }
}


// Emergency System
class EmergencySystem {
    constructor() {
        this.active = false;
        this.contacts = [];
        this.currentLocation = null;
    }

    async activateEmergency() {
        this.active = true;
        await this.updateLocation();
        this.notifyContacts();
        this.showEmergencyModal();
        
        // Start continuous location tracking
        this.locationInterval = setInterval(() => this.updateLocation(), 10000);
    }

    async updateLocation() {
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                
                this.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    timestamp: new Date()
                };

                this.updateLocationDisplay();
                return true;
            } catch (error) {
                console.error('Error getting location:', error);
                return false;
            }
        }
        return false;
    }

    updateLocationDisplay() {
        const locationEl = document.getElementById('current-location');
        const timestampEl = document.getElementById('last-updated');
        
        if (locationEl && this.currentLocation) {
            locationEl.textContent = `${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)}`;
        }
        
        if (timestampEl && this.currentLocation) {
            timestampEl.textContent = new Date(this.currentLocation.timestamp).toLocaleString();
        }
    }

    notifyContacts() {
        this.contacts.forEach(contact => {
            // Simulate sending emergency alerts
            console.log(`Emergency alert sent to ${contact.name} at ${contact.phone}`);
        });
    }

    showEmergencyModal() {
        const modal = document.getElementById('emergency-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    deactivateEmergency() {
        this.active = false;
        clearInterval(this.locationInterval);
        
        const modal = document.getElementById('emergency-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Ring Features
class RingFeatures {
    constructor() {
        this.fakeCallActive = false;
        this.alarmActive = false;
    }

    async triggerFakeCall() {
        if (this.fakeCallActive) return;
        
        this.fakeCallActive = true;
        const audio = new Audio('ringtone.mp3');
        audio.loop = true;
        
        try {
            await audio.play();
            
            // Simulate incoming call UI
            const callUI = document.createElement('div');
            callUI.className = 'fake-call-ui';
            callUI.innerHTML = `
                <div class="caller-info">
                    <h3>Incoming Call</h3>
                    <p>Mom</p>
                </div>
                <button onclick="ringFeatures.endFakeCall()">End Call</button>
            `;
            document.body.appendChild(callUI);
            
            // Auto-end call after 30 seconds
            setTimeout(() => this.endFakeCall(), 30000);
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }

    endFakeCall() {
        this.fakeCallActive = false;
        const callUI = document.querySelector('.fake-call-ui');
        if (callUI) {
            callUI.remove();
        }
    }

    toggleAlarm() {
        this.alarmActive = !this.alarmActive;
        if (this.alarmActive) {
            const audio = new Audio('alarm.mp3');
            audio.loop = true;
            audio.play();
        } else {
            // Stop alarm
        }
    }
}

// Initialize Systems
const ringStatus = new RingStatus();
const emergency = new EmergencySystem();
const ringFeatures = new RingFeatures();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize ring status monitoring
    ringStatus.simulateBatteryDrain();
    
    // Set up emergency button
    const sosButton = document.querySelector('.sos-button');
    if (sosButton) {
        sosButton.addEventListener('click', () => emergency.activateEmergency());
    }

    // Set up feature buttons
    const fakeCallBtn = document.querySelector('[onclick="triggerFakeCall()"]');
    if (fakeCallBtn) {
        fakeCallBtn.addEventListener('click', () => ringFeatures.triggerFakeCall());
    }
});

// Gesture Detection for Ring
let tapCount = 0;
let lastTap = 0;

document.addEventListener('touchstart', () => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 500 && tapLength > 0) {
        tapCount++;
        if (tapCount >= 2) {
            emergency.activateEmergency();
            tapCount = 0;
        }
    } else {
        tapCount = 1;
    }
    
    lastTap = currentTime;
});