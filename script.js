// Dados globais
let tipoData = [];
let statusData = [];
let originalTipoData = [];
let originalStatusData = [];

// Instâncias dos gráficos
let tipoChart = null;
let statusChart = null;
let temporalChart = null;

// Configurações de cores modernas
const colors = {
    primary: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
    gradients: [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #1be914ff 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    ]
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
});

// Função principal de inicialização
async function initializeDashboard() {
    showLoading();
    try {
        await loadData();
        createCharts();
        populateTable();
        updateStats();
        hideLoading();
    } catch (error) {
        console.error('Erro ao inicializar dashboard:', error);
        hideLoading();
    }
}

// Carregar dados dos arquivos CSV
async function loadData() {
    try {
        // Simular dados baseados nos arquivos CSV originais
        tipoData = [
            { Tipo: 'Incidente', Quantidade: 28 },
            { Tipo: 'Requisição', Quantidade: 4 }
        ];
        
        statusData = [
            { Status: 'Resolvido', Quantidade: 16 },
            { Status: 'Cancelado', Quantidade: 15 },
            { Status: 'Fechado', Quantidade: 1 }
        ];

        // Guardar dados originais para filtros
        originalTipoData = [...tipoData];
        originalStatusData = [...statusData];

        console.log('Dados carregados com sucesso');
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    document.getElementById('tipo-filter').addEventListener('change', applyFilters);
    document.getElementById('status-filter').addEventListener('change', applyFilters);
    
    // Botão de atualizar
    document.getElementById('refresh-btn').addEventListener('click', refreshDashboard);
    
    // Botões de tipo de gráfico
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const chartType = this.dataset.chart;
            const type = this.dataset.type;
            changeChartType(chartType, type);
            
            // Atualizar estado ativo dos botões
            this.parentElement.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Botão de exportar
    document.getElementById('export-btn').addEventListener('click', exportData);
}

// Criar gráficos
function createCharts() {
    createTipoChart();
    createStatusChart();
    createTemporalChart();
}

// Gráfico de tipos
function createTipoChart() {
    const ctx = document.getElementById('tipoChart').getContext('2d');
    
    if (tipoChart) {
        tipoChart.destroy();
    }
    
    tipoChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: tipoData.map(item => item.Tipo),
            datasets: [{
                data: tipoData.map(item => item.Quantidade),
                backgroundColor: colors.primary.slice(0, tipoData.length),
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            family: 'Segoe UI'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

// Gráfico de status
function createStatusChart() {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    if (statusChart) {
        statusChart.destroy();
    }
    
    statusChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: statusData.map(item => item.Status),
            datasets: [{
                label: 'Quantidade',
                data: statusData.map(item => item.Quantidade),
                backgroundColor: colors.primary.slice(0, statusData.length),
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Segoe UI'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Segoe UI'
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Gráfico temporal (simulado)
function createTemporalChart() {
    const ctx = document.getElementById('temporalChart').getContext('2d');
    
    if (temporalChart) {
        temporalChart.destroy();
    }
    
    // Dados simulados para tendência temporal
    const temporalData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Incidentes',
                data: [12, 15, 8, 10, 14, 18, 28],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Requisições',
                data: [3, 2, 4, 1, 3, 2, 4],
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    temporalChart = new Chart(ctx, {
        type: 'line',
        data: temporalData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        font: {
                            family: 'Segoe UI'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Segoe UI'
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Segoe UI'
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Alterar tipo de gráfico
function changeChartType(chartName, type) {
    if (chartName === 'tipo') {
        const ctx = document.getElementById('tipoChart').getContext('2d');
        tipoChart.destroy();
        
        const chartType = type === 'pie' ? 'doughnut' : 'bar';
        
        tipoChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: tipoData.map(item => item.Tipo),
                datasets: [{
                    label: chartType === 'bar' ? 'Quantidade' : undefined,
                    data: tipoData.map(item => item.Quantidade),
                    backgroundColor: colors.primary.slice(0, tipoData.length),
                    borderWidth: 0,
                    borderRadius: chartType === 'bar' ? 8 : 0,
                    hoverOffset: chartType === 'doughnut' ? 10 : 0
                }]
            },
            options: getChartOptions(chartType)
        });
    } else if (chartName === 'status') {
        const ctx = document.getElementById('statusChart').getContext('2d');
        statusChart.destroy();
        
        const chartType = type === 'pie' ? 'doughnut' : 'bar';
        
        statusChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: statusData.map(item => item.Status),
                datasets: [{
                    label: chartType === 'bar' ? 'Quantidade' : undefined,
                    data: statusData.map(item => item.Quantidade),
                    backgroundColor: colors.primary.slice(0, statusData.length),
                    borderWidth: 0,
                    borderRadius: chartType === 'bar' ? 8 : 0,
                    hoverOffset: chartType === 'doughnut' ? 10 : 0
                }]
            },
            options: getChartOptions(chartType)
        });
    }
}

// Obter opções do gráfico baseado no tipo
function getChartOptions(type) {
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#667eea',
                borderWidth: 1,
                cornerRadius: 8
            }
        }
    };

    if (type === 'doughnut') {
        return {
            ...baseOptions,
            plugins: {
                ...baseOptions.plugins,
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            family: 'Segoe UI'
                        }
                    }
                }
            }
        };
    } else {
        return {
            ...baseOptions,
            plugins: {
                ...baseOptions.plugins,
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };
    }
}

