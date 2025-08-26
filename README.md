# GitHub Commit Visualizer

A  interactive web application that visualizes GitHub commit activity using HTML, CSS, and JavaScript. This project fetches data from the GitHub REST API and presents it in various engaging visual formats.

## 🌟 Features

### 📊 Interactive Visualizations
- **Calendar Heatmap**: GitHub-style contribution graph showing daily commit activity
- **Day of Week Chart**: Bar chart displaying commit frequency by day of the week
- **Time of Day Chart**: Bar chart showing when commits are made throughout the day
- **Repository Pie Chart**: Doughnut chart showing commit distribution across repositories
- **Monthly Activity Line Chart**: Trend line showing commit activity over months

### 🎨 Modern UI/UX
- Responsive design that works on all devices
- Beautiful gradient backgrounds and smooth animations
- Interactive tooltips on heatmap
- Loading states and error handling
- Clean, modern typography using Inter font


### Usage
1. **Enter Username**: Type any valid GitHub username in the search box
2. **View Results**: The app will fetch and display:
   - User profile information
   - Interactive commit heatmap
   - Various charts and analytics
   - Commit insights
3. **Filter Data**: Use the filters to:
   - Change the time range
   - Focus on specific repositories
4. **Explore**: Hover over the heatmap for detailed commit information
   
### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **Vanilla JavaScript**: ES6+ features and async/await
- **Chart.js**: Interactive charts and visualizations
- **GitHub REST API**: Data fetching without authentication

### API Endpoints Used
- `GET /users/{username}` - User profile information
- `GET /users/{username}/repos` - User repositories
- `GET /repos/{owner}/{repo}/commits` - Repository commits

### Key Features
- **No Authentication Required**: Works with public GitHub data
- **Rate Limit Aware**: Handles GitHub API rate limits gracefully
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Performance Optimized**: Efficient data processing and rendering

## 🔮 Future Enhancements

Potential features for future versions:
- GitHub authentication for private repository access
- Export functionality for charts and data
- More detailed commit analysis (file types, languages, etc.)
- Comparison mode for multiple users
- Dark mode theme
- More chart types and visualizations

---
