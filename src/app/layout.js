import Header from '@/components/Header'
import { CartProvider } from '../app/context/CartContext';
import { AuthProvider } from '../app/context/AuthContext';

import '@/app/globals.css'
import '../styles/phone-input.css';

export const metadata = {
  title: 'BlackWom',
  description: 'Your one-stop shop for beauty products',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <AuthProvider>
        <CartProvider>
          <Header />
          <main>{children}</main>
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}