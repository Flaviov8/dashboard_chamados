// Módulo de Autenticação
const AuthModule = (() => {
    // Dados de usuários válidos (em produção, substituir por chamada API)
    const validUsers = [
        { username: "admin", password: "admin123", name: "Administrador" },
        { username: "user", password: "user123", name: "Usuário Padrão" }
    ];

    // Elementos da UI
    const elements = {
        loginContainer: document.getElementById('login-container'),
        loginForm: document.getElementById('login-form'),
        dashboardContainer: document.querySelector('.dashboard-container'),
        logoutBtn: document.getElementById('logout-btn'),
        usernameInput: document.getElementById('username'),
        passwordInput: document.getElementById('password')
    };

    // Verificar autenticação
    const checkAuth = () => {
        return sessionStorage.getItem('loggedIn') === 'true';
    };

    // Fazer login
    const login = (username, password) => {
        const user = validUsers.find(u => u.username === username && u.password === password);
        
        if (user) {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('username', user.name);
            return true;
        }
        return false;
    };

    // Fazer logout
    const logout = () => {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
    };

    // Mostrar dashboard
    const showDashboard = () => {
        elements.loginContainer.style.display = 'none';
        elements.dashboardContainer.style.display = 'block';
    };

    // Mostrar tela de login
    const showLogin = () => {
        elements.loginContainer.style.display = 'flex';
        elements.dashboardContainer.style.display = 'none';
        elements.loginForm.reset();
    };

    // Inicializar listeners
    const initAuthListeners = () => {
        elements.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = elements.usernameInput.value;
            const password = elements.passwordInput.value;
            
            if (login(username, password)) {
                showDashboard();
                DashboardModule.init();
            } else {
                alert('Credenciais inválidas. Por favor, tente novamente.');
            }
        });

        if (elements.logoutBtn) {
            elements.logoutBtn.addEventListener('click', () => {
                logout();
                showLogin();
            });
        }
    };

    return {
        init: () => {
            initAuthListeners();
            if (checkAuth()) {
                showDashboard();
                return true;
            }
            return false;
        }
    };
})();

