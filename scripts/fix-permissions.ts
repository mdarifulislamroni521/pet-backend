import fs from 'fs';
import path from 'path';

function fixPermissions(dir: string) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixPermissions(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;

      if (content.includes('requirePermission') || content.includes('requireAnyPermission') || content.includes('requireAuth')) {
        // Remove old import
        content = content.replace(/import\s+\{([^}]*require(Permission|Auth|AnyPermission)[^}]*)\}\s+from\s+['"]@\/lib\/auth-middleware['"];?\n?/g, '');
        content = content.replace(/import\s+\{([^}]*require(Permission|Auth|AnyPermission)[^}]*)\}\s+from\s+['"]\.\.\/\.\.\/lib\/auth-middleware['"];?\n?/g, '');
        
        // Add new import
        if (!content.includes('import { hasPermission } from "@/lib/permissions";')) {
          content = `import { hasPermission, UserRole } from "@/lib/permissions";\n` + content;
        }

        // Replace requirePermission
        content = content.replace(/await\s+requirePermission\s*\(\s*['"](.*?)['"]\s*\);?/g, 
          `if (!hasPermission(req.authResponse?.role as UserRole, '$1')) {\n      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });\n    }`);

        // Replace requireAnyPermission
        content = content.replace(/await\s+requireAnyPermission\s*\(\s*(\[.*?\])\s*\);?/gs, 
          `const permissions = $1;
    if (!permissions.some(p => hasPermission(req.authResponse?.role as UserRole, p))) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }`);
        
        // Replace requireAuth (if assigned to variable)
        content = content.replace(/const\s+auth\s*=\s*await\s+requireAuth\(\);?/g, 'const auth = { user: req.authResponse };');
        content = content.replace(/await\s+requireAuth\(\);?/g, '');

        changed = true;
      }

      // Also remove any remaining imports of next/headers just in case
      if (content.includes('next/headers')) {
        content = content.replace(/import\s+\{.*\}\s+from\s+['"]next\/headers['"];?\n?/g, '');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  });
}

fixPermissions(path.join(process.cwd(), 'server', 'methods'));
