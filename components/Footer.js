import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>
          Timothy Felix Satria &nbsp;|&nbsp; Student No: 22465538
        </p>
        <p className={styles.small}>
          Cloud-based Web Application – Phoneme Activity Builder (Assessment 1)
        </p>
      </div>
    </footer>
  );
}
