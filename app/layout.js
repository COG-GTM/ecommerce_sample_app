import '../styles/globals.css';
import Providers from './providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'JS Mastery Store',
  description: 'Modern Full Stack ECommerce Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="layout">
            <header>
              <Navbar />
            </header>
            <main className="main-container">
              {children}
            </main>
            <footer>
              <Footer />
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
