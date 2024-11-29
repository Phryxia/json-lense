import type {
  ArrayMolecule,
  Molecule,
  ObjectMolecule,
  PrimitiveMolecule,
} from '@src/model/molecule'
import { deepClone } from './shared/deepClone'

export function createMolecule(value: any): Molecule {
  if (value === null) {
    return {
      value,
      type: 'null',
    }
  }

  const typeOfValue = typeof value

  switch (typeOfValue) {
    default:
      if (typeOfValue === 'object') {
        if (value instanceof Array) {
          const children = value.map(createMolecule)

          return {
            value: children,
            type: children.map(({ type }) => deepClone(type!)),
          }
        }

        const children = Object.entries(value).map(
          ([key, child]) => [key, createMolecule(child)] as const,
        )

        return {
          value: Object.fromEntries(children),
          type: Object.fromEntries(
            children.map(([key, { type }]) => [key, deepClone(type!)]),
          ),
        }
      }

      return {
        value,
        type: typeOfValue,
      }

    case 'symbol':
    case 'bigint':
    case 'function':
      throw new Error(`${typeOfValue} cannot be put through Molecule`)
  }
}

export function serializeMolecule(molecule: Molecule) {
  return JSON.stringify({
    root: serializeMoleculeRecurse(molecule),
  })
}

function serializeMoleculeRecurse(molecule: Molecule): any {
  if (isArrayType(molecule)) {
    return molecule.value.map(serializeMoleculeRecurse)
  }
  if (isObjectType(molecule)) {
    return Object.fromEntries(
      Object.entries(molecule.value).map(([key, value]) => [
        key,
        serializeMoleculeRecurse(value),
      ]),
    )
  }
  return molecule.value
}

export function isPrimitiveType(
  molecule: Molecule,
): molecule is PrimitiveMolecule {
  return (
    molecule.type === 'undefined' ||
    molecule.type === 'null' ||
    molecule.type === 'boolean' ||
    molecule.type === 'string' ||
    molecule.type === 'number'
  )
}

export function isObjectType(molecule: Molecule): molecule is ObjectMolecule {
  return typeof molecule.type === 'object' && !(molecule.type instanceof Array)
}

export function isArrayType(molecule: Molecule): molecule is ArrayMolecule {
  return typeof molecule.type === 'object' && molecule.type instanceof Array
}

export function isNonPrimitiveType(
  molecule: Molecule,
): molecule is ObjectMolecule | ArrayMolecule {
  return typeof molecule.type === 'object'
}
