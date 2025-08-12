
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Web3Provider } from '../contexts/Web3Context'
import { TokenProvider } from '../contexts/TokenContext'
import { I18nProvider } from '../components/I18nProvider'
import { Toaster } from 'react-hot-toast'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SCCafé - Smart Contract Factory',
  description: 'Create tokens with custom addresses using CREATE2 technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <I18nProvider>
          <Web3Provider>
            <TokenProvider>
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1a1a1a',
                    color: '#ffffff',
                    border: '1px solid #333333',
                  },
                  success: {
                    style: {
                      background: '#1a1a1a',
                      color: '#10b981',
                      border: '1px solid #10b981',
                    },
                  },
                  error: {
                    style: {
                      background: '#1a1a1a',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                    },
                  },
                }}
              />
            </TokenProvider>
          </Web3Provider>
        </I18nProvider>
      </body>
    </html>
  )
}
