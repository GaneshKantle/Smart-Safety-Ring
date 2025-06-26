// Emergency System Module
export class EmergencySystem {
    constructor() {
      this.emergencyContacts = [];
      this.isEmergencyMode = false;
      this.currentLocation = null;
      this.alertSound = new Audio('../assets/audio/alert.mp3');
    }
  
    // Initialize the emergency system
    async init() {
      try {
        await this.requestPermissions();
        this.setupLocationTracking();
        this.loadEmergencyContacts();
      } catch (error) {
        console.error('Failed to initialize emergency system:', error);
      }
    }
  
    // Request necessary permissions
    async requestPermissions() {
      const permissions = ['geolocation', 'notifications'];
      
      for (const permission of permissions) {
        try {
          const result = await navigator.permissions.query({ name: permission });
          if (result.state === 'denied') {
            throw new Error(`${permission} permission denied`);
          }
        } catch (error) {
          console.error(`Error requesting ${permission} permission:`, error);
          throw error;
        }
      }
    }
  
    // Set up real-time location tracking
    setupLocationTracking() {
      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(
          (position) => {
            this.currentLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            };
          },
          (error) => {
            console.error('Location tracking error:', error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
          }
        );
      }
    }
  
    // Load emergency contacts from storage
    loadEmergencyContacts() {
      const savedContacts = localStorage.getItem('emergencyContacts');
      if (savedContacts) {
        this.emergencyContacts = JSON.parse(savedContacts);
      }
    }
  
    // Add emergency contact
    addEmergencyContact(contact) {
      this.emergencyContacts.push(contact);
      localStorage.setItem('emergencyContacts', JSON.stringify(this.emergencyContacts));
    }
  
    // Trigger emergency mode
    async triggerEmergency() {
      if (this.isEmergencyMode) return;
  
      this.isEmergencyMode = true;
      this.alertSound.play();
  
      // Send alerts to emergency contacts
      await this.sendEmergencyAlerts();
  
      // Start continuous location sharing
      this.startLocationSharing();
    }
  
    // Send emergency alerts to all contacts
    async sendEmergencyAlerts() {
      const alerts = this.emergencyContacts.map(contact => {
        return this.sendAlert(contact);
      });
  
      try {
        await Promise.all(alerts);
        console.log('Emergency alerts sent successfully');
      } catch (error) {
        console.error('Failed to send emergency alerts:', error);
      }
    }
  
    // Send individual alert
    async sendAlert(contact) {
      const message = {
        type: 'EMERGENCY_ALERT',
        timestamp: new Date().toISOString(),
        location: this.currentLocation,
        contact: contact
      };
  
      try {
        // In a real implementation, this would send the alert through your backend
        console.log('Sending emergency alert:', message);
        // await fetch('your-backend-url/emergency-alert', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(message)
        // });
      } catch (error) {
        console.error('Failed to send alert:', error);
        throw error;
      }
    }
  
    // Start continuous location sharing
    startLocationSharing() {
      this.locationSharingInterval = setInterval(() => {
        if (this.currentLocation) {
          this.shareLocation();
        }
      }, 10000); // Update every 10 seconds
    }
  
    // Share current location
    async shareLocation() {
      if (!this.currentLocation) return;
  
      const locationData = {
        type: 'LOCATION_UPDATE',
        timestamp: new Date().toISOString(),
        location: this.currentLocation
      };
  
      try {
        // In a real implementation, this would send the location through your backend
        console.log('Sharing location:', locationData);
        // await fetch('your-backend-url/location-update', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(locationData)
        // });
      } catch (error) {
        console.error('Failed to share location:', error);
      }
    }
  
    // Deactivate emergency mode
    deactivateEmergency() {
      this.isEmergencyMode = false;
      this.alertSound.pause();
      this.alertSound.currentTime = 0;
      clearInterval(this.locationSharingInterval);
    }
  }