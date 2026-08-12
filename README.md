# Phoneme Activity Builder – Assessment 1

Frontend builder for phoneme-based Wordle (Phonemele) and Word Search activities.

**Subject:** Cloud-based Web Application  
**Student:** Timothy Felix Satria  
**Student number:** 22465538  

## How this project was created

```bash
npx create-next-app@14 . --js --eslint --no-tailwind --no-src-dir --app --import-alias "@/*" --use-npm
```

## Pages

- `/` – Home
- `/about` – Project explanation and student details
- `/wordle` – Wordle (Phonemele) builder → downloads a playable HTML file
- `/wordsearch` – Word Search builder → downloads a playable HTML file
- `/settings` – Light / Dark theme (saved in a cookie)

## How to run

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## How to generate an activity

1. Go to the Wordle or Word Search page
2. Enter the phoneme word(s) and options
3. Click **GENERATE HTML**
4. Open the downloaded `.html` file in any browser (no server needed)

## Technical notes (Assessment 1)

- React with Next.js App Router and modular components
- Responsive layout with hamburger menu for mobile
- Pure CSS (CSS variables for light/dark theme)
- Generated activities are single, self-contained HTML files
- Phoneme keyboard and sample words based on the provided HCE corpus
- Hover hints on keyboard keys
- No database yet (planned for later assessments)

## Folder structure

```
app/
  page.js              # Home
  about/page.js
  wordle/page.js
  wordsearch/page.js
  settings/page.js
  layout.js
  globals.css
components/
  Header.js
  Footer.js
  ThemeProvider.js
lib/
  phonemes.js          # keyboard, hints, sample words
```
