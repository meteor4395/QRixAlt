class QRScanner {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.scanResult = document.getElementById('scan-result');
        this.scanning = false;
    }

    async start() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "environment" } 
            });
            this.video.srcObject = stream;
            this.video.setAttribute("playsinline", true);
            this.video.play();
            requestAnimationFrame(() => this.scan());
        } catch (err) {
            console.error('Error accessing camera:', err);
            this.scanResult.textContent = 'Error accessing camera. Please make sure you have granted camera permissions.';
            this.scanResult.classList.remove('hidden');
        }
    }

    scan() {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.canvas.height = this.video.videoHeight;
            this.canvas.width = this.video.videoWidth;
            this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            
            const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code) {
                this.handleQRCode(code.data);
            }
        }
        if (this.scanning) {
            requestAnimationFrame(() => this.scan());
        }
    }

    async handleQRCode(qrData) {
        try {
            const response = await fetch(`/api/fittings/${qrData}`);
            if (!response.ok) throw new Error('Fitting not found');
            
            const fitting = await response.json();
            this.displayFittingInfo(fitting);
        } catch (err) {
            console.error('Error fetching fitting data:', err);
            this.scanResult.textContent = 'Error: Could not find fitting information';
            this.scanResult.classList.remove('hidden');
        }
    }

    displayFittingInfo(fitting) {
        const fittingDetails = document.getElementById('fitting-details');
        fittingDetails.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div class="font-semibold">Type:</div>
                <div>${fitting.fitting_type}</div>
                <div class="font-semibold">Batch Number:</div>
                <div>${fitting.batch_number}</div>
                <div class="font-semibold">Manufacturer:</div>
                <div>${fitting.vendor.name}</div>
                <div class="font-semibold">Manufacture Date:</div>
                <div>${new Date(fitting.manufacture_date).toLocaleDateString()}</div>
                <div class="font-semibold">Warranty Until:</div>
                <div>${new Date(fitting.warranty_end_date).toLocaleDateString()}</div>
                <div class="font-semibold">Last Inspection:</div>
                <div>${fitting.last_inspection_date ? new Date(fitting.last_inspection_date).toLocaleDateString() : 'Not inspected'}</div>
            </div>
        `;
        document.getElementById('fitting-info').classList.remove('hidden');
    }

    stop() {
        this.scanning = false;
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
    }
}