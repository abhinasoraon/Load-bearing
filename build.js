// Runs on Netlify each time you commit. Gathers every file in content/posts into posts.json.
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'content', 'posts');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')) : [];
const posts = [];
const problems = [];

for (const f of files) {
  try {
    const text = fs.readFileSync(path.join(dir, f), 'utf8').replace(/^\uFEFF/, '');
    const post = JSON.parse(text);
    if (!post.title || !post.excerpt) throw new Error('needs a "title" and an "excerpt"');
    posts.push(post);
  } catch (e) {
    problems.push('  ' + f + '  ->  ' + e.message);
  }
}

if (problems.length) {
  console.error('\nPROBLEM IN YOUR POST FILES (fix these on GitHub):\n' + problems.join('\n') + '\n');
  process.exit(1);
}

posts.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
fs.writeFileSync(path.join(__dirname, 'posts.json'), JSON.stringify(posts));
console.log('Built posts.json with ' + posts.length + ' post(s).');
