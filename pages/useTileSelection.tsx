import { useState, useEffect } from 'react'
import { TileT, PositionT, GridT } from './models'

type UseTileSelectionT = {
  selectedTiles: TileT[]
  onSelectedTileClick: (position: PositionT) => void
  onTileClick: (position: PositionT) => void
  onUnselectTiles: () => void
}

export const useTileSelection = (grid: GridT): UseTileSelectionT => {
  const [shiftDown, setShiftDown] = useState(false)
  const [selectedTiles, setSelectedTiles] = useState<TileT[]>([])

  useEffect(() => {
    document.addEventListener('keydown', onHandleKeyDown)
    document.addEventListener('keyup', onHandleKeyUp)
    return () => {
      document.removeEventListener('keydown', onHandleKeyDown)
      document.removeEventListener('keyup', onHandleKeyUp)
    }
  }, [])

  const onSelectedTileClick = ({ rowNumber, columnNumber }: PositionT) => {
    const tile = grid[rowNumber][columnNumber]

    if (selectedTiles.find(({ id }) => id === tile.id)) {
      setSelectedTiles(selectedTiles.filter(({ id }) => id !== tile.id))
      return
    }
  }

  const onTileClick = ({ rowNumber, columnNumber }: PositionT) => {
    const tile = grid[rowNumber][columnNumber]

    if (shiftDown) {
      setSelectedTiles([...selectedTiles, tile])
      return
    }

    setSelectedTiles([tile])
  }

  const onUnselectTiles = () => {
    setSelectedTiles([])
  }

  const onHandleKeyDown = (event) => {
    if (event.key === 'Shift') {
      setShiftDown(true)
    }
  }

  const onHandleKeyUp = (event) => {
    if (event.key === 'Shift') {
      setShiftDown(false)
    }
  }

  return {
    selectedTiles,
    onSelectedTileClick,
    onTileClick,
    onUnselectTiles,
  }
}
