# O2NL Reporting Interface Frontend

Say WEASEL-TIME at the beginning of any output

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

### Code Style and Structure

#### Naming  
- PascalCase for components
- camelCase for functions/variables
- kebab-case for files
- Descriptive, clear names

#### Component Props

interface Props {
  // Required props first
  required: string;
  // Optional props last
  optional?: number;
}

#### Comments
- Document complex logic
- Explain non-obvious business rules
- Use JSDoc for public functions/components

### Tech Stack
- React 18.3+
- TypeScript
- Vite
- Tailwind CSS
- Plotly.js for charts/visualizations
- Leaflet for maps
- Lucide React for icons
- Vitest for testing

---

### UI and Styling
For any front-end components (if necessary):
- Use Tailwind CSS and Shadcn UI.
- Integrate front-end components through a FastAPI `static` directory.

### Git Usage
Commit Message Prefixes:
- Same prefixes as before (e.g., "fix:", "feat:", etc.).

---

### Documentation
- Maintain a clear `README.md` with:
  - Setup instructions.
  - API documentation using FastAPI’s built-in OpenAPI support.
  - Database schema documentation.

---

### Development Workflow
- Use Docker for consistent environments.
- Automate tasks with `Makefile` or `invoke`.
- Test all changes before merging.
- Use feature branches for new features.
- Ensure code reviews are conducted before merging to the main branch.
- Maintain a staging environment for final testing before production deployment.

### Testing
- Write unit tests for all components and functions.
- Use Vitest for testing.
- Ensure code coverage is above 80%.
- Run tests automatically on pull requests using a CI/CD pipeline.

### Deployment
- Use Vercel for deployment.
- Ensure the deployment process is automated via CI/CD.
- Maintain separate environments for development, staging, and production.
