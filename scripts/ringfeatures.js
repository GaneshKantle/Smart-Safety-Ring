  // RingFeatures.js
  export class RingFeatures {
    constructor() {
      this.features = new Map();
      this.initializeFeatures();
    }
  
    initializeFeatures() {
      this.features.set('doubleTap', {
        enabled: true,
        sensitivity: 0.7,
        cooldown: 2000
      });
      
      this.features.set('locationTracking', {
        enabled: true,
        accuracy: 'high',
        interval: 10000
      });
      
      this.features.set('bluetoothConnection', {
        enabled: true,
        autoReconnect: true,
        rssiThreshold: -70
      });
    }
  
    async toggleFeature(featureName, enabled) {
      const feature = this.features.get(featureName);
      if (feature) {
        feature.enabled = enabled;
        await this.saveSettings();
        return true;
      }
      return false;
    }
  
    async updateFeatureSettings(featureName, settings) {
      const feature = this.features.get(featureName);
      if (feature) {
        this.features.set(featureName, { ...feature, ...settings });
        await this.saveSettings();
        return true;
      }
      return false;
    }
  
    async saveSettings() {
      // Simulate saving settings to device
      return new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }
  }