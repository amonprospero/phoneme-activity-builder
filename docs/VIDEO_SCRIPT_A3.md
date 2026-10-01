# Video script — Assessment 3 (3–8 minutes)

Student: Timothy Felix Satria  22465538

## 0:00–0:25 Face + ID
Show student card. Say:
Hi, my name is Timothy Felix Satria, student number 22465538. This is Assessment 3, data-driven application and reporting for the Phoneme Activity Builder.

## 0:25–0:50 GitHub
Open the repo homepage and the commits tab.
This is the same project from Assessment 1 and 2. The new commits add the dashboard, usage events, Playwright tests and the JMeter plan.

## 0:50–2:20 Dashboard
Open http://localhost:3000/dashboard
Click Add simulated records, then Refresh.
The cards show how many Wordle and Word Search sets are stored, successful and failed HTML generations, average time on page, and the most used activity type. Alerts appear if a set has no words or if failures are high. Time on page is stored when I leave a page.

## 2:20–3:20 Data flow
Open /words quickly, then /wordle.
Teachers save phoneme lists in the database. When they generate HTML, the app writes GENERATE_SUCCESS or GENERATE_FAIL. The dashboard only reads those stored records.

## 3:20–4:10 Health
Open /health. Show status 200 and database connected.

## 4:10–5:20 Playwright
In the terminal:
npx playwright test
Show the two passing tests: CRUD on Words, and generating a Wordle file.

## 5:20–6:20 JMeter
Open jmeter/RESULTS.md
Explain x1 and x10 are fine for a class. x100 gets slower. x1000 and x10000 show SQLite and the dev server are not for huge traffic.

## 6:20–7:10 Lighthouse
Open DevTools Lighthouse on Home or Dashboard.
Accessibility is in the 90s after I added a skip link and clearer alert text.

## 7:10–7:40 Close
Assessment 3 is about seeing the builder work over time, not only generating one HTML file. Thank you.
