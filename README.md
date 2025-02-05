### Project Context
This is a project that creates an Front end that displays data on O2NL. 

#### Folder Structure
The folder structure is as follows:

```
root/
├── .storybook/              # Storybook configuration
├── api/                     # API routes (Vercel serverless functions)
│   ├── spt/                 # SPT test data endpoints
│   └── staff/               # Staff data endpoints
├── src/
│   ├── api/                 # API client code
│   ├── components/          
│   │   ├── common/          # Reusable UI components
│   │   ├── Dashboards/      # Dashboard-specific components
│   │   ├── DisciplineDashboards/ # Discipline-specific dashboards
│   │   ├── home/           # Homepage components
│   │   └── Roadmap/        # Roadmap components
│   ├── constants/          # App-wide constants
│   ├── data/              
│   │   ├── config/         # API configuration
│   │   ├── constants/      # Data-related constants
│   │   ├── models/         # TypeScript models/types
│   │   └── types/          # API types
│   ├── lib/                # Utility libraries
│   └── types/              # Global TypeScript types
├── public/                 # Static assets
└── tests/                 # Test files

### Tech Stack
- React 18.3+
- TypeScript
- Vite
- Tailwind CSS
- Plotly.js for charts/visualizations
- Leaflet for maps
- Lucide React for icons
- Vitest for testing

### Setup Instructions
// ...existing code...
// Add detailed setup instructions here

### API Documentation
// ...existing code...
// Add API documentation using FastAPI’s built-in OpenAPI support

### Database Schema Documentation
// ...existing code...
// Add database schema documentation here

### Development Workflow
// ...existing code...
// Add detailed development workflow instructions here

### Testing
// ...existing code...
// Add detailed testing instructions here

### Deployment
// ...existing code...
// Add detailed deployment instructions here