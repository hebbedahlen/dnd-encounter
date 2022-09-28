import { GridDimensionsT, GridT } from './models'

export const createGrid = (dimensions: GridDimensionsT): GridT => {
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
