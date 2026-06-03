# Event Decor Data

Add future event Decor Pikmin by creating a JSON file in this folder.

Each file may include metadata such as `event`, `source`, and `lastUpdated`, but the app only requires a `definitions` array using the same shape as `app/data/decor.json`.

Files are loaded automatically by `useDecorData.ts`; no application code changes are needed when adding a new event JSON file.
