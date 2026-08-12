import styles from './about.module.css';

export const metadata = {
  title: 'About | Phoneme Activity Builder',
};

export default function AboutPage() {
  return (
    <div className={styles.about}>
      <h1>About This Project</h1>

      <div className="panel" style={{ marginBottom: 20 }}>
        <h2>What is this?</h2>
        <p>
          Phoneme Activity Builder is a web tool for Speech Pathology teachers and students.
          It helps teachers create simple classroom activities that use phoneme symbols
          (broad HCE transcription) instead of normal English spelling. Students practise
          recognising phonemes through familiar game formats such as Wordle and word search.
        </p>
        <p style={{ marginTop: 10 }}>
          This is <strong>not</strong> a tool for therapy clients. It is intended for teaching
          and learning within Speech Pathology education.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <h2>Assessment 1 focus</h2>
        <p>
          Assessment 1 focuses on frontend design and usability. In this stage you can:
        </p>
        <ul className={styles.list}>
          <li>Configure a single phoneme Wordle (Phonemele) game and preview it</li>
          <li>Configure a small phoneme Word Search and preview the grid</li>
          <li>Generate and download a standalone HTML file that runs in any browser</li>
          <li>Switch between light and dark themes (saved in a cookie)</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          Later assessments will add word-list management, a database, and more advanced
          generation features so the builder can work with multiple words automatically.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <h2>How to use the website</h2>
        <ol className={styles.list}>
          <li>Go to the <strong>Wordle</strong> or <strong>Word Search</strong> page from the top menu.</li>
          <li>Enter the phoneme word(s), optional English gloss, number of guesses or grid size, and hint option.</li>
          <li>Click <strong>Generate</strong> to download the playable HTML file.</li>
          <li>Open the downloaded file in Chrome, Edge or Firefox. No server is required.</li>
        </ol>
        <p style={{ marginTop: 12, fontStyle: 'italic', color: 'var(--muted)' }}>
          In the submission video I will show my face, student ID, and explain how to use the website
          together with the main design decisions.
        </p>
      </div>

      <div className="panel">
        <h2>Student details</h2>
        <p><strong>Name:</strong> Timothy Felix Satria</p>
        <p><strong>Student number:</strong> 22465538</p>
        <p style={{ marginTop: 8, fontSize: '0.9rem', color: 'var(--muted)' }}>
          Cloud-based Web Application – Assessment 1 (Frontend Design and Usability)
        </p>
      </div>
    </div>
  );
}
