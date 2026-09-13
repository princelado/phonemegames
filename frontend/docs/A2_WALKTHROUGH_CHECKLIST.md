# Assessment 2 walkthrough checklist

Use this checklist before recording the required demonstration.

## 1. Install and start locally

- Confirm Node.js is 22.5 or later: `node -v`
- Run `npm install`
- Run `npm run dev`
- Open `http://localhost:3000`

## 2. Demonstrate database CRUD

Open **Manage Data**.

1. **Create:** add a word such as `chat` with phonemes `tʃ æ t`.
2. **Read:** show that the new word appears in the Stored Words table.
3. **Update:** click Edit, change its hint, and save.
4. **Delete:** delete the word and show that it disappears.
5. Create an additional Wordle or Word Search activity configuration using several stored words.

Explain that the backend stores:
- words
- ordered phonemes
- activity settings
- multiple activity configurations
- the many-to-many relationship between activities and words

## 3. Demonstrate frontend/backend integration

- Open **Wordle** and select a saved database-backed configuration.
- Show that the word selector is populated from stored data.
- Generate the standalone Wordle HTML file.
- Open **Word Search** and show that its list/grid is populated from a saved activity.
- Generate the standalone Word Search HTML file.

## 4. Demonstrate validation/error handling

On Manage Data, try to submit a word without phonemes. The request should be rejected with a clear message.

Optional API demonstration in the browser/dev tools:
- `GET /api/words`
- `GET /api/activities`

## 5. Demonstrate the health endpoint

Open:

`http://localhost:3000/health`

Expected result:

```json
{"status":"ok","database":"connected"}
```

The HTTP response status should be 200.

## 6. Demonstrate Docker

Stop the local dev server first, then run:

```bash
docker compose up --build
```

Open `http://localhost:3000` and `http://localhost:3000/health` again.

The `phoneme_data` Docker volume provides persistent database storage.

Stop Docker afterwards:

```bash
docker compose down
```

## 7. GitHub / submission cleanup

Before the final submission:

- Push the Assessment 2 changes to `https://github.com/princelado/phonemegames`
- Use clear commits rather than one giant final commit.
- Confirm the README is current.
- Remove `node_modules`, `.next`, and generated database files before zipping.
- Include the GitHub repository link with the submission.
- Record the video with student ID in the first 30 seconds, face visible, and narration throughout.
