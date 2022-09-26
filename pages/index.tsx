import { useRouter } from 'next/router'
import { useContext } from 'react'
import Layout from '../components/Layout'

import styles from '../styles/Home.module.css'
import { useEncounters } from './encounters/encounterContext'

export default function Home() {
  const router = useRouter()
  const { encounters } = useEncounters()
  console.log(encounters)

  const handleCreateClick = () => {
    router.push('/encounters/Create')
  }
  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <button onClick={handleCreateClick}>Create new</button>
        </main>
        <ul>
          {encounters.map((encounter) => (
            <li key={encounter.id}>{encounter.name}</li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}
