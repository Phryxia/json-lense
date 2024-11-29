import type { Molecule } from '@src/model/molecule'
import { createMolecule, isNonPrimitiveType } from '../molecule'

/**
 * Replace value into given one at `path`.
 * If path is nullish or empty array, just copy `value` into `molecule`,
 * rset uses mixed mutability. It preserve untouched property as same reference.
 * For example, when rset 2nd element in [a, b, c, d], result will be [a, b', c, d].
 * Note that direct parent of given path will be mutated.
 */
export function rset(
  molecule: Molecule,
  path: (number | string)[] | undefined | null,
  value: Molecule,
): Molecule {
  if (!path?.length) {
    molecule.value = value.value
    molecule.type = value.type
    molecule.reason = value.reason
    return molecule
  }
  return rsetRecurse(molecule, path, value, 0)
}

function rsetRecurse(
  molecule: Molecule,
  path: (number | string)[],
  value: Molecule,
  index: number,
): Molecule {
  const key = path[index]

  if (!isNonPrimitiveType(molecule)) {
    // change type of molecule
    ;(molecule as Molecule).value = typeof key === 'number' ? [] : {}
    ;(molecule as Molecule).type = typeof key === 'number' ? [] : {}
    delete molecule.reason
  }

  if (typeof key === 'number') {
    for (let i = 0; i < key; ++i) {
      ;(molecule.value as any)[i] ??= createMolecule(undefined)
      ;(molecule.type as any)[i] ??= 'undefined'
    }
  }

  if (index >= path.length - 1) {
    ;(molecule.value as any)[key] = value
    ;(molecule.type as any)[key] = value.type
    delete molecule.reason
    return molecule
  }

  if (!(molecule.value as any)[key]) {
    const child = createMolecule(undefined)
    ;(molecule.value as any)[key] = child
    ;(molecule.type as any)[key] = child.type
  }

  ;(molecule.value as any)[key] = rsetRecurse(
    (molecule.value as any)[key],
    path,
    value,
    index + 1,
  )
  ;(molecule.type as any)[key] = (molecule.value as any)[key].type
  return molecule
}
