// GitHub Commit Visualizer - Main JavaScript File

class GitHubCommitVisualizer {
    constructor() {
        this.username = '';
        this.userData = null;
        this.commitsData = [];
        this.reposData = [];
        this.charts = {};
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupCharts();
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const usernameInput = document.getElementById('username');
        const timeRangeSelect = document.getElementById('timeRange');
        const repoFilterSelect = document.getElementById('repoFilter');

        searchBtn.addEventListener('click', () => this.handleSearch());
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        timeRangeSelect.addEventListener('change', () => this.updateVisualizations());
        repoFilterSelect.addEventListener('change', () => this.updateVisualizations());
    }

    async handleSearch() {
        const username = document.getElementById('username').value.trim();
        if (!username) {
            alert('Please enter a GitHub username');
            return;
        }

        this.username = username;
        this.showLoading(true);
        
        try {
            await this.fetchUserData();
            await this.fetchRepositories();
            await this.fetchCommits();
            
            this.displayUserInfo();
            this.populateFilters();
            this.createVisualizations();
            this.calculateInsights();
            
            this.showResults();
        } catch (error) {
            console.error('Error:', error);
            alert('Error fetching data. Please check the username and try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async fetchUserData() {
        const response = await fetch(`https://api.github.com/users/${this.username}`);
        if (!response.ok) throw new Error('User not found');
        this.userData = await response.json();
    }

    async fetchRepositories() {
        const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('Failed to fetch repositories');
        this.reposData = await response.json();
    }

    async fetchCommits() {
        this.commitsData = [];
        const timeRange = parseInt(document.getElementById('timeRange').value);
        const since = new Date();
        since.setDate(since.getDate() - timeRange);

        // Fetch commits from each repository
        for (const repo of this.reposData) {
            try {
                const response = await fetch(
                    `https://api.github.com/repos/${this.username}/${repo.name}/commits?since=${since.toISOString()}&per_page=100`
                );
                if (response.ok) {
                    const commits = await response.json();
                    commits.forEach(commit => {
                        this.commitsData.push({
                            ...commit,
                            repo_name: repo.name,
                            repo_full_name: repo.full_name
                        });
                    });
                }
            } catch (error) {
                console.warn(`Failed to fetch commits for ${repo.name}:`, error);
            }
        }
    }

    displayUserInfo() {
        document.getElementById('userAvatar').src = this.userData.avatar_url;
        document.getElementById('userName').textContent = this.userData.name || this.userData.login;
        document.getElementById('userBio').textContent = this.userData.bio || 'No bio available';
        document.getElementById('totalCommits').textContent = `${this.commitsData.length} commits`;
        document.getElementById('totalRepos').textContent = `${this.reposData.length} repositories`;
    }

    populateFilters() {
        const repoFilter = document.getElementById('repoFilter');
        repoFilter.innerHTML = '<option value="all">All repositories</option>';
        
        this.reposData.forEach(repo => {
            const option = document.createElement('option');
            option.value = repo.name;
            option.textContent = repo.name;
            repoFilter.appendChild(option);
        });
    }

    createVisualizations() {
        this.createHeatmap();
        this.createDayOfWeekChart();
        this.createTimeOfDayChart();
        this.createRepoChart();
        this.createMonthlyChart();
    }

    createHeatmap() {
        const heatmapContainer = document.getElementById('heatmap');
        heatmapContainer.innerHTML = '';

        const timeRange = parseInt(document.getElementById('timeRange').value);
        const repoFilter = document.getElementById('repoFilter').value;
        
        // Filter commits based on selected repository
        let filteredCommits = this.commitsData;
        if (repoFilter !== 'all') {
            filteredCommits = this.commitsData.filter(commit => commit.repo_name === repoFilter);
        }

        // Create date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);

        // Group commits by date
        const commitsByDate = {};
        filteredCommits.forEach(commit => {
            const date = new Date(commit.commit.author.date).toDateString();
            commitsByDate[date] = (commitsByDate[date] || 0) + 1;
        });

        // Find max commits for scaling
        const maxCommits = Math.max(...Object.values(commitsByDate), 1);

        // Create heatmap grid
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayElement = document.createElement('div');
            dayElement.className = 'heatmap-day';
            
            const dateString = currentDate.toDateString();
            const commitCount = commitsByDate[dateString] || 0;
            const level = Math.floor((commitCount / maxCommits) * 4);
            
            dayElement.setAttribute('data-level', level);
            dayElement.setAttribute('data-date', dateString);
            dayElement.setAttribute('data-commits', commitCount);
            
            // Add tooltip
            dayElement.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, `${dateString}: ${commitCount} commits`);
            });
            
            dayElement.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
            
