export const range = (start: number, stop: number): number[] => {
  return [...Array(stop).keys()].map((i) => i + start)
}
