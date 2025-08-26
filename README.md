# GitHub Commit Visualizer

A beautiful, interactive web application that visualizes GitHub commit activity using HTML, CSS, and JavaScript. This project fetches data from the GitHub REST API and presents it in various engaging visual formats.

## 🌟 Features

### 📊 Interactive Visualizations
- **Calendar Heatmap**: GitHub-style contribution graph showing daily commit activity
- **Day of Week Chart**: Bar chart displaying commit frequency by day of the week
- **Time of Day Chart**: Bar chart showing when commits are made throughout the day
- **Repository Pie Chart**: Doughnut chart showing commit distribution across repositories
- **Monthly Activity Line Chart**: Trend line showing commit activity over months

### 🔍 Smart Insights
- Most active day of the week
- Most active time of day
- Most active repository
- Average commits per day

### 🎛️ Interactive Filters
- Time range selection (30 days, 90 days, 1 year)
- Repository-specific filtering
- Real-time chart updates

### 🎨 Modern UI/UX
- Responsive design that works on all devices
- Beautiful gradient backgrounds and smooth animations
- Interactive tooltips on heatmap
- Loading states and error handling
- Clean, modern typography using Inter font

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required!

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Enter a GitHub username and click "Visualize Commits"

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

## 📁 Project Structure

```
github-commit-visualizer/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and API integration
└── README.md           # Project documentation
```

## 🔧 Technical Details

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

## 🎯 Use Cases

- **Personal Analytics**: Analyze your own GitHub activity patterns
- **Team Insights**: Understand team member contribution patterns
- **Open Source Analysis**: Study activity patterns of open source contributors
- **Learning Tool**: Understand GitHub contribution visualization concepts

## 🔮 Future Enhancements

Potential features for future versions:
- GitHub authentication for private repository access
- Export functionality for charts and data
- More detailed commit analysis (file types, languages, etc.)
- Comparison mode for multiple users
- Dark mode theme
- More chart types and visualizations

## 🤝 Contributing

This is a learning project, but contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- GitHub for providing the excellent REST API
- Chart.js for the powerful charting library
- Inter font family for beautiful typography
- The open source community for inspiration

## 📞 Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure the GitHub username exists and has public repositories
3. Verify your internet connection
4. Try refreshing the page

---

**Happy visualizing! 🎉** 