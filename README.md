# The Forge

A personal fitness and nutrition tracker built for two users, hosted on GitHub Pages.

Track workouts, log meals, and monitor progress — all from a lightweight static web app with no backend required.

Records stay in each browser's local storage. Use **Settings > Export** inside the app to create a portable JSON backup, and restore it before moving to a different browser or device. Version 2 backups include locally stored body-scan PDFs as well as workout, nutrition, and measurement data. The installed app shell works offline after the first successful load.

## Food imports

The Food tab keeps manual entry, recent foods, saved foods, recipes, and serving preferences in the existing local data model. Optional barcode lookups use the free Open Food Facts API only when the user submits a barcode. Results must be reviewed before they can be logged or saved.

Nutrition-label photos are read on-device with locally hosted Tesseract.js assets. Photos and recognized text are not uploaded or retained. OCR results are deliberately editable and require a food name because label recognition can misread serving sizes or numbers. Manual entry remains available if OCR or the external barcode database cannot provide a usable result.

## Body scans

The Body tab can import the consistent digital PDF report produced by EOS/Evolt 360 scanners. Parsing happens entirely in the browser: the original PDF is stored in IndexedDB on that device, while validated metrics are added to the Body charts, history, comparisons, and segmental view. The import review screen shows every extracted value before it is saved.

The current parser targets the tested EOS/Evolt report layout (`eos-evolt-v36_3`). Image-only scans, photographs, and materially different report templates are not silently guessed; they should be rejected for manual review until a matching parser or OCR workflow is added.

Bioelectrical-impedance measurements are useful for observing trends under similar testing conditions, but they are estimates and are not medical diagnoses.

**Live site:** https://trailerbrosaz.github.io/The-Forge/
