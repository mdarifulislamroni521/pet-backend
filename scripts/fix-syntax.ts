import fs from 'fs';
import path from 'path';

function fixSyntax(dir: string) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixSyntax(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix await request.json()
      content = content.replace(/await request\.json\(\)/g, 'req.body');
      
      // Fix session usages
      content = content.replace(/session\.user\.id/g, 'authUser?.userID');
      content = content.replace(/session\.user\.email/g, 'authUser?.email');
      content = content.replace(/session\.user\.role/g, 'authUser?.role');
      
      // Fix 'user' shadowing by renaming the auth user to authUser
      content = content.replace(/const user = req\.authResponse;/g, 'const authUser = req.authResponse;');
      content = content.replace(/if \(!user\?\.email\)/g, 'if (!authUser?.email)');
      content = content.replace(/if \(!user\?\.id\)/g, 'if (!authUser?.userID)');
      content = content.replace(/const userRole = user\?\.role/g, 'const userRole = authUser?.role');
      content = content.replace(/user\?\.role ===/g, 'authUser?.role ===');
      content = content.replace(/user\?\.role/g, 'authUser?.role');
      
      fs.writeFileSync(fullPath, content);
    }
  });
}

fixSyntax(path.join(process.cwd(), 'server', 'methods'));
