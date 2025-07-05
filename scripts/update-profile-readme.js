#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { execSync } = require('child_process');

// Configuration
const BLOG_POSTS_COUNT = 3; // Number of recent posts to show
const PORTFOLIO_URL = 'https://leo-mathurin.vercel.app'; // Your portfolio URL
const PROFILE_REPO = 'leo-mathurin/leo-mathurin'; // Your profile repository
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'en');

// Markers for where to insert blog posts in README
const START_MARKER = '<!-- BLOG-POST-LIST:START -->';
const END_MARKER = '<!-- BLOG-POST-LIST:END -->';

/**
 * Get all MDX files from the content directory
 */
function getMDXFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist`);
    return [];
  }
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

/**
 * Parse blog post metadata from MDX file
 */
function parsePost(filePath) {
  try {
    const source = fs.readFileSync(filePath, 'utf-8');
    const { data: metadata } = matter(source);
    const slug = path.basename(filePath, '.mdx');
    
    return {
      slug,
      title: metadata.title,
      publishedAt: metadata.publishedAt,
      summary: metadata.summary,
      url: `${PORTFOLIO_URL}/blog/${slug}`
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

/**
 * Get recent blog posts sorted by date
 */
function getRecentPosts() {
  const files = getMDXFiles(CONTENT_DIR);
  const posts = files
    .map(file => parsePost(path.join(CONTENT_DIR, file)))
    .filter(post => post !== null)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, BLOG_POSTS_COUNT);
  
  return posts;
}

/**
 * Format posts as markdown list
 */
function formatPostsAsMarkdown(posts) {
  if (posts.length === 0) {
    return '- No blog posts found';
  }
  
  return posts.map(post => `- [${post.title}](${post.url})`).join('\n');
}

/**
 * Clone or update the profile repository
 */
function setupProfileRepo() {
  const tempDir = path.join(__dirname, '..', 'temp');
  const profileDir = path.join(tempDir, 'leo-mathurin');
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Clone or pull the profile repository
  if (fs.existsSync(profileDir)) {
    console.log('📥 Updating existing profile repository...');
    execSync('git pull origin main', { cwd: profileDir, stdio: 'inherit' });
  } else {
    console.log('📥 Cloning profile repository...');
    // Use HTTPS with token for GitHub Actions
    const cloneUrl = process.env.GITHUB_ACTIONS 
      ? `https://github.com/${PROFILE_REPO}.git`
      : `https://github.com/${PROFILE_REPO}.git`;
    execSync(`git clone ${cloneUrl}`, { cwd: tempDir, stdio: 'inherit' });
  }
  
  return profileDir;
}

/**
 * Update profile README.md with recent blog posts
 */
function updateProfileReadme() {
  try {
    const profileDir = setupProfileRepo();
    const readmePath = path.join(profileDir, 'README.md');
    
    // Check if README exists
    if (!fs.existsSync(readmePath)) {
      console.error('README.md not found in profile repository');
      return false;
    }
    
    // Read current README content
    let readmeContent = fs.readFileSync(readmePath, 'utf-8');
    
    // Get recent posts
    const posts = getRecentPosts();
    const postsMarkdown = formatPostsAsMarkdown(posts);
    
    // Check if markers exist
    const hasStartMarker = readmeContent.includes(START_MARKER);
    const hasEndMarker = readmeContent.includes(END_MARKER);
    
    if (!hasStartMarker || !hasEndMarker) {
      console.log('Blog post markers not found in profile README.md');
      console.log('Please add the following markers where you want the blog posts to appear:');
      console.log(START_MARKER);
      console.log(END_MARKER);
      return false;
    }
    
    // Replace content between markers
    const startIndex = readmeContent.indexOf(START_MARKER);
    const endIndex = readmeContent.indexOf(END_MARKER) + END_MARKER.length;
    
    const beforeMarker = readmeContent.substring(0, startIndex);
    const afterMarker = readmeContent.substring(endIndex);
    
    const newContent = `${beforeMarker}${START_MARKER}\n${postsMarkdown}\n${END_MARKER}${afterMarker}`;
    
    // Write updated content
    fs.writeFileSync(readmePath, newContent, 'utf-8');
    
    console.log('✅ Profile README.md updated successfully with latest blog posts:');
    posts.forEach(post => {
      console.log(`  - ${post.title} (${post.publishedAt})`);
    });
    
    return { success: true, profileDir, posts };
  } catch (error) {
    console.error('Error updating profile README:', error);
    return { success: false, error };
  }
}

/**
 * Commit and push changes to profile repository
 */
function commitAndPush(profileDir) {
  try {
    // Check if there are changes
    const status = execSync('git status --porcelain', { cwd: profileDir, encoding: 'utf-8' });
    
    if (!status.trim()) {
      console.log('📝 No changes to commit');
      return true;
    }
    
    // Configure git user
    const gitName = process.env.GITHUB_ACTIONS ? 'GitHub Action' : 'Blog Auto-Update';
    const gitEmail = process.env.GITHUB_ACTIONS ? 'action@github.com' : 'action@github.com';
    
    execSync(`git config user.name "${gitName}"`, { cwd: profileDir });
    execSync(`git config user.email "${gitEmail}"`, { cwd: profileDir });
    
    // Add, commit, and push changes
    execSync('git add README.md', { cwd: profileDir });
    execSync('git commit -m "📰 Update README with latest blog posts"', { cwd: profileDir });
    execSync('git push origin main', { cwd: profileDir });
    
    console.log('🚀 Changes pushed to profile repository');
    return true;
  } catch (error) {
    console.error('Error committing and pushing changes:', error);
    return false;
  }
}

/**
 * Cleanup temporary directory
 */
function cleanup() {
  const tempDir = path.join(__dirname, '..', 'temp');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('🧹 Cleaned up temporary files');
  }
}

// Main execution
if (require.main === module) {
  console.log('🔄 Updating profile README.md with latest blog posts...');
  
  // Debug environment
  if (process.env.GITHUB_ACTIONS) {
    console.log('🏃 Running in GitHub Actions environment');
    console.log('📁 Current working directory:', process.cwd());
    console.log('📂 Directory contents:', require('fs').readdirSync('.'));
  }
  
  const result = updateProfileReadme();
  
  if (result.success) {
    // Only commit and push if we're in a GitHub Actions environment
    // or if FORCE_PUSH environment variable is set
    if (process.env.GITHUB_ACTIONS || process.env.FORCE_PUSH) {
      commitAndPush(result.profileDir);
    } else {
      console.log('💡 Skipping git push (not in GitHub Actions). Set FORCE_PUSH=1 to force push locally.');
    }
  }
  
  // Cleanup in GitHub Actions or if explicitly requested
  if (process.env.GITHUB_ACTIONS || process.env.CLEANUP) {
    cleanup();
  }
}

module.exports = { updateProfileReadme, getRecentPosts }; 