import { execSync } from 'child_process';

console.log('Checking for cross-env installation...');

try {
  // Try to execute cross-env to check if it's installed
  execSync('npx cross-env --version', { stdio: 'ignore' });
  console.log('cross-env is already installed');
} catch (error) {
  console.log('Installing cross-env globally...');
  try {
    execSync('npm install -g cross-env', { stdio: 'inherit' });
    console.log('cross-env installed successfully');
  } catch (installError) {
    console.error('Failed to install cross-env globally. Trying locally...');
    try {
      execSync('npm install cross-env --save-dev', { stdio: 'inherit' });
      console.log('cross-env installed locally successfully');
    } catch (localInstallError) {
      console.error('Failed to install cross-env:', localInstallError);
    }
  }
}

console.log('All dependencies installed successfully');
