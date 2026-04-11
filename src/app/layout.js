import './globals.css';
import './dashboard.css';
import './missing-styles.css';
import { Cormorant_Garamond, Jost } from 'next/font/google';
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

export const metadata = {
  title: 'Tafokt Rugs | Tapis Berbères Faits Main',
  description: 'Découvrez notre collection authentique de tapis berbères faits à la main au Maroc. Beni Ouarain, Azilal, Boucherouite et Kilims de qualité supérieure.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${jost.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <CartProvider>
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
