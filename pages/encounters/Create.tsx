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
  const [selectedTiles, setSelectedTiles] = useState([])
  const [players, setPlayers] = useState({})
  const [tileColor, setSelectedTileColor] = useState('#000')
  const [grid, setGrid] = useState<Grid2T>([])
  const [shiftDown, setShiftDown] = useState(false)
  const [controlDown, setControlDown] = useState(false)

  useEffect(() => {
    setGrid(createGrid(dimensions))
  }, [dimensions])

  useEffect(() => {
    document.addEventListener('keydown', onHandleKeyDown)
    document.addEventListener('keyup', onHandleKeyUp)
    return () => {
      document.removeEventListener('keydown', onHandleKeyDown)
      document.removeEventListener('keyup', onHandleKeyUp)
    }
  }, [])

  console.log(
    'selectedTiles',
    selectedTiles.map((tile) => tile.id)
  )

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

  const onSelectedTileClick = ({ row, column }) => {
    const tile = grid[row][column]
    console.log('onSelectedTileClick', tile)

    if (selectedTiles.find(({ id }) => id === tile.id)) {
      setSelectedTiles(selectedTiles.filter(({ id }) => id !== tile.id))
      return
    }
  }

  const onTileClick = ({ row, column }) => {
    const tile = grid[row][column]
    console.log('onTileClick', tile)

    if (shiftDown) {
      setSelectedTiles([...selectedTiles, tile])
      return
    }

    setSelectedTiles([tile])
  }

  const onChangeTileColor = (event) => {
    setSelectedTileColor(event.target.value)
  }

  const onSetMultiTileColor = () => {
    const updatedGrid = grid.map((row) =>
      row.map((tile) => {
        if (selectedTiles.find(({ id }) => id === tile.id)) {
          return {
            ...tile,
            color: tileColor,
          }
        }
        return tile
      })
    )

    setGrid(updatedGrid)
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

  const onHandleKeyDown = (event) => {
    console.log('keyDown', event.key)
    if (event.key === 'Shift') {
      setShiftDown(true)
    }
    if (event.key === 'Control') {
      setControlDown(true)
    }
  }

  const onHandleKeyUp = (event) => {
    console.log('keyUp', event.key)
    if (event.key === 'Shift') {
      setShiftDown(false)
    }
    if (event.key === 'Control') {
      setControlDown(false)
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
      {selectedTiles.length > 1 && (
        <>
          <input
            type="color"
            name=""
            id=""
            onInput={onChangeTileColor}
            value={tileColor}
          />
          <button onClick={onSetMultiTileColor}>Change color</button>
          <button>Set Enemy</button>
          <button onClick={() => setSelectedTiles([])}>Unselect</button>
        </>
      )}
      {dimensions.rows && dimensions.columns && (
        <table>
          <tbody>
            {grid.map((row, rowNumber) => {
              return (
                <tr key={rowNumber}>
                  {row.map((tile, tileNumber) => {
                    if (selectedTiles.find(({ id }) => id === tile.id)) {
                      return (
                        <td
                          key={tile.id}
                          style={{ backgroundColor: tile.color }}
                          className={styles['grid-cell-selected']}
                          onClick={() =>
                            onSelectedTileClick({
                              row: rowNumber,
                              column: tileNumber,
                            })
                          }
                        >
                          <input
                            type="color"
                            value={tileColor}
                            name=""
                            id=""
                            onInput={onChangeTileColor}
                            onClick={(event) => event.stopPropagation()}
                          />
                          <button
                            onClick={(event) => {
                              event.stopPropagation()
                              onSetTileColor(rowNumber, tileNumber)
                            }}
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
