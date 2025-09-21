class App {
    constructor() {
        this.scanner = null;
        this.generator = null;
        this.analysis = null;
        this.admin = null;
        this.setupTabs();
        this.initializeModules();
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-button');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.add('hidden'));

                // Add active class to clicked tab and its content
                tab.classList.add('active');
                const contentId = tab.dataset.tab;
                document.getElementById(contentId).classList.remove('hidden');

                // Handle special cases when switching tabs
                if (contentId === 'scanner') {
                    this.scanner.start();
                } else {
                    this.scanner.stop();
                }

                if (contentId === 'analysis') {
                    this.analysis.loadData();
                }

                if (contentId === 'admin') {
                    this.admin.loadItems();
                }
            });
        });
    }

    initializeModules() {
        this.scanner = new QRScanner();
        this.generator = new QRGenerator();
        this.analysis = new Analysis();
        this.admin = new Admin();

        // Start scanner by default
        this.scanner.start();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});