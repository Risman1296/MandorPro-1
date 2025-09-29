# Brand Logo Assets

Place your source logo image here as `logo.png`.

Recommended: transparent PNG, minimum 1024x1024 for best quality.

Then run:

```powershell
npm i -D sharp
npm run logo:gen
```

This will generate:

- assets/icon.png (app icon)
- assets/adaptive-icon.png (Android adaptive)
- assets/favicon.png (web)
- assets/splash-icon.png (center logo for splash)

The app.json is already configured to use these paths.
