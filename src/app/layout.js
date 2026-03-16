import './globals.css';
import './dashboard.css';
import { Cormorant_Garamond, Jost, Dancing_Script } from 'next/font/google';
import { ThemeProvider } from '../components/ThemeProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartProvider } from '../components/CartProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
});
const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
});
const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-logo',
});

export const metadata = {
  title: 'Amazigh Artes | Tapis Berbères Faits Main',
  description: 'Découvrez notre collection authentique de tapis berbères faits à la main au Maroc. Beni Ouarain, Azilal, Boucherouite et Kilims de qualité supérieure.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${jost.variable} ${dancing.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <CartProvider>
            <div className="amazigh-grid-bg" />
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
