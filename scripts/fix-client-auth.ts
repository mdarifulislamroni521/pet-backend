import fs from 'fs';
import path from 'path';

function fixClientAuth(dir: string) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixClientAuth(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;

      if (content.includes('next-auth/react') || content.includes('next-auth/next') || content.includes('next-auth')) {
        // Calculate relative path to AuthContext
        const depth = fullPath.replace(process.cwd() + '/app/', '').split('/').length - 1;
        const relativePrefix = depth === 0 ? './' : '../'.repeat(depth);
        const authContextPath = `${relativePrefix}contexts/AuthContext`;

        content = content.replace(/import\s+\{\s*useSession\s*\}\s+from\s+['"]next-auth\/react['"];?\n?/g, `import { useAuth } from '${authContextPath}';\n`);
        content = content.replace(/import\s+\{\s*useSession,\s*signOut\s*\}\s+from\s+['"]next-auth\/react['"];?\n?/g, `import { useAuth } from '${authContextPath}';\n`);
        
        content = content.replace(/const\s+\{\s*data:\s*session,\s*status\s*\}\s*=\s*useSession\(\);?/g, 'const { user, loading: statusLoading, logout } = useAuth();\n  const status = statusLoading ? "loading" : (user ? "authenticated" : "unauthenticated");\n  const session = user ? { user } : null;');
        
        content = content.replace(/const\s+\{\s*data:\s*session\s*\}\s*=\s*useSession\(\);?/g, 'const { user, logout } = useAuth();\n  const session = user ? { user } : null;');

        content = content.replace(/signOut\(\s*\{[^}]*\}\s*\)/g, 'logout()');
        content = content.replace(/signOut\(\)/g, 'logout()');

        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  });
}

fixClientAuth(path.join(process.cwd(), 'app'));
