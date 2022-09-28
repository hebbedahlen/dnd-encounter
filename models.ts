export type PlayerT = {
  name: string
  id: string
}

export type PlayersT = {
  [playerId: number]: PlayerT
}

export type DimensionsT = {
  rows: number
  columns: number
}

export type EncounterT = {
  id: string
  name: string
  players: PlayersT
  numberOfPlayers: number
  dimensions: DimensionsT
}

export interface TileT {
  color: string
  id: string
}

interface TilesT {
  [columnNumber: number]: TileT
}

export interface RowT {
  [columnNumber: number]: TileT
}

export interface GridT {
  [rowNumber: number]: RowT
}

export type IterableGridT = Array<RowT>
