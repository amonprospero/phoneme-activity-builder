# JMeter staged load results (Assessment 3)

Target: `http://localhost:3000` while `npm run dev` is running.
Plan file: `jmeter/phoneme-load.jmx`
Requests: GET `/health`, GET `/api/activities`, GET `/api/metrics/summary`

Run example:

```
jmeter -n -t jmeter/phoneme-load.jmx -Jusers=10 -l jmeter/results-x10.jtl
```

| Stage | Threads | Ramp (s) | Loops | Avg response (ms) | Error % | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| x1 | 1 | 1 | 5 | 18 | 0 | Warm machine, all 200 |
| x10 | 10 | 5 | 5 | 42 | 0 | Still stable |
| x100 | 100 | 10 | 5 | 160 | 0 | Next.js dev server slower, no failures |
| x1000 | 1000 | 30 | 3 | 890 | 1.2 | Some timeouts on /api/activities |
| x10000 | 10000 | 60 | 1 | 2400+ | 18 | SQLite + Next dev cannot hold this. Errors rise. |

Interpretation for the video:
- The builder is fine for a classroom (x1–x10 teachers).
- Around x100 the pages still open but the average time grows.
- x1000 and x10000 are not a real classroom size. They show the limit of SQLite and the Next.js dev server. For Assessment 4 a hosted database and `next start` would be the next step.
