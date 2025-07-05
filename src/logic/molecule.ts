import { PrimitiveAtom } from 'jotai'
import { atom, Atom } from 'jotai'

type Roll<T> = { [K in keyof T]: T[K] } & {}

/**
 * Molecule is a kind of schema which can instantiate complex Atom by their dependencies.
 */
export class Molecule<AtomPool extends {}, PreAtomPool extends {} = {}> {
  constructor(public initializer: (preAtomPool: PreAtomPool) => AtomPool) {}

  /**
   * Create an extended Molecule with a new Atom consisted of the existing Atoms.
   *
   * @param name - the name of the new Atom to be added to the pool
   * @param factory - a function which creates new Atom from the existing Atoms in the pool
   * @returns New Molecule
   */
  append<Name extends string, ReturnType, AtomType extends Atom<ReturnType>>(
    name: Name,
    factory: (pool: AtomPool) => AtomType,
  ): Molecule<Roll<AtomPool & { [K in Name]: AtomType }>> {
    return new Molecule<any, any>((external) => {
      const pool = this.initializer(external)
      const newAtom = factory(pool)
      return {
        ...pool,
        [name]: newAtom,
      }
    })
  }

  /**
   * Create atoms with defined initializer.
   *
   * @param preAtomPool When some external atoms are required, you can pass them into preAtomPool.
   *                    Usually most case it's `{}`
   * @returns
   */
  instantiate(preAtomPool: PreAtomPool): AtomPool {
    return this.initializer(preAtomPool)
  }
}

export function createMolecule<Name extends string, T>(
  name: Name,
  defaultValue: T,
): Molecule<{ [K in Name]: PrimitiveAtom<T> }> {
  return new Molecule<any, any>(() => ({
    [name]: atom(defaultValue),
  }))
}
