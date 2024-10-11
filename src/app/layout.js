import Header from '@/components/Header'
import '@/app/globals.css'

export const metadata = {
  title: 'BlackWom',
  description: 'Your one-stop shop for beauty products',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}