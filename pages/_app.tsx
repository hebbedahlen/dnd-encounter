import { AppProps } from 'next/app'

import '../styles/globals.css'
import EncounterProvider from './encounters/encounterContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EncounterProvider>
      <Component {...pageProps} />
    </EncounterProvider>
  )
}

export default MyApp
