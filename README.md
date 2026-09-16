# Phoneme Activity Builder – Assessment 2

Backend, database and Docker layer for the Assessment 1 frontend builder.

**Subject:** Cloud-based Web Application  
**Student:** Timothy Felix Satria  
**Student number:** 22465538  

GitHub repository (replace with your link):  
`https://github.com/YOUR-USERNAME/phoneme-activity-builder`

## How this project was created

```bash
npx create-next-app@14 . --js --eslint --no-tailwind --no-src-dir --app --import-alias "@/*" --use-npm
```

Then Prisma, SQLite, API routes and Docker were added for Assessment 2.

## What was added in Assessment 2

- Prisma schema for activity sets and phoneme words
- REST APIs for create / read / update / delete
- `/health` returns 200 OK
- Words page to manage saved lists
- Wordle and Word Search can load stored data before generating HTML
- Dockerfile and docker-compose

Phonemes that use more than one character (`tʃ`, `iː`, `æɪ`) are stored as a space-separated string, for example `tʃ ɪ n`.

## Pages

- `/` Home
- `/words` CRUD for activity sets and words
- `/wordle` Wordle builder (can load saved sets)
- `/wordsearch` Word Search builder (can load saved sets)
- `/about` About
- `/settings` Theme
- `/health` Health check JSON

## API

- `GET /health`
- `GET /api/activities` and `GET /api/activities?type=WORDLE`
- `POST /api/activities`
- `GET /api/activities/:id`
- `PUT /api/activities/:id`
- `DELETE /api/activities/:id`
- `POST /api/activities/:id/words`
- `PUT /api/words/:id`
- `DELETE /api/words/:id`

## Run locally

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Open http://localhost:3000

## Run with Docker

```bash
docker compose up --build
```

Then open http://localhost:3000 and http://localhost:3000/health

## Submit

Remove `node_modules` and `.next` before zipping.
