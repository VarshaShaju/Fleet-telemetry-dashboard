#!/bin/bash

# EV Fleet Dashboard Setup Script
# This script sets up the complete development environment

set -e  # Exit on any error

echo "🚗 EV Fleet Telemetry Dashboard Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install version 16 or higher."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Create necessary directories
echo "📁 Creating project structure..."
mkdir -p src/components/dashboard
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/hooks
mkdir -p src/stores
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/types
mkdir -p src/i18n
mkdir -p src/contexts
mkdir -p src/styles
mkdir -p src/__tests__
mkdir -p public

echo "✅ Project structure created"
echo ""

# Create essential configuration files
echo "⚙️  Creating configuration files..."

# Create TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Create Vite config
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          maps: ['leaflet', 'react-leaflet'],
          utils: ['date-fns', 'clsx'],
        },
      },
    },
  },
})
EOF

# Create ESLint config
cat > .eslintrc.cjs << 'EOF'
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react-hooks/exhaustive-deps': 'warn',
  },
}
EOF

# Create PostCSS config
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create environment file
cat > .env.example << 'EOF'
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Map Configuration  
VITE_MAP_CENTER_LAT=51.505
VITE_MAP_CENTER_LNG=-0.09
VITE_MAP_ZOOM=10

# Feature Flags
VITE_ENABLE_DEBUG=false
VITE_ENABLE_MOCK_DATA=true

# Update Intervals (milliseconds)
VITE_DATA_UPDATE_MIN=1000
VITE_DATA_UPDATE_MAX=5000
EOF

cp .env.example .env

# Create Jest config
cat > jest.config.js << 'EOF'
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
    }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx)'
  ],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
}
EOF

# Create main entry file
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize mock data for development
if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
  import('./services/mockData').then(({ initializeMockData }) => {
    initializeMockData();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Create global CSS
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  body {
    @apply antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 text-gray-900;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 shadow-soft rounded-lg;
  }
  
  .input-field {
    @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

/* Custom animations */
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.shimmer {
  animation: shimmer 1.5s ease-in-out infinite;
  background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
  background-size: 800px 104px;
}

/* Leaflet map customizations */
.leaflet-container {
  @apply rounded-lg;
}

.leaflet-popup-content-wrapper {
  @apply bg-white dark:bg-gray-800 text-gray-900 dark:text-white;
}

.leaflet-popup-tip {
  @apply bg-white dark:bg-gray-800;
}
EOF

# Create HTML template
cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/ev-icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Real-time EV Fleet Telemetry Dashboard for monitoring electric vehicle performance" />
    <meta name="keywords" content="EV, fleet management, telemetry, dashboard, electric vehicles" />
    <meta name="author" content="EV Dashboard Team" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="EV Fleet Telemetry Dashboard" />
    <meta property="og:description" content="Monitor your electric vehicle fleet in real-time" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="EV Fleet Telemetry Dashboard" />
    <meta property="twitter:description" content="Monitor your electric vehicle fleet in real-time" />
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    
    <title>EV Fleet Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Create setup test file
cat > src/setupTests.ts << 'EOF'
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb: any) {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
EOF

# Create gitignore
cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Testing
/coverage

# Build
/build

# Misc
.nyc_output
EOF

echo "✅ Configuration files created"
echo ""

# Run linter to check setup
echo "🔍 Running initial lint check..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Some lint issues found, but setup continues..."
else
    echo "✅ No lint issues found"
fi

echo ""

# Create a simple launch script
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting EV Fleet Dashboard..."
echo "=================================="
echo ""
echo "📊 Dashboard will be available at: http://localhost:5173"
echo "🛠️  To run tests: npm test"
echo "🏗️  To build for production: npm run build"
echo ""
npm run dev
EOF

chmod +x start.sh

# Final success message
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Your EV Fleet Dashboard is ready! Here's what you can do next:"
echo ""
echo "  📊 Start development server:"
echo "     ./start.sh"
echo "     or"
echo "     npm run dev"
echo ""
echo "  🧪 Run tests:"
echo "     npm test"
echo ""
echo "  🏗️  Build for production:"
echo "     npm run build"
echo ""
echo "  🔍 Lint code:"
echo "     npm run lint"
echo ""
echo "📖 Check out the README.md for detailed documentation"
echo "🐛 Report issues at: https://github.com/your-username/ev-fleet-dashboard/issues"
echo ""
echo "Happy coding! 🚗⚡"