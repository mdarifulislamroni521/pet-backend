import fs from 'fs';
import path from 'path';

function fixDirectory(dir: string) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixDirectory(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix: return res.json({ ... }, { status: 400 }); -> return res.status(400).json({ ... });
      // This regex matches `res.json( ... , { status: XYZ } )` across multiple lines
      const regex = /res\.json\s*\(([\s\S]*?),\s*\{\s*status:\s*(\d+)\s*\}\s*\)/g;
      content = content.replace(regex, 'res.status($2).json($1)');
      
      fs.writeFileSync(fullPath, content);
    }
  });
}

fixDirectory(path.join(process.cwd(), 'server', 'methods'));
