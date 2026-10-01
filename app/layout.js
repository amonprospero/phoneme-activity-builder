import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ThemeProvider from "../components/ThemeProvider";
import TimeTracker from "../components/TimeTracker";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Phoneme Activity Builder | Cloud-based Web Application",
  description: "Frontend builder for phoneme-based Wordle and Word Search activities for Speech Pathology teaching",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <a className="skip-link" href="#main-content">Skip to main content</a>
          <div className="app-wrapper">
            <Header />
            <main id="main-content" className="main-content" tabIndex={-1}>
              <TimeTracker />
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