// Popular tabela
function populateTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    // Combinar dados de tipo e status
    const allData = [
        ...tipoData.map(item => ({...item, category: 'Tipo'})),
        ...statusData.map(item => ({...item, category: 'Status', Tipo: item.Status}))
    ];
    
    const total = tipoData.reduce((sum, item) => sum + item.Quantidade, 0);
    
    allData.forEach(item => {
        const row = document.createElement('tr');
        const percentage = ((item.Quantidade / total) * 100).toFixed(1);
        
        row.innerHTML = `
            <td>${item.Tipo}</td>
            <td>${item.Quantidade}</td>
            <td>${percentage}%</td>
            <td><span class="status-badge status-${item.category.toLowerCase()}">${item.category}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Atualizar estatísticas do header
function updateStats() {
    const totalChamados = tipoData.reduce((sum, item) => sum + item.Quantidade, 0);
    const incidentes = tipoData.find(item => item.Tipo === 'Incidente')?.Quantidade || 0;
    const requisicoes = tipoData.find(item => item.Tipo === 'Requisição')?.Quantidade || 0;
    
    document.getElementById('total-chamados').textContent = totalChamados;
    document.getElementById('incidentes').textContent = incidentes;
    document.getElementById('requisicoes').textContent = requisicoes;
}

// Aplicar filtros
function applyFilters() {
    const tipoFilter = document.getElementById('tipo-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    // Filtrar dados de tipo
    if (tipoFilter === 'todos') {
        tipoData = [...originalTipoData];
    } else {
        tipoData = originalTipoData.filter(item => item.Tipo === tipoFilter);
    }
    
    // Filtrar dados de status
    if (statusFilter === 'todos') {
        statusData = [...originalStatusData];
    } else {
        statusData = originalStatusData.filter(item => item.Status === statusFilter);
    }
    
    // Atualizar gráficos e tabela
    createCharts();
    populateTable();
    updateStats();
}

// Atualizar dashboard
function refreshDashboard() {
    const refreshBtn = document.getElementById('refresh-btn');
    const icon = refreshBtn.querySelector('i');
    
    // Animação de rotação
    icon.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        // Reset filtros
        document.getElementById('tipo-filter').value = 'todos';
        document.getElementById('status-filter').value = 'todos';
        
        // Restaurar dados originais
        tipoData = [...originalTipoData];
        statusData = [...originalStatusData];
        
        // Recriar gráficos
        createCharts();
        populateTable();
        updateStats();
        
        // Remover animação
        icon.style.animation = '';
    }, 1000);
}

// Exportar dados
function exportData() {
    const data = [
        ['Tipo', 'Quantidade'],
        ...tipoData.map(item => [item.Tipo, item.Quantidade]),
        [''],
        ['Status', 'Quantidade'],
        ...statusData.map(item => [item.Status, item.Quantidade])
    ];
    
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_data.csv';
    a.click();
    
    window.URL.revokeObjectURL(url);
}

// Funções de loading
function showLoading() {
    document.querySelectorAll('.chart-card, .table-card').forEach(card => {
        card.classList.add('loading');
    });
}

function hideLoading() {
    document.querySelectorAll('.chart-card, .table-card').forEach(card => {
        card.classList.remove('loading');
    });
}

// Adicionar CSS para badges de status
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .status-tipo {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
    }
    
    .status-status {
        background: rgba(118, 75, 162, 0.1);
        color: #764ba2;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

