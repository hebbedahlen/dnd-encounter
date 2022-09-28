import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { GridDimensionsT, GridT, PlayerT } from './models'
import styles from '../styles/Home.module.css'
import { createGrid } from './createGrid'
import { useTileSelection } from './useTileSelection'

export default function Create() {
  const [encounterName, setEncounterName] = useState('')
  const [dimensions, setDimensions] = useState<GridDimensionsT>({
    rows: 0,
    columns: 0,
  })
  const [numberOfPlayers, setNumberOfPlayers] = useState(0)
  const [players, setPlayers] = useState<PlayerT[]>([])
  const [tileColor, setSelectedTileColor] = useState('#000')
  const [grid, setGrid] = useState<GridT>([])
  const { selectedTiles, onSelectedTileClick, onTileClick, onUnselectTiles } =
    useTileSelection(grid)

  useEffect(() => {
    setGrid(createGrid(dimensions))
  }, [dimensions])

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
                  setPlayers([...players, { name: event.target.value }])
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
          <button onClick={onUnselectTiles}>Unselect</button>
        </>
      )}
      {dimensions.rows && dimensions.columns && (
        <table>
          <tbody>
            {grid.map((row, rowNumber) => {
              return (
                <tr key={rowNumber}>
                  {row.map((tile, columnNumber) => {
                    if (selectedTiles.find(({ id }) => id === tile.id)) {
                      return (
                        <td
                          key={tile.id}
                          style={{ backgroundColor: tile.color }}
                          className={styles['grid-cell-selected']}
                          onClick={() =>
                            onSelectedTileClick({
                              rowNumber,
                              columnNumber,
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
                              onSetTileColor(rowNumber, columnNumber)
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
                        onClick={() => onTileClick({ rowNumber, columnNumber })}
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
    </Layout>
  )
}
