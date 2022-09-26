export const assert = (invariant: any, message: string) => {
  if (!invariant) {
    throw new Error(message)
  }
}
