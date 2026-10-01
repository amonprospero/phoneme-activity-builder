# Lighthouse accessibility notes (Assessment 3)

Run in Chrome DevTools → Lighthouse → Accessibility, or:

```
npx lighthouse http://localhost:3000 --only-categories=accessibility --quiet --chrome-flags="--headless"
```

## Scores after the Assessment 3 changes

| Page | Accessibility | What I changed |
| --- | --- | --- |
| Home `/` | ~95 | Skip link, main landmark, `lang="en"` already present |
| Words `/words` | ~92 | Labels stay with inputs; error text is visible |
| Dashboard `/dashboard` | ~94 | Headings in order, table headers, colour is not the only alert signal (text + colour) |
| Wordle `/wordle` | ~90 | Form labels on phoneme and English fields |

## Changes made after the first Lighthouse pass

1. Added a “Skip to main content” link.
2. Gave `<main>` an id and made it focusable.
3. Kept heading order on the dashboard (h1 then h2).
4. Alerts use words (“warning”, “failed generations”) not only red/yellow boxes.

These changes matter for teachers who tab through the builder and for students who use a screen reader on the generated HTML later.
