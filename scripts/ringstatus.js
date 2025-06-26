export class RingStatus {
    constructor() {
        this.batteryLevel = 100;
        this.isConnected = false;
        this.lastSync = new Date();
        this.firmware = '1.0.0';
        this.isCharging = false;
        this.signalStrength = 100;
        
        // Initialize event listeners
        this.initializeListeners();
        // Start battery monitoring
        this.startBatteryMonitoring();
    }

    initializeListeners() {
        // Battery level change
        window.addEventListener('batteryLevelChange', (e) => {
            this.updateBatteryLevel(e.detail.level);
        });

        // Connection status change
        window.addEventListener('connectionChange', (e) => {
            this.updateConnectionStatus(e.detail.connected);
        });
    }

    updateBatteryLevel(level) {
        this.batteryLevel = level;
        this.updateUI();
        
        // Low battery alert
        if (level <= 20 && !this.isCharging) {
            this.showLowBatteryAlert();
        }
    }

    updateConnectionStatus(connected) {
        this.isConnected = connected;
        this.lastSync = new Date();
        this.updateUI();

        if (!connected) {
            this.showDisconnectionAlert();
        }
    }

    startBatteryMonitoring() {
        setInterval(() => {
            if (!this.isCharging && this.batteryLevel > 0) {
                this.batteryLevel--;
                this.updateUI();
            }
        }, 300000); // Check every 5 minutes
    }

    updateUI() {
        // Update battery indicator
        const batteryIndicator = document.getElementById('battery-level');
        if (batteryIndicator) {
            batteryIndicator.style.width = `${this.batteryLevel}%`;
            batteryIndicator.className = `battery-level ${this.batteryLevel <= 20 ? 'low' : ''}`;
        }

        // Update connection status
        const connectionStatus = document.getElementById('connection-status');
        if (connectionStatus) {
            connectionStatus.textContent = this.isConnected ? 'Connected' : 'Disconnected';
            connectionStatus.className = `status ${this.isConnected ? 'connected' : 'disconnected'}`;
        }

        // Update last sync time
        const lastSyncElement = document.getElementById('last-sync');
        if (lastSyncElement) {
            lastSyncElement.textContent = this.lastSync.toLocaleString();
        }

        // Update signal strength
        const signalIndicator = document.getElementById('signal-strength');
        if (signalIndicator) {
            signalIndicator.style.width = `${this.signalStrength}%`;
        }
    }

    showLowBatteryAlert() {
        const alert = {
            title: 'Low Battery',
            message: 'Your Smart Safety Ring battery is below 20%. Please charge soon.',
            type: 'warning'
        };
        this.showAlert(alert);
    }

    showDisconnectionAlert() {
        const alert = {
            title: 'Ring Disconnected',
            message: 'Lost connection to your Smart Safety Ring. Please check if it\'s within range.',
            type: 'error'
        };
        this.showAlert(alert);
    }

    showAlert(alert) {
        // Create alert element
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${alert.type}`;
        alertElement.innerHTML = `
            <h4>${alert.title}</h4>
            <p>${alert.message}</p>
        `;

        // Add to document
        document.body.appendChild(alertElement);

        // Remove after 5 seconds
        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }

    // Public methods for external use
    getBatteryLevel() {
        return this.batteryLevel;
    }

    getConnectionStatus() {
        return this.isConnected;
    }

    getLastSync() {
        return this.lastSync;
    }

    getFirmwareVersion() {
        return this.firmware;
    }
}