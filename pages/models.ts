export type PlayerT = {
  name: string
  id?: string
  color?: string
}

export type GridDimensionsT = {
  rows: number
  columns: number
}

export type PositionT = {
  rowNumber: number
  columnNumber: number
}
export interface TileT {
  color: string
  id: string
}

export type RowT = TileT[]

export type GridT = RowT[]
