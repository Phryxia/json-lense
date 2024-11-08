import type { Molecule } from '@src/model/molecule'
import { createMolecule, isObjectOrArrayType } from '../molecule'

export function rget(
  molecule: Molecule,
  path?: (number | string)[] | null,
): Molecule {
  if (!path) return molecule

  for (const key of path) {
    if (molecule.error) {
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
        error: true,
        reason: `Cannot reach ${path.join('.')}: property ${key} doesn't exists`,
      }
    }
  }
  return molecule
}

export function rset(
  molecule: Molecule,
  path: (number | string)[] | undefined | null,
  value: Molecule,
): Molecule {
  if (!path?.length) {
    molecule.value = value.value
    molecule.type = value.type
    molecule.error = value.error
    molecule.reason = value.reason
    return molecule
  }
  return rsetRecurse(molecule, path ?? [], value, 0)
}

function rsetRecurse(
  molecule: Molecule,
  path: (number | string)[],
  value: Molecule,
  index: number,
): Molecule {
  const key = path[index]

  if (!isObjectOrArrayType(molecule)) {
    molecule.value = typeof key === 'number' ? [] : {}
    molecule.type = typeof key === 'number' ? [] : {}
    delete molecule.error
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
    delete molecule.error
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
