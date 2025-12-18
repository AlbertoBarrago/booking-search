# Publishing to NPM

## Prerequisites

1. Create an NPM account at https://www.npmjs.com/signup
2. Login to NPM via CLI:
   ```bash
   npm login
   ```

## Before Publishing

1. **Update package.json**:
   - Update `version` field (follow semver: major.minor.patch)
   - Add your `author` name/email
   - Update `repository` URLs with your actual GitHub repo
   - Update `bugs` and `homepage` URLs

2. **Run all checks**:
   ```bash
   # Type check
   bun run type-check

   # Run tests
   bun run test

   # Build the package
   bun run build
   ```

3. **Test the package locally**:
   ```bash
   # Pack the package to see what will be published
   npm pack

   # This creates a .tgz file you can inspect
   ```

## Publishing

### First Release

```bash
npm publish --access public
```

Note: Use `--access public` for scoped packages (packages starting with @)

### Subsequent Releases

1. Update the version in `package.json`:
   ```bash
   npm version patch  # for bug fixes (1.0.0 -> 1.0.1)
   npm version minor  # for new features (1.0.0 -> 1.1.0)
   npm version major  # for breaking changes (1.0.0 -> 2.0.0)
   ```

2. Publish:
   ```bash
   npm publish
   ```

## What Gets Published

The following files/folders are included (as defined in `package.json` `files` field):
- `dist/` - Built JavaScript files
- `src/` - Source TypeScript files
- `README.md` - Documentation

The following are excluded (via `.npmignore`):
- Test files
- Development files (index.ts, demo.tsx, etc.)
- Coverage reports
- Configuration files

## Post-Publishing

1. Create a git tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. Update the npm version badge in README.md if needed

3. Announce your package!

## Troubleshooting

### "Package name already exists"
- Choose a different package name in `package.json`
- For scoped packages, use your username: `@yourusername/booking-widget`

### "You must be logged in to publish"
- Run `npm login` and enter your credentials

### "You do not have permission to publish"
- Make sure you're logged in with the correct account
- For scoped packages, add `--access public`

## CI/CD (Optional)

You can automate publishing using GitHub Actions. Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test
      - run: bun run build
      - uses: JS-DevTools/npm-publish@v1
        with:
          token: ${{ secrets.NPM_TOKEN }}
```

Remember to add your NPM token as a GitHub secret named `NPM_TOKEN`.
