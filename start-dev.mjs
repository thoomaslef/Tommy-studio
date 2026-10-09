import { execSync } from 'child_process';
execSync('npx next dev -p 3456', { stdio: 'inherit', cwd: '.' });
