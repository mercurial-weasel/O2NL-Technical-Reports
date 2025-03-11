import { useAuth, SignInButton, UserButton } from '@clerk/clerk-react';

export function Header() {
  const { isSignedIn, isLoaded } = useAuth();
  
  console.log('Header: Rendering with auth state', { isLoaded, isSignedIn });

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background-darker border-b border-border-subtle">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo section */}
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="h-8" />
            <span className="text-xl font-bold text-white">O2NL Dashboard</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <a href="/" className="text-white hover:text-gray-300">Home</a>
            <a href="/project-controls" className="text-white hover:text-gray-300">Project Controls</a>
          </nav>

          {/* User menu */}
          <div className="flex items-center gap-4">
            {isLoaded && (
              isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <SignInButton mode="modal">
                  <button className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-2 px-4 rounded">
                    Login
                  </button>
                </SignInButton>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}