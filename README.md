# Denta Spectra

Vue + Vite educational oral-health workspace for local simulations, sample-driven color and sound explorations, and private device-local note keeping. It is not a medical device and does not diagnose oral disease or recommend treatment.

## Run locally

```sh
npm install
npm run dev
```

`npm run build` produces the static web bundle in `dist/`. The UI uses pure JavaScript Vue SFCs and does not require Rust or Go to build.

## Native Android

`capacitor.config.json` is prepared for a Capacitor Android wrapper. The Java plugin source is Java 17-compatible; Capacitor 8's Android build uses JDK 21 in CI. The workflow builds a **debug** APK and uploads it as a workflow artifact; it does not sign a production release or publish to Vercel. A signed release requires a separately configured signing key and versioning strategy. The website intentionally does not pretend that a text file or generated ZIP is an installable APK.

## Scope and safety

Camera RGB is not calibrated quantitative light-induced fluorescence or dental shade measurement. Phone audio is not a validated TMJ diagnosis or toothbrush force sensor. The pH chart is a toy educational model; fee figures are generic examples, not regional fee schedules or treatment-necessity rules. Use qualified dental care for symptoms and decisions.

All browser records are local-first. There is no remote sync service configured in this demo.
