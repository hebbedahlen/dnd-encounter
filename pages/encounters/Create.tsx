import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useEncounters } from './encounterContext'
import { GridT, IterableGridT } from '../../models'
import { createUUID } from '../../helpers'
import styles from '../../styles/Create.module.css'

export default function Create() {
  const router = useRouter()
  const { setEncounters, encounters } = useEncounters()
  const [encounterName, setEncounterName] = useState('')
  const [dimensions, setDimensions] = useState({ rows: 0, columns: 0 })
  const [numberOfPlayers, setNumberOfPlayers] = useState(0)

  const [players, setPlayers] = useState({})

  const onCreateEncounter = () => {
    const newEncounter = {
      id: createUUID(),
      name: encounterName,
      numberOfPlayers,
      players,
      dimensions,
    }
    setEncounters([...encounters, newEncounter])
    router.push('/')
  }

  const createGrid = () => {
    const rows = [...Array.from(Array(dimensions.rows)).keys()]
    const columns = [...Array.from(Array(dimensions.columns)).keys()]

    const grid: GridT = rows.reduce((currentRows, row) => {
      return {
        ...currentRows,
        [row]: {
          tiles: columns.reduce((currentColumns, column) => {
            return {
              ...currentColumns,
              [column]: {
                id: row.toString() + column.toString(),
              },
            }
          }, {}),
        },
      }
    }, {})

    const iterableGrid: IterableGridT = Object.values(grid)

    console.log(grid)

    return (
      <table>
        <tbody>
          {iterableGrid.map((row, rowNumber) => {
            return (
              <tr key={rowNumber}>
                {Object.values(row.tiles).map((tile, tileNumber) => (
                  <td key={tile.id} className={styles['grid-cell']}>
                    {tile.id}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  return (
    <Layout>
      <h1>
        {encounterName} ( {dimensions.rows}, {dimensions.columns} )
      </h1>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        onChange={(event) => setEncounterName(event.target.value)}
      />

      <label htmlFor="rows">Dimensions Rows</label>
      <input
        type="number"
        name="rows"
        min="1"
        max="100"
        onChange={(event) =>
          setDimensions({ ...dimensions, rows: event.target.valueAsNumber })
        }
      />
      <label htmlFor="rows">Dimensions Columns</label>
      <input
        type="number"
        name="columns"
        min="1"
        max="100"
        onChange={(event) =>
          setDimensions({ ...dimensions, columns: event.target.valueAsNumber })
        }
      />
      <label htmlFor="numberOfPlayers">Number of players (1-5)</label>
      <input
        type="number"
        name="numberOfPlayers"
        min="1"
        max="5"
        onChange={(event) => setNumberOfPlayers(event.target.valueAsNumber)}
      />
      {numberOfPlayers > 0 &&
        Array(numberOfPlayers)
          .fill(numberOfPlayers)
          .map((_, index) => (
            <div key={index + 1}>
              <label htmlFor="playerName">Player Name {index + 1}</label>
              <input
                type="text"
                name="playerName"
                onChange={(event) =>
                  setPlayers({ ...players, [index + 1]: event.target.value })
                }
              />
            </div>
          ))}
      {dimensions.rows && dimensions.columns && createGrid()}
      <button onClick={onCreateEncounter}>Create</button>
    </Layout>
  )
}
