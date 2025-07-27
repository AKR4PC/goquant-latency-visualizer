# 🌍 GoQuant Latency Visualizer

A real-time 3D visualization platform for cryptocurrency exchange latency monitoring across global cloud infrastructure. Built with Next.js, Three.js, and modern web technologies.

![GoQuant Latency Visualizer](https://img.shields.io/badge/Next.js-15.4.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.178.0-green?style=for-the-badge&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🌐 Interactive 3D Globe

- **Real-time visualization** of cryptocurrency exchanges worldwide
- **Interactive 3D globe** with smooth animations and controls
- **Exchange markers** color-coded by cloud provider (AWS, GCP, Azure)
- **Connection arcs** showing latency between exchanges
- **Responsive design** optimized for all devices

### 📊 Advanced Analytics

- **Real-time latency monitoring** with live data updates
- **Historical performance charts** with multiple time ranges
- **Network statistics dashboard** with comprehensive metrics
- **Performance monitoring** with FPS, memory, and render time tracking
- **Latency heatmaps** for visual performance analysis

### 🎨 Modern UI/UX

- **Dark/Light mode toggle** with system preference detection
- **Glass morphism design** with backdrop blur effects
- **Responsive layout** that works on mobile, tablet, and desktop
- **Smooth animations** and micro-interactions
- **Professional typography** with JetBrains Mono font

### 🔧 Technical Features

- **WebGL-powered 3D rendering** with Three.js
- **Real-time data streaming** with SWR
- **TypeScript** for type safety
- **Modern React patterns** with hooks and context
- **Performance optimized** with Next.js 15 and Turbopack

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- Modern web browser with WebGL support

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AKR4PC/goquant-latency-visualizer.git
   cd goquant-latency-visualizer
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
goquant-latency-visualizer/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── charts/            # Analytics dashboard page
│   │   ├── globals.css        # Global styles and CSS variables
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Main homepage
│   ├── components/            # React components
│   │   ├── 3d/               # 3D visualization components
│   │   │   ├── GlobeDemo.tsx # Demo globe component
│   │   │   └── SimpleGlobe.tsx # Main globe visualization
│   │   ├── charts/           # Chart and analytics components
│   │   │   ├── LatencyChart.tsx
│   │   │   ├── LatencyHeatmap.tsx
│   │   │   ├── PerformanceMetrics.tsx
│   │   │   └── StatsDashboard.tsx
│   │   └── ui/               # UI components
│   │       ├── ThemeSwitcher.tsx
│   │       ├── NotificationCenter.tsx
│   │       ├── AdvancedFilters.tsx
│   │       └── ErrorBoundary.tsx
│   ├── data/                 # Static data and configurations
│   │   ├── exchanges.ts      # Exchange definitions
│   │   ├── cloudProviders.ts # Cloud provider configurations
│   │   └── globe-data-min.json # Globe geometry data
│   ├── hooks/                # Custom React hooks
│   │   └── useTheme.ts       # Theme management hook
│   ├── services/             # API and data services
│   │   └── latencyService.ts # Latency data generation
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts          # Main type exports
│   └── utils/                # Utility functions
├── public/                   # Static assets
├── .kiro/                    # Kiro IDE configuration
└── package.json              # Project dependencies
```

## 🛠️ Available Scripts

- **`npm run dev`** - Start development server with Turbopack
- **`npm run build`** - Build production application
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint for code quality

## 🎯 Key Components

### 3D Globe Visualization

The main globe component (`SimpleGlobe.tsx`) provides:

- Interactive 3D earth with country boundaries
- Real-time exchange markers with cloud provider colors
- Animated connection arcs showing latency data
- Smooth camera controls and auto-rotation
- Theme-aware rendering for dark/light modes

### Analytics Dashboard

Comprehensive analytics available at `/charts`:

- **Latency Trends**: Historical performance charts
- **Network Heatmap**: Visual latency representation
- **Statistics**: Real-time network metrics
- **Performance**: System monitoring dashboard

### Theme System

Advanced theming with:

- System preference detection
- Persistent theme storage
- Smooth transitions between modes
- CSS custom properties for consistency

## 🌐 Supported Exchanges

The visualizer includes major cryptocurrency exchanges:

| Exchange | Location                | Cloud Provider |
| -------- | ----------------------- | -------------- |
| Binance  | Singapore, Tokyo        | AWS            |
| Coinbase | San Francisco, New York | GCP            |
| Kraken   | San Francisco, London   | Azure          |
| OKX      | Hong Kong               | AWS            |
| Bybit    | Singapore               | GCP            |

## 📊 Data Sources

- **Real-time latency simulation** with realistic network delays
- **Geographic exchange locations** with accurate coordinates
- **Cloud provider mapping** for infrastructure visualization
- **Historical data generation** for trend analysis

## 🎨 Design System

### Colors

- **Primary**: Blue gradient (#2563eb to #3b82f6)
- **Secondary**: Slate tones for neutral elements
- **Accent**: Purple (#7c3aed) for highlights
- **Status**: Green (success), Yellow (warning), Red (error)

### Typography

- **Display**: JetBrains Mono for headings
- **Body**: JetBrains Mono for consistency
- **Monospace**: JetBrains Mono for data display

### Components

- **Glass morphism** effects with backdrop blur
- **Elevated cards** with subtle shadows
- **Smooth animations** with CSS transitions
- **Responsive grids** with Tailwind CSS

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for custom configuration:

```env
NEXT_PUBLIC_API_URL=your-api-endpoint
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Theme Customization

Modify CSS custom properties in `globals.css`:

```css
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --accent: #7c3aed;
}
```

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

WebGL support required for 3D visualization.

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export

```bash
npm run build
npm run export
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** for 3D rendering capabilities
- **Next.js** for the React framework
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **Recharts** for data visualization
- **Motion** for smooth animations

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/AKR4PC/goquant-latency-visualizer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AKR4PC/goquant-latency-visualizer/discussions)
- **Email**: Kumarakshat366@gmail.com

## 🔮 Roadmap

- [ ] Real API integration for live data
- [ ] Additional exchange support
- [ ] Advanced filtering options
- [ ] Export functionality for charts
- [ ] Mobile app version
- [ ] WebSocket real-time updates
- [ ] Custom alert system
- [ ] Performance benchmarking

---

**Built with ❤️ for the cryptocurrency trading community**

_GoQuant Latency Visualizer - Visualizing the speed of global finance_
