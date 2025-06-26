// Gesture Detection Module for Smart Ring
export class GestureDetection {
    constructor() {
      this.tapThreshold = 300; // Maximum time between taps (ms)
      this.lastTapTime = 0;
      this.tapCount = 0;
      this.accelerometer = null;
      this.isListening = false;
      this.gestureCallbacks = new Map();
    }
  
    // Initialize gesture detection
    async init() {
      try {
        await this.setupAccelerometer();
        this.startListening();
      } catch (error) {
        console.error('Failed to initialize gesture detection:', error);
        throw error;
      }
    }
  
    // Set up accelerometer
    async setupAccelerometer() {
      if ('Accelerometer' in window) {
        try {
          this.accelerometer = new Accelerometer({ frequency: 60 });
          await this.accelerometer.start();
        } catch (error) {
          console.error('Accelerometer setup failed:', error);
          throw error;
        }
      } else {
        throw new Error('Accelerometer not supported');
      }
    }
  
    // Start listening for gestures
    startListening() {
      if (this.isListening) return;
      
      this.isListening = true;
      this.accelerometer.addEventListener('reading', () => {
        this.processAccelerometerData({
          x: this.accelerometer.x,
          y: this.accelerometer.y,
          z: this.accelerometer.z
        });
      });
    }
  
    // Stop listening for gestures
    stopListening() {
      if (!this.isListening) return;
      
      this.isListening = false;
      this.accelerometer.stop();
    }
  
    // Process accelerometer data
    processAccelerometerData(data) {
      const magnitude = Math.sqrt(
        data.x * data.x + 
        data.y * data.y + 
        data.z * data.z
      );
  
      // Detect tap based on acceleration magnitude
      if (magnitude > 20) { // Threshold for tap detection
        const currentTime = Date.now();
        
        if (currentTime - this.lastTapTime <= this.tapThreshold) {
          this.tapCount++;
          
          if (this.tapCount === 2) {
            this.handleDoubleTap();
            this.tapCount = 0;
          }
        } else {
          this.tapCount = 1;
        }
        
        this.lastTapTime = currentTime;
      }
    }
  
    // Handle double tap gesture
    handleDoubleTap() {
      const callback = this.gestureCallbacks.get('doubleTap');
      if (callback) {
        callback();
      }
    }
  
    // Register gesture callback
    onGesture(gestureName, callback) {
      this.gestureCallbacks.set(gestureName, callback);
    }
  
    // Remove gesture callback
    removeGesture(gestureName) {
      this.gestureCallbacks.delete(gestureName);
    }
  
    // Calibrate gesture detection
    calibrate() {
      // Reset tap detection parameters
      this.tapCount = 0;
      this.lastTapTime = 0;
      
      // Adjust sensitivity based on user testing
      // This would typically involve collecting sample data
      // and adjusting thresholds accordingly
    }
  }