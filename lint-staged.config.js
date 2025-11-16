module.exports = {
  ignores: ["worktrees/**", "**/worktrees/**"],
  "**/*": "prettier --write --ignore-unknown",
  "*.{ts,tsx}": ["bunx eslint --fix", "bash -c 'bunx tscw --noEmit'"],
};
