import type { Molecule, UndefinedMolecule } from '@src/model/molecule'
import { isArrayType, isPrimitiveType } from '../molecule'

/**
 * Mutate given `molecule` to delete (nested) property in `path`.
 * If `molecule` doesn't have property in given `path`, nothing happens.
 * If `path` is empty then `molecule` is turned into undefined molecule.
 * If at end of the `path` of `molecule` is middle of array, then undefined molecule is filled.
 *
 * @param molecule
 * @param path
 */
export function rdel(molecule: Molecule, path: (number | string)[]) {
  if (!path.length) {
    molecule.type = 'undefined'
    molecule.value = undefined
    molecule.reason = undefined
    return
  }

  rdelRecurse(molecule, path, 0)
}

function rdelRecurse(
  molecule: Molecule,
  path: (number | string)[],
  index: number,
) {
  if (molecule.type === 'error' || isPrimitiveType(molecule)) {
    return
  }

  const key = path[index]

  if (!Object.hasOwn(molecule.value, key)) return

  if (index < path.length - 1) {
    rdelRecurse((molecule.value as any)[key], path, index + 1)
    return
  }

  if (typeof key === 'number' && isArrayType(molecule)) {
    // middle of array
    if (key < molecule.value.length - 1) {
      const undefinedMolecule: UndefinedMolecule = {
        type: 'undefined',
        value: undefined,
      }

      molecule.value[key] = undefinedMolecule
      molecule.type[key] = 'undefined'
      return
    }
    // end of array
    molecule.value.pop()
    molecule.type.pop()
    return
  }

  // @ts-ignore
  delete molecule.value[key]
  // @ts-ignore
  delete molecule.type[key]
}
