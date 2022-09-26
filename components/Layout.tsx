import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Layout.module.css'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>DnD Encounter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <Link href="/">
          <h1 className={styles['header-title']}>DnD Encounter</h1>
        </Link>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  )
}
