import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useEncounters } from './encounterContext'
import { DimensionsT, TileT } from '../../models'
import { createUUID } from '../../helpers'
import styles from '../../styles/Create.module.css'

type Row2T = TileT[]
type Grid2T = Row2T[]

const createGrid = (dimensions: DimensionsT): Grid2T => {
  const rows = [...Array.from(Array(dimensions.rows)).keys()]
  const columns = [...Array.from(Array(dimensions.columns)).keys()]

  const grid = rows.map((rowNumber) => {
    return columns.map((columnNumber) => ({
      id: rowNumber.toString() + columnNumber.toString(),
      color: '#000',
    }))
  })

  return grid
}

export default function Create() {
  const router = useRouter()
  const { setEncounters, encounters } = useEncounters()
  const [encounterName, setEncounterName] = useState('')
  const [dimensions, setDimensions] = useState({ rows: 0, columns: 0 })
  const [numberOfPlayers, setNumberOfPlayers] = useState(0)
  const [selectedTile, setSelectedTile] = useState(null)
  const [players, setPlayers] = useState({})
  const [tileColor, setSelectedTileColor] = useState('#000')
  const [grid, setGrid] = useState<Grid2T>([])

  useEffect(() => {
    setGrid(createGrid(dimensions))
  }, [dimensions])

  console.log('grid', grid)

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

  const onTileClick = ({ row, column }) => {
    console.log({ row, column })
    console.log('grid', grid)

    const tile = grid[row][column]
    console.log(tile)
    setSelectedTile(tile)
  }

  const onChangeTileColor = (event) => {
    setSelectedTileColor(event.target.value)
  }

  const onSetTileColor = (rowNumber: number, tileNumber: number) => {
    const tileToUpdate = grid[rowNumber][tileNumber]
    const updatedTile = {
      ...tileToUpdate,
      color: tileColor,
    }

    console.log('tileToUpdate', tileToUpdate)

    const updatedGrid = grid.map((row) =>
      row.map((tile) => {
        if (tile.id === tileToUpdate.id) {
          return updatedTile
        }
        return tile
      })
    )

    setGrid(updatedGrid)
  }

  const onSetDimensions = (type: 'rows' | 'columns', n: number) => {
    if (n > 0 && n <= 100) {
      const newDimensions = { ...dimensions, [type]: n }
      setDimensions(newDimensions)
    }
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
          onSetDimensions('rows', event.target.valueAsNumber)
        }
      />
      <label htmlFor="rows">Dimensions Columns</label>
      <input
        type="number"
        name="columns"
        min="1"
        max="100"
        onChange={(event) =>
          onSetDimensions('columns', event.target.valueAsNumber)
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
      {dimensions.rows && dimensions.columns && (
        <table>
          <tbody>
            {grid.map((row, rowNumber) => {
              return (
                <tr key={rowNumber}>
                  {row.map((tile, tileNumber) => {
                    if (tile === selectedTile) {
                      return (
                        <td
                          key={tile.id}
                          style={{ backgroundColor: tile.color }}
                          className={styles['grid-cell-selected']}
                        >
                          <input
                            type="color"
                            name=""
                            id=""
                            onInput={onChangeTileColor}
                          />
                          <button
                            onClick={() =>
                              onSetTileColor(rowNumber, tileNumber)
                            }
                          >
                            Change color
                          </button>
                          <button>Set Player</button>
                          <button>Set Enemy</button>
                        </td>
                      )
                    }
                    return (
                      <td
                        key={tile.id}
                        style={{ backgroundColor: tile.color }}
                        className={styles['grid-cell']}
                        onClick={() =>
                          onTileClick({ row: rowNumber, column: tileNumber })
                        }
                      >
                        {tile.id}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      <button onClick={onCreateEncounter}>Create</button>
    </Layout>
  )
}
