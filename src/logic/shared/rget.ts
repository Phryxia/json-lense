import type { Molecule } from '@src/model/molecule'

export function rget(
  molecule: Molecule,
  path?: (number | string)[] | null,
): Molecule {
  if (!path) return molecule

  for (const key of path) {
    if (molecule.type === 'error') {
      return molecule
    }

    if (
      molecule.value &&
      typeof molecule.value === 'object' &&
      Object.hasOwn(molecule.value, key)
    ) {
      molecule = (molecule.value as any)[key]
    } else {
      return {
        type: 'error',
        reason: `Cannot reach ${path.join('.')}: property ${key} doesn't exists`,
      }
    }
  }
  return molecule
}
