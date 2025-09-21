class Analysis {
    constructor() {
        this.typeChart = null;
        this.manufacturerChart = null;
        this.trendChart = null;
        this.setupCharts();
        this.loadData();
    }

    async setupCharts() {
        // Items by Type Chart
        const typeCtx = document.getElementById('typeChart').getContext('2d');
        this.typeChart = new Chart(typeCtx, {
            type: 'pie',
            data: {
                labels: ['Elastic Rail Clip', 'Liner', 'Rail Pad', 'Sleeper'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                }]
            }
        });

        // Items by Manufacturer Chart
        const manufacturerCtx = document.getElementById('manufacturerChart').getContext('2d');
        this.manufacturerChart = new Chart(manufacturerCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Items per Manufacturer',
                    data: [],
                    backgroundColor: '#36A2EB'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Monthly Trend Chart
        const trendCtx = document.getElementById('trendChart').getContext('2d');
        this.trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Items Produced',
                    data: [],
                    borderColor: '#FF6384',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    async loadData() {
        try {
            const response = await fetch('/api/items/analytics');
            const data = await response.json();
            
            // Update Type Chart
            this.typeChart.data.datasets[0].data = [
                data.typeCount.elastic_rail_clip || 0,
                data.typeCount.liner || 0,
                data.typeCount.rail_pad || 0,
                data.typeCount.sleeper || 0
            ];
            this.typeChart.update();

            // Update Manufacturer Chart
            this.manufacturerChart.data.labels = Object.keys(data.manufacturerCount);
            this.manufacturerChart.data.datasets[0].data = Object.values(data.manufacturerCount);
            this.manufacturerChart.update();

            // Update Trend Chart
            this.trendChart.data.labels = data.monthlyTrend.map(item => item.month);
            this.trendChart.data.datasets[0].data = data.monthlyTrend.map(item => item.count);
            this.trendChart.update();

        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }
}