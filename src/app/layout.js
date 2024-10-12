import Header from '@/components/Header'
import { CartProvider } from '../app/context/CartContext';

import '@/app/globals.css'

export const metadata = {
  title: 'BlackWom',
  description: 'Your one-stop shop for beauty products',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <CartProvider>
        <Header />
        <main>{children}</main>
      </CartProvider>
      </body>
    </html>
  )
}