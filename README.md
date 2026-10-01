# Phoneme Activity Builder – Assessment 3

Student: Timothy Felix Satria · 22465538

GitHub repository (after you push, paste the real URL here and in Moodle):

https://github.com/amonprospero/phoneme-activity-builder

## Data model (feedback fix)

- `WordList` is reusable. Wordle and Word Search can share one list.
- `Word` belongs to a list, not to one activity only.
- `PhonemeUnit` stores each symbol in order (`tʃ` position 0, `ɪ` position 1, `n` position 2).
- `ActivitySet` points at a `WordList`.
- `UsageEvent` stores dashboard metrics.

## Run locally

If you already have an old SQLite file from Assessment 2, delete `prisma/dev.db` first, then:

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Open:
- http://localhost:3000/words
- http://localhost:3000/dashboard
- http://localhost:3000/health  (200 when the database is up, 503 if it is not)

## Docker

Compose has two services: `app` (Next.js production `npm start`) and `proxy` (nginx).
SQLite is stored in the named volume `phoneme-db`.

```bash
docker compose up --build
```

Then http://localhost:3000

## Playwright

```bash
npx playwright install chromium
npx playwright test
```

## JMeter

See `jmeter/RESULTS.md` and `jmeter/phoneme-load.jmx`.

## Lighthouse

See `docs/LIGHTHOUSE.md`.

## References (APA 7)

Fielding, R. T., & Reschke, K. (2022). *HTTP semantics* (RFC 9110). IETF. https://www.rfc-editor.org/rfc/rfc9110

Google. (n.d.). *Lighthouse accessibility scoring*. Chrome Developers. https://developer.chrome.com/docs/lighthouse/accessibility/scoring

Microsoft. (n.d.). *Playwright documentation*. https://playwright.dev/docs/intro

Next.js. (n.d.). *Data fetching and route handlers*. Vercel. https://nextjs.org/docs

Prisma. (n.d.). *Prisma schema reference*. https://www.prisma.io/docs/orm/prisma-schema

W3C. (2018). *Web content accessibility guidelines (WCAG) 2.1*. https://www.w3.org/TR/WCAG21/
