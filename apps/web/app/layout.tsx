import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: '🎄 Christmas Carols',
  description: 'Sing Christmas carols together in real-time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#165B33',
              color: '#FFF8DC',
              border: '1px solid rgba(255,255,255,0.2)',
            },
          }}
        />
      </body>
    </html>
  )
}
