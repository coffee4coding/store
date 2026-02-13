# Complete Guide: Push Store Platform to GitHub

## Step-by-Step Terminal Commands

### Step 1: Navigate to your project directory
```bash
cd /home/rahul/store-platform
```

### Step 2: Check if git is already initialized
```bash
git status
```

**If you see "fatal: not a git repository"**, proceed to Step 3.
**If you see file listings**, skip to Step 5.

### Step 3: Initialize git repository (if not already done)
```bash
git init
```

### Step 4: Configure git user (if not already configured)
```bash
git config user.email "coffee4coding@users.noreply.github.com"
git config user.name "coffee4coding"
```

### Step 5: Check/create .gitignore file
```bash
# Check if .gitignore exists
ls -la .gitignore

# If it doesn't exist, create it (optional - already created)
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
**/node_modules/

# Database
*.db
*.sqlite
*.sqlite3
backend/db/controlplane.db

# Build outputs
build/
dist/
*.log

# Environment files
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Cache
.cache/
*.cache

# Coverage
coverage/
.nyc_output/
EOF
```

### Step 6: Remove any embedded git repositories (if frontend has its own .git)
```bash
# Check if frontend has .git folder
ls -la frontend/.git

# If it exists, remove it
rm -rf frontend/.git
```

### Step 7: Add all files to git
```bash
git add .
```

### Step 8: Check what will be committed
```bash
git status
```

### Step 9: Commit your changes
```bash
git commit -m "Initial commit: Store Provisioning Platform with backend API, React dashboard, and provisioning orchestration"
```

### Step 10: Set the branch name to 'main' (GitHub's default)
```bash
git branch -M main
```

### Step 11: Add GitHub remote repository
```bash
git remote add origin https://github.com/coffee4coding/-Store_Provisioning_Platform.git
```

**If you get "remote origin already exists"**, update it with:
```bash
git remote set-url origin https://github.com/coffee4coding/-Store_Provisioning_Platform.git
```

### Step 12: Verify remote is set correctly
```bash
git remote -v
```

You should see:
```
origin  https://github.com/coffee4coding/-Store_Provisioning_Platform.git (fetch)
origin  https://github.com/coffee4coding/-Store_Provisioning_Platform.git (push)
```

### Step 13: Push to GitHub

**Option A: Using Personal Access Token (Recommended)**

1. First, create a token:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name it: `store-platform-push`
   - Select scope: **`repo`** (check the box)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. Then push:
```bash
git push -u origin main
```

When prompted:
- **Username**: `coffee4coding`
- **Password**: Paste your **Personal Access Token** (not your GitHub password!)

**Option B: Using GitHub CLI (if installed)**
```bash
# Authenticate first
gh auth login

# Then push
git push -u origin main
```

**Option C: Using SSH (if you have SSH keys set up)**
```bash
# Change remote to SSH
git remote set-url origin git@github.com:coffee4coding/-Store_Provisioning_Platform.git

# Push
git push -u origin main
```

---

## Complete Command Sequence (Copy-Paste Ready)

If you're starting fresh, here's the complete sequence:

```bash
# Navigate to project
cd /home/rahul/store-platform

# Initialize git (if needed)
git init

# Configure user
git config user.email "coffee4coding@users.noreply.github.com"
git config user.name "coffee4coding"

# Remove embedded git repos
rm -rf frontend/.git 2>/dev/null

# Add all files
git add .

# Commit
git commit -m "Initial commit: Store Provisioning Platform"

# Rename branch to main
git branch -M main

# Add remote
git remote add origin https://github.com/coffee4coding/-Store_Provisioning_Platform.git

# Verify remote
git remote -v

# Push (will prompt for credentials)
git push -u origin main
```

---

## Troubleshooting

### If push fails with "authentication failed":
- Make sure you're using a **Personal Access Token**, not your GitHub password
- Token must have `repo` scope

### If push fails with "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/coffee4coding/-Store_Provisioning_Platform.git
```

### If you need to update your commit:
```bash
git add .
git commit --amend -m "Updated commit message"
git push -u origin main --force
```

### To check what's been committed:
```bash
git log --oneline
```

### To see what files will be pushed:
```bash
git ls-files
```

---

## After Successful Push

Your repository will be available at:
**https://github.com/coffee4coding/-Store_Provisioning_Platform**

You can verify by visiting the URL in your browser!
