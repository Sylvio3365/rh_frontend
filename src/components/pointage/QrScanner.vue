<template>
  <div class="qr-scanner">
    <div class="scanner-container">
      <h3>📷 Scanner le QR Code</h3>
      
      <!-- Zone de scan vidéo -->
      <div class="video-container">
        <video ref="video" class="scanner-video" autoplay playsinline></video>
        <div class="scanner-overlay">
          <div class="scanner-frame"></div>
        </div>
      </div>

      <!-- Boutons de contrôle -->
      <div class="scanner-controls">
        <button 
          v-if="!isScanning" 
          @click="startScanning" 
          class="btn-scan"
        >
          📷 Démarrer le scan
        </button>
        <button 
          v-else 
          @click="stopScanning" 
          class="btn-stop"
        >
          ⏹️ Arrêter le scan
        </button>
      </div>

      <!-- Message de statut -->
      <div v-if="statusMessage" :class="['status-message', statusType]">
        {{ statusMessage }}
      </div>

      <!-- Canvas caché pour le traitement -->
      <canvas ref="canvas" style="display: none;"></canvas>
    </div>
  </div>
</template>

<script>
import jsQR from 'jsqr';

export default {
  name: 'QrScanner',
  emits: ['scanned'],
  data() {
    return {
      isScanning: false,
      stream: null,
      animationFrame: null,
      statusMessage: '',
      statusType: 'info',
      lastScannedCode: null,
      scanCooldown: false
    };
  },
  beforeUnmount() {
    this.stopScanning();
  },
  methods: {
    async startScanning() {
      try {
        this.statusMessage = 'Démarrage de la caméra...';
        this.statusType = 'info';

        // Demander l'accès à la caméra
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' } // Caméra arrière sur mobile
        });

        const video = this.$refs.video;
        video.srcObject = this.stream;
        video.play();

        this.isScanning = true;
        this.statusMessage = 'Positionnez le QR code dans le cadre';
        this.statusType = 'success';

        // Attendre que la vidéo soit prête
        video.addEventListener('loadedmetadata', () => {
          this.scanQRCode();
        });

      } catch (error) {
        console.error('Erreur caméra:', error);
        this.statusMessage = 'Impossible d\'accéder à la caméra. Vérifiez les permissions.';
        this.statusType = 'error';
      }
    },

    stopScanning() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }

      this.isScanning = false;
      this.statusMessage = '';
    },

    scanQRCode() {
      if (!this.isScanning) return;

      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const context = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && !this.scanCooldown) {
          this.handleQRCodeDetected(code.data);
        }
      }

      // Continuer le scan
      this.animationFrame = requestAnimationFrame(() => this.scanQRCode());
    },

    handleQRCodeDetected(data) {
      console.log('QR Code détecté:', data);

      // Éviter les scans multiples du même code
      if (this.lastScannedCode === data) {
        return;
      }

      this.lastScannedCode = data;
      this.scanCooldown = true;

      // Extraire l'ID du personnel
      // Format attendu: "EMPLOYEE_ID:123" ou juste "123"
      let employeeId = null;

      if (data.includes('EMPLOYEE_ID:')) {
        employeeId = parseInt(data.split('EMPLOYEE_ID:')[1]);
      } else if (data.includes('ID:')) {
        employeeId = parseInt(data.split('ID:')[1]);
      } else {
        // Essayer de parser directement comme nombre
        employeeId = parseInt(data);
      }

      if (employeeId && !isNaN(employeeId)) {
        this.statusMessage = `✓ QR Code scanné ! ID: ${employeeId}`;
        this.statusType = 'success';

        // Émettre l'événement avec l'ID
        this.$emit('scanned', employeeId);

        // Arrêter le scan après succès
        setTimeout(() => {
          this.stopScanning();
        }, 1000);
      } else {
        this.statusMessage = '❌ QR Code invalide';
        this.statusType = 'error';
      }

      // Réinitialiser le cooldown après 2 secondes
      setTimeout(() => {
        this.scanCooldown = false;
        this.lastScannedCode = null;
      }, 2000);
    }
  }
};
</script>

<style scoped>
.qr-scanner {
  margin-bottom: 30px;
}

.scanner-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h3 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 20px;
}

.video-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 20px;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.scanner-video {
  width: 100%;
  height: auto;
  display: block;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scanner-frame {
  width: 250px;
  height: 250px;
  border: 3px solid #4CAF50;
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    border-color: #4CAF50;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  }
  50% {
    border-color: #81C784;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
  }
}

.scanner-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.btn-scan,
.btn-stop {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-scan {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
}

.btn-scan:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-stop {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
}

.btn-stop:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.status-message {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.status-message.info {
  background: #e3f2fd;
  color: #1976d2;
  border: 2px solid #90caf9;
}

.status-message.success {
  background: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.status-message.error {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}

@media (max-width: 768px) {
  .scanner-frame {
    width: 200px;
    height: 200px;
  }
}
</style>
