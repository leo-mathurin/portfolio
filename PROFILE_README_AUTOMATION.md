# GitHub Profile README Automation

This guide explains how to set up automatic updates for your GitHub profile README with the latest blog posts from your portfolio.

## 🎯 What This Does

- Automatically updates your **GitHub profile repository** (`leo-mathurin/leo-mathurin`) README.md
- Pulls the latest blog posts from your **portfolio repository** (`leo-mathurin/portfolio`)
- Runs automatically when you add new blog posts or on a daily schedule
- Can be triggered manually via GitHub Actions

## 📋 Prerequisites

1. **GitHub Profile Repository**: You need a repository named `leo-mathurin/leo-mathurin` (your username)
2. **Personal Access Token**: Required for cross-repository access
3. **Blog Post Markers**: Special HTML comments in your profile README.md
4. **pnpm**: The project uses pnpm as package manager (already configured in workflow)

## 🔧 Setup Instructions

### Step 1: Create Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Profile README Blog Updates"
4. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `public_repo` (Access to public repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### Step 2: Add Token to Repository Secrets

1. Go to your **portfolio repository** (`leo-mathurin/portfolio`)
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Name: `PERSONAL_ACCESS_TOKEN`
5. Value: Paste the token you copied in Step 1
6. Click "Add secret"

### Step 3: Update Your Profile README

Add these markers to your profile README.md (`leo-mathurin/leo-mathurin/README.md`) where you want the blog posts to appear:

```markdown
## 📰 Recent Blog Posts

<!-- BLOG-POST-LIST:START -->
<!-- BLOG-POST-LIST:END -->
```

**Example profile README structure:**
```markdown
# Hi there! 👋

I'm Léo Mathurin, a tech professional with expertise in security, web development, and system architecture.

## 📰 Recent Blog Posts

<!-- BLOG-POST-LIST:START -->
- [How to Secure Your Digital Life: A Practical Guide](https://leo-mathurin.vercel.app/blog/secure-your-digital-life)
- [Pi Network: How I Transformed a Simple Game Among Friends into Profitable Crypto](https://leo-mathurin.vercel.app/blog/pi-network)
- [Running a Free Minecraft Server on Oracle Cloud](https://leo-mathurin.vercel.app/blog/oracle-vm-minecraft-server)
<!-- BLOG-POST-LIST:END -->

## 🚀 About Me

- 🔭 I'm currently working on...
- 🌱 I'm currently learning...
```

### Step 4: Test the Setup

1. **Local Testing** (optional):
   ```bash
   # In your portfolio repository
   pnpm update-profile-readme
   ```

2. **GitHub Actions Testing**:
   - Go to your portfolio repository
   - Navigate to Actions tab
   - Find "Update Profile README with Latest Blog Posts"
   - Click "Run workflow" to test manually

## 🔄 How It Works

### Automatic Triggers
- **Content Updates**: Runs when you modify any `.mdx` file in `content/` directory
- **Daily Schedule**: Runs every day at 8 AM UTC
- **Manual Trigger**: Can be run manually from GitHub Actions

### Process Flow
1. **Fetch Blog Posts**: Reads your latest blog posts from `content/en/` directory
2. **Parse Metadata**: Extracts title, date, and summary from MDX frontmatter
3. **Clone Profile Repo**: Downloads your profile repository to a temporary directory
4. **Update README**: Replaces content between the markers with latest posts
5. **Commit & Push**: Automatically commits and pushes changes to your profile repo

## 📁 File Structure

```
portfolio/
├── scripts/
│   ├── update-profile-readme.js    # Main automation script
│   └── update-readme.js            # Local portfolio README script
├── .github/workflows/
│   └── update-readme.yml           # GitHub Actions workflow
└── content/en/                     # Blog posts directory
    ├── post1.mdx
    ├── post2.mdx
    └── post3.mdx
```

## ⚙️ Configuration

You can customize the automation by editing `scripts/update-profile-readme.js`:

```javascript
// Configuration options
const BLOG_POSTS_COUNT = 3; // Number of recent posts to show
const PORTFOLIO_URL = 'https://leo-mathurin.vercel.app'; // Your portfolio URL
const PROFILE_REPO = 'leo-mathurin/leo-mathurin'; // Your profile repository
```

## 🐛 Troubleshooting

### Common Issues

1. **"Blog post markers not found"**
   - Make sure you've added the HTML comment markers to your profile README.md
   - Check that the markers are exactly: `<!-- BLOG-POST-LIST:START -->` and `<!-- BLOG-POST-LIST:END -->`

2. **"Permission denied" errors**
   - Verify your Personal Access Token has the correct scopes
   - Make sure the token is added to repository secrets as `PERSONAL_ACCESS_TOKEN`

3. **"Repository not found"**
   - Ensure your profile repository exists and is named correctly (`username/username`)
   - Check that the repository is public or your token has access to private repos

4. **Posts not updating**
   - Verify your blog posts have proper frontmatter with `title`, `publishedAt`, and `summary`
   - Check that the workflow is triggered (look in Actions tab)

5. **"Dependencies lock file is not found" error**
   - This happens when the workflow tries to use npm instead of pnpm
   - Make sure the workflow uses pnpm setup (already fixed in current version)

6. **Git submodule errors**
   - Clean up any temporary directories: `rm -rf temp/`
   - Make sure `temp/` is in your `.gitignore` file

### Debug Mode

For local debugging, you can run:
```bash
# Enable debug output
DEBUG=1 node scripts/update-profile-readme.js

# Force push changes locally (be careful!)
FORCE_PUSH=1 node scripts/update-profile-readme.js
```

## 🔒 Security Notes

- The Personal Access Token is stored securely in GitHub Secrets
- The token is only used during GitHub Actions execution
- Temporary files are cleaned up after each run
- The automation only modifies the README.md file in your profile repository

## 📚 Additional Resources

- [GitHub Profile README Guide](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

## 🎉 Next Steps

Once set up, your GitHub profile will automatically stay updated with your latest blog posts! Every time you publish a new post to your portfolio, it will appear on your GitHub profile within minutes.

You can also customize the formatting, add more metadata, or extend the automation to include other dynamic content. 