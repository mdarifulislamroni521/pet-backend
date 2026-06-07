import fs from 'fs';
import path from 'path';

function fixImports(dir: string) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace instances of ../../../lib/ or ../../models/ etc. with @/lib/ and @/models/
      const regex = /from\s+['"](?:\.\.\/)+([^'"]+)['"]/g;
      let changed = false;
      content = content.replace(regex, (match, p1) => {
        // Only replace if it's pointing to lib, models, utils, or other root folders
        if (p1.startsWith('lib/') || p1.startsWith('models/') || p1.startsWith('utils/') || p1.startsWith('types/')) {
          changed = true;
          return `from '@/${p1}'`;
        }
        return match;
      });
      
      // Also fix imports like `import dbConnect from '../../../../lib/mongodb'` inside routes
      // Actually the regex above `(?:\.\.\/)+([^'"]+)` covers `../../../../lib/mongodb` where p1 = `lib/mongodb`
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  });
}

fixImports(path.join(process.cwd(), 'server', 'methods'));
