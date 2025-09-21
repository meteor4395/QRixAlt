class QRGenerator {
    constructor() {
        this.form = document.getElementById('qr-form');
        this.output = document.getElementById('qr-output');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const data = {
            type: formData.get('type'),
            warranty: formData.get('warranty'),
            date_of_manufacture: new Date(formData.get('date_of_manufacture')).toISOString().split('T')[0],
            manufacturer: formData.get('manufacturer'),
            status: 'active'
        };

        try {
            // Generate unique QR ID based on timestamp and random string
            data.qr_id = this.generateQRId();

            console.log('Sending data:', data);
            // Save to backend
            const response = await fetch('/api/fittings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server response:', errorData);
                throw new Error(errorData.detail || 'Failed to save item');
            }

            // Clear previous content
            this.output.innerHTML = '';
            
            // Create container for QR code and details
            const container = document.createElement('div');
            container.className = 'text-center space-y-4';
            
            // Create QR code display area
            const qrDisplay = document.createElement('div');
            qrDisplay.className = 'mb-4';
            container.appendChild(qrDisplay);

            // Generate QR code
            const canvas = await QRCode.toCanvas(data.qr_id, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000',
                    light: '#fff'
                }
            });
            qrDisplay.appendChild(canvas);

            // Add item details
            const details = document.createElement('div');
            details.className = 'bg-gray-50 p-4 rounded-lg text-left';
            details.innerHTML = `
                <h3 class="font-semibold mb-2">Item Details:</h3>
                <div class="grid grid-cols-2 gap-2">
                    <div class="text-gray-600">QR ID:</div>
                    <div>${data.qr_id}</div>
                    <div class="text-gray-600">Type:</div>
                    <div>${this.formatType(data.type)}</div>
                    <div class="text-gray-600">Warranty:</div>
                    <div>${data.warranty}</div>
                    <div class="text-gray-600">Manufacture Date:</div>
                    <div>${new Date(data.date_of_manufacture).toLocaleDateString()}</div>
                    <div class="text-gray-600">Manufacturer:</div>
                    <div>${data.manufacturer}</div>
                </div>
            `;
            container.appendChild(details);

            // Add buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'flex justify-center space-x-4 mt-4';

            // Add download button
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Download QR Code';
            downloadBtn.className = 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700';
            downloadBtn.onclick = () => this.downloadQR(data);
            buttonsContainer.appendChild(downloadBtn);

            // Add print button
            const printBtn = document.createElement('button');
            printBtn.textContent = 'Print QR Code';
            printBtn.className = 'bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700';
            printBtn.onclick = () => this.printQR();
            buttonsContainer.appendChild(printBtn);

            container.appendChild(buttonsContainer);
            this.output.appendChild(container);

        } catch (error) {
            console.error('Error:', error);
            this.output.innerHTML = `<div class="text-red-600">Error generating QR code: ${error.message}</div>`;
        }
    }

    generateQRId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `${timestamp}${random}`.toUpperCase();
    }

    formatType(type) {
        const types = {
            'elastic_rail_clip': 'Elastic Rail Clip',
            'liner': 'Liner',
            'rail_pad': 'Rail Pad',
            'sleeper': 'Sleeper'
        };
        return types[type] || type;
    }

    downloadQR(data) {
        const canvas = this.output.querySelector('canvas');
        const link = document.createElement('a');
        link.download = `qr_${data.qr_id}_${data.type}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    printQR() {
        const printWindow = window.open('', '_blank');
        const qrCode = this.output.innerHTML;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>QR Code Print</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    .container {
                        text-align: center;
                    }
                    .qr-code {
                        margin-bottom: 20px;
                    }
                    .details {
                        text-align: left;
                        margin-top: 20px;
                    }
                    @media print {
                        @page {
                            size: auto;
                            margin: 0mm;
                        }
                        body {
                            padding: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    ${qrCode}
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for images to load before printing
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }
}