// Módulo do Dashboard
const DashboardModule = (() => {
    // Dados e estado
    let state = {
        tipoData: [],
        statusData: [],
        originalTipoData: [],
        originalStatusData: [],
        tipoChart: null,
        statusChart: null,
        temporalChart: null
    };

    // Configurações
    const colors = {
        primary: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
        gradients: [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #1be914ff 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        ]
    };

    // Helpers
    const showLoading = () => {
        document.querySelectorAll('.chart-card, .table-card').forEach(card => {
            card.classList.add('loading');
        });
    };

    const hideLoading = () => {
        document.querySelectorAll('.chart-card, .table-card').forEach(card => {
            card.classList.remove('loading');
        });
    };

    // Operações com dados
    const loadData = () => {
        try {
            // Simular dados (substituir por chamada API em produção)
            state.tipoData = [
                { Tipo: 'Incidente', Quantidade: 28 },
                { Tipo: 'Requisição', Quantidade: 4 }
            ];
            
            state.statusData = [
                { Status: 'Resolvido', Quantidade: 16 },
                { Status: 'Cancelado', Quantidade: 15 },
                { Status: 'Fechado', Quantidade: 1 }
            ];

            state.originalTipoData = [...state.tipoData];
            state.originalStatusData = [...state.statusData];

            console.log('Dados carregados com sucesso');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            throw error;
        }
    };

    // Operações com gráficos
    const createTipoChart = () => {
        const ctx = document.getElementById('tipoChart').getContext('2d');
        
        if (state.tipoChart) state.tipoChart.destroy();
        
        state.tipoChart = new Chart(ctx, getChartConfig('doughnut', 
            state.tipoData.map(item => item.Tipo),
            state.tipoData.map(item => item.Quantidade),
            'Distribuição por Tipo'
        ));
    };

    const createStatusChart = () => {
        const ctx = document.getElementById('statusChart').getContext('2d');
        
        if (state.statusChart) state.statusChart.destroy();
        
        state.statusChart = new Chart(ctx, getChartConfig('bar',
            state.statusData.map(item => item.Status),
            state.statusData.map(item => item.Quantidade),
            'Distribuição por Status'
        ));
    };

    const createTemporalChart = () => {
        const ctx = document.getElementById('temporalChart').getContext('2d');
        
        if (state.temporalChart) state.temporalChart.destroy();
        
        state.temporalChart = new Chart(ctx, {
            type: 'line',
            data: {
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
            },
            options: getChartOptions('line')
        });
    };

    const getChartConfig = (type, labels, data, label) => {
        return {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: type === 'bar' ? label : undefined,
                    data: data,
                    backgroundColor: colors.primary.slice(0, data.length),
                    borderWidth: 0,
                    borderRadius: type === 'bar' ? 8 : 0,
                    hoverOffset: type === 'doughnut' ? 10 : 0
                }]
            },
            options: getChartOptions(type)
        };
    };

    const getChartOptions = (type) => {
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
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            if (type === 'doughnut' || type === 'pie') {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                            return `${context.label}: ${context.parsed}`;
                        }
                    }
                }
            }
        };

        if (type === 'doughnut' || type === 'pie') {
            baseOptions.plugins.legend = {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12,
                        family: 'Segoe UI'
                    }
                }
            };
        } else {
            baseOptions.plugins.legend = {
                display: type === 'line',
                position: 'top',
                labels: {
                    usePointStyle: true,
                    font: {
                        family: 'Segoe UI'
                    }
                }
            };

            baseOptions.scales = {
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
                        color: type === 'line' ? 'rgba(0, 0, 0, 0.1)' : false
                    },
                    ticks: {
                        font: {
                            family: 'Segoe UI'
                        }
                    }
                }
            };
        }

        return baseOptions;
    };

    // Operações com tabela
    const populateTable = () => {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        
        const allData = [
            ...state.tipoData.map(item => ({...item, category: 'Tipo'})),
            ...state.statusData.map(item => ({...item, category: 'Status', Tipo: item.Status}))
        ];
        
        const total = state.tipoData.reduce((sum, item) => sum + item.Quantidade, 0);
        
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
    };

    // Atualizar estatísticas
    const updateStats = () => {
        const totalChamados = state.tipoData.reduce((sum, item) => sum + item.Quantidade, 0);
        const incidentes = state.tipoData.find(item => item.Tipo === 'Incidente')?.Quantidade || 0;
        const requisicoes = state.tipoData.find(item => item.Tipo === 'Requisição')?.Quantidade || 0;
        
        document.getElementById('total-chamados').textContent = totalChamados;
        document.getElementById('incidentes').textContent = incidentes;
        document.getElementById('requisicoes').textContent = requisicoes;
    };

    // Filtros
    const applyFilters = () => {
        const tipoFilter = document.getElementById('tipo-filter').value;
        const statusFilter = document.getElementById('status-filter').value;
        
        state.tipoData = tipoFilter === 'todos' 
            ? [...state.originalTipoData] 
            : state.originalTipoData.filter(item => item.Tipo === tipoFilter);
        
        state.statusData = statusFilter === 'todos' 
            ? [...state.originalStatusData] 
            : state.originalStatusData.filter(item => item.Status === statusFilter);
        
        refreshCharts();
    };

    // Atualizar gráficos
    const refreshCharts = () => {
        createTipoChart();
        createStatusChart();
        populateTable();
        updateStats();
    };

    // Exportar dados
    const exportData = () => {
        const data = [
            ['Tipo', 'Quantidade'],
            ...state.tipoData.map(item => [item.Tipo, item.Quantidade]),
            [''],
            ['Status', 'Quantidade'],
            ...state.statusData.map(item => [item.Status, item.Quantidade])
        ];
        
        const csvContent = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dashboard_data.csv';
        a.click();
        
        window.URL.revokeObjectURL(url);
    };

    // Inicializar listeners
    const initDashboardListeners = () => {
        document.getElementById('tipo-filter').addEventListener('change', applyFilters);
        document.getElementById('status-filter').addEventListener('change', applyFilters);
        
        document.getElementById('refresh-btn').addEventListener('click', () => {
            document.getElementById('tipo-filter').value = 'todos';
            document.getElementById('status-filter').value = 'todos';
            state.tipoData = [...state.originalTipoData];
            state.statusData = [...state.originalStatusData];
            refreshCharts();
        });
        
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const chartType = this.dataset.chart;
                const type = this.dataset.type;
                
                if (chartType === 'tipo' || chartType === 'status') {
                    const ctx = document.getElementById(`${chartType}Chart`).getContext('2d');
                    const chart = chartType === 'tipo' ? state.tipoChart : state.statusChart;
                    if (chart) chart.destroy();
                    
                    const newType = type === 'pie' ? 'doughnut' : 'bar';
                    const labels = chartType === 'tipo' 
                        ? state.tipoData.map(item => item.Tipo) 
                        : state.statusData.map(item => item.Status);
                    const data = chartType === 'tipo' 
                        ? state.tipoData.map(item => item.Quantidade) 
                        : state.statusData.map(item => item.Quantidade);
                    
                    if (chartType === 'tipo') {
                        state.tipoChart = new Chart(ctx, getChartConfig(newType, labels, data, 'Quantidade'));
                    } else {
                        state.statusChart = new Chart(ctx, getChartConfig(newType, labels, data, 'Quantidade'));
                    }
                    
                    this.parentElement.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
        
        document.getElementById('export-btn').addEventListener('click', exportData);
    };

    // Inicialização do dashboard
    const initDashboard = () => {
        showLoading();
        try {
            loadData();
            createTipoChart();
            createStatusChart();
            createTemporalChart();
            populateTable();
            updateStats();
            initDashboardListeners();
            hideLoading();
        } catch (error) {
            console.error('Erro ao inicializar dashboard:', error);
            hideLoading();
        }
    };

    return {
        init: initDashboard
    };
})();

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    if (AuthModule.init()) {
        DashboardModule.init();
    }
});