            heatmapContainer.appendChild(dayElement);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    createDayOfWeekChart() {
        const ctx = document.getElementById('dayOfWeekChart').getContext('2d');
        
        if (this.charts.dayOfWeek) {
            this.charts.dayOfWeek.destroy();
        }

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const commitsByDay = new Array(7).fill(0);
        
        this.commitsData.forEach(commit => {
            const day = new Date(commit.commit.author.date).getDay();
            commitsByDay[day]++;
        });

        this.charts.dayOfWeek = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: daysOfWeek,
                datasets: [{
                    label: 'Commits',
                    data: commitsByDay,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });
    }

    createTimeOfDayChart() {
        const ctx = document.getElementById('timeOfDayChart').getContext('2d');
        
        if (this.charts.timeOfDay) {
            this.charts.timeOfDay.destroy();
        }

        const timeSlots = [
            '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM',
            '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
            '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM',
            '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
        ];
        const commitsByHour = new Array(24).fill(0);
        
        this.commitsData.forEach(commit => {
            const hour = new Date(commit.commit.author.date).getHours();
            commitsByHour[hour]++;
        });

        this.charts.timeOfDay = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeSlots,
                datasets: [{
                    label: 'Commits',
                    data: commitsByHour,
                    backgroundColor: 'rgba(118, 75, 162, 0.8)',
                    borderColor: 'rgba(118, 75, 162, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });
    }

    createRepoChart() {
        const ctx = document.getElementById('repoChart').getContext('2d');
        
        if (this.charts.repo) {
            this.charts.repo.destroy();
        }

        const commitsByRepo = {};
        this.commitsData.forEach(commit => {
            commitsByRepo[commit.repo_name] = (commitsByRepo[commit.repo_name] || 0) + 1;
        });

        const repos = Object.keys(commitsByRepo);
        const commitCounts = Object.values(commitsByRepo);

        // Generate colors
        const colors = this.generateColors(repos.length);

        this.charts.repo = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: repos,
                datasets: [{
                    data: commitCounts,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
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
                            usePointStyle: true
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });
    }

    createMonthlyChart() {
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        
        if (this.charts.monthly) {
            this.charts.monthly.destroy();
        }

        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const commitsByMonth = new Array(12).fill(0);
        
        this.commitsData.forEach(commit => {
            const month = new Date(commit.commit.author.date).getMonth();
            commitsByMonth[month]++;
        });

        this.charts.monthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Commits',
                    data: commitsByMonth,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });
    }

    calculateInsights() {
        // Most active day
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const commitsByDay = new Array(7).fill(0);
        this.commitsData.forEach(commit => {
            const day = new Date(commit.commit.author.date).getDay();
            commitsByDay[day]++;
        });
        const mostActiveDayIndex = commitsByDay.indexOf(Math.max(...commitsByDay));
        document.getElementById('mostActiveDay').textContent = daysOfWeek[mostActiveDayIndex];

        // Most active time
        const timeSlots = [
            '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM',
            '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
            '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM',
            '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
        ];
        const commitsByHour = new Array(24).fill(0);
        this.commitsData.forEach(commit => {
            const hour = new Date(commit.commit.author.date).getHours();
            commitsByHour[hour]++;
        });
        const mostActiveHourIndex = commitsByHour.indexOf(Math.max(...commitsByHour));
        document.getElementById('mostActiveTime').textContent = timeSlots[mostActiveHourIndex];

        // Most active repository
        const commitsByRepo = {};
        this.commitsData.forEach(commit => {
            commitsByRepo[commit.repo_name] = (commitsByRepo[commit.repo_name] || 0) + 1;
        });
        const mostActiveRepo = Object.keys(commitsByRepo).reduce((a, b) => 
            commitsByRepo[a] > commitsByRepo[b] ? a : b
        );
        document.getElementById('mostActiveRepo').textContent = mostActiveRepo;

        // Average commits per day
        const timeRange = parseInt(document.getElementById('timeRange').value);
        const avgCommitsPerDay = (this.commitsData.length / timeRange).toFixed(1);
        document.getElementById('avgCommitsPerDay').textContent = avgCommitsPerDay;
    }

    updateVisualizations() {
        this.createHeatmap();
        this.createDayOfWeekChart();
        this.createTimeOfDayChart();
        this.createRepoChart();
        this.createMonthlyChart();
        this.calculateInsights();
    }

    generateColors(count) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
        ];
        
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(colors[i % colors.length]);
        }
        return result;
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 10 + 'px';
    }

    hideTooltip() {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const searchBtn = document.getElementById('searchBtn');
        
        if (show) {
            loading.style.display = 'flex';
            searchBtn.disabled = true;
            searchBtn.textContent = 'Loading...';
        } else {
            loading.style.display = 'none';
            searchBtn.disabled = false;
            searchBtn.textContent = 'Visualize Commits';
        }
    }

    showResults() {
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('filters').style.display = 'flex';
        document.getElementById('chartsSection').style.display = 'block';
        document.getElementById('insightsSection').style.display = 'block';
    }

    setupCharts() {
        // Initialize Chart.js defaults
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.color = '#666';
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GitHubCommitVisualizer();
}); 