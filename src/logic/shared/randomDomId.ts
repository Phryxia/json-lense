export function createRandomDomId() {
  return Math.floor(Math.random() * 0xffffffff).toString(16)
}
