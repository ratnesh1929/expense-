# Ganpati App

A modern React application built with Vite.

## Features

- ⚡️ Fast development with Vite
- ⚛️ React 18 with modern hooks
- 🎨 CSS with modern styling
- 📱 Responsive design
- 🔧 ESLint configuration
- 🎯 Hot Module Replacement (HMR)

## Project Structure

```
ganpati/
├── public/                 # Static assets
│   └── vite.svg           # Vite logo
├── src/                   # Source code
│   ├── assets/            # Images, fonts, etc.
│   │   └── logo.svg       # App logo
│   ├── components/        # Reusable components
│   │   ├── Header.jsx     # Header component
│   │   └── Header.css     # Header styles
│   ├── hooks/             # Custom React hooks
│   │   └── useLocalStorage.js
│   ├── utils/             # Utility functions
│   │   └── helpers.js
│   ├── App.jsx            # Main App component
│   ├── App.css            # App styles
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── .eslintrc.cjs          # ESLint configuration
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ganpati
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development

The project uses:
- **Vite** for fast development and building
- **React 18** with modern features
- **ESLint** for code quality
- **CSS** for styling

## Building for Production

```bash
npm run build
```

This will create a `dist` folder with optimized production files.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 