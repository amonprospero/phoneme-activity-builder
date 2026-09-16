import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>Phoneme Activity Builder</h1>
        <p className={styles.lead}>
          A simple tool that helps Speech Pathology teachers create phoneme-based classroom activities.
          Build a Wordle-style game or a Word Search using HCE phoneme symbols. Word lists and
          activity settings are stored in a database. You can still download a single HTML file
          that runs in any web browser.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/wordle" className="btn">
            Create Wordle
          </Link>
          <Link href="/wordsearch" className="btn btn-secondary">
            Create Word Search
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className="panel">
          <h2>Wordle (Phonemele)</h2>
          <p>
            Set one phoneme word, choose the number of guesses and whether to show hints.
            Generate a playable HTML page with an on-screen phoneme keyboard.
          </p>
          <Link href="/wordle" className={styles.moreLink}>Go to Wordle builder →</Link>
        </div>
        <div className="panel">
          <h2>Word Search</h2>
          <p>
            Enter a short list of phoneme words. The tool creates a puzzle grid that students
            can solve by selecting cells. Download a ready-to-use HTML file.
          </p>
          <Link href="/wordsearch" className={styles.moreLink}>Go to Word Search builder →</Link>
        </div>
        <div className="panel">
          <h2>Saved word lists</h2>
          <p>
            Create, edit and delete phoneme word lists on the Words page. Those saved
            sets can be loaded into Wordle or Word Search before you generate HTML.
          </p>
          <Link href="/words" className={styles.moreLink}>Manage words →</Link>
        </div>
        <div className="panel">
          <h2>Why phonemes?</h2>
          <p>
            This tool is designed for Speech Pathology teaching, not for clients.
            Using broad HCE transcription helps students practise phoneme recognition
            in a simple game format.
          </p>
          <Link href="/about" className={styles.moreLink}>About this project →</Link>
        </div>
      </section>

      <section className={styles.note}>
        <p>
          <strong>Assessment 2:</strong> The builder now uses a Prisma + SQLite database,
          REST APIs, and Docker. Check <code>/health</code> for a 200 OK response.
        </p>
      </section>
    </div>
  );
}
