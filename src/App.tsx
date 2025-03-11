import { BrowserRouter } from 'react-router-dom';
import { LegacyAuthWrapper } from '@auth/ClerkAuthAdapter'; // Wraps authentication
import { AuthChecker } from '@components/Authentication/AuthChecker'; // Middleware to check auth
import { AppRoutes } from './routes'; // Import centralized routes

function App() {
  return (
    <LegacyAuthWrapper>
      <BrowserRouter>
        <AuthChecker>
          <AppRoutes />
        </AuthChecker>
      </BrowserRouter>
    </LegacyAuthWrapper>
  );
}

export default App;
