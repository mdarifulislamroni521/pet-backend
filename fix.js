const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('app');
let changed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.split('\\${process.env.NEXT_PUBLIC_API_BASE_URL}').join('${process.env.NEXT_PUBLIC_API_BASE_URL}');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    changed++;
    console.log('Fixed ' + file);
  }
});

console.log('Total files fixed: ' + changed);
