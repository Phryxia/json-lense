import type { Scope } from './types'

/**
 * Unfold the minimum number of scopes to highlight the targeted line
 * and return new scopes and visible line number.
 *
 * @param scopes - Scopes in pre-traversal order at nesting tree.
 */
export function unfoldTargetedLine(scopes: Scope[], targetedLine: number) {
  if (!scopes.length) {
    return null
  }

  const unfoldedScopes = computeUnfoldedScopes(scopes, targetedLine)
  const count = countVisibleLines(unfoldedScopes, targetedLine)
  return { unfoldedScopes, count }
}

/** 
    Since scopes are always sorted in pre traversal order
    each scope would look like stacked lines

    0   4   8   C
      c   e   -f g
     -b- -d- ---e--
    -------a--------

    In this example, assume we want to unfold to highlight line 10,
    a, e, f should be unfolded.

    By scannnig each scope in order, determine whether the scope includes
    targetedLine or not. If so, unfold it. If not, let them go.
    
    @internal
  */
export function computeUnfoldedScopes(scopes: Scope[], targetedLine: number) {
  return scopes.map((scope) => {
    if (
      scope.begin <= targetedLine &&
      scope.end >= targetedLine &&
      !scope.isOpen
    ) {
      return { ...scope, isOpen: true }
    }
    return scope
  })
}

type TreefiedScope = Scope & {
  parent?: TreefiedScope
  children?: TreefiedScope[]
}

/** 
  Since linearized pre-traversal scope array is too hard to compute
  actual visible length, I transformed pre traversal as tree.
  This takes O(n) time complexity on n scopes

  @internal
*/
export function constructTree(scopes: Scope[]) {
  const treefiedScopes: TreefiedScope[] = scopes.slice()
  const scopeStack: TreefiedScope[] = []
  const roots: TreefiedScope[] = []

  for (const possibleChild of treefiedScopes) {
    let top = scopeStack.at(-1)

    while (top && top.end < possibleChild.begin) {
      scopeStack.pop()
      top = scopeStack.at(-1)
    }

    if (top) {
      possibleChild.parent = top
      top.children ??= []
      top.children.push(possibleChild)
    } else {
      roots.push(possibleChild)
    }

    scopeStack.push(possibleChild)
  }

  return roots
}

/**
  Counting is more tricky since it requires recursion.

  - if the scope is not open, it should be counted as 1 lines.
  - if the scope is open, their children before targetedLine + 2 should be counted.
  
  @internal
*/
export function countVisibleLines(
  unfoldedScopes: Scope[],
  targetedLine: number,
) {
  if (!unfoldedScopes.length) return 0

  const roots = constructTree(unfoldedScopes)

  function recurse(scope: TreefiedScope): number {
    if (!scope.children?.length) {
      return computeLengthLeaf(scope, targetedLine)
    }
    if (scope.begin > targetedLine) {
      return 0
    }
    if (!scope.isOpen) {
      return 1
    }

    const fullyOpenLineCount = scope.children.reduce((acc, child) => {
      if (child.begin > targetedLine) {
        return acc
      }
      return Math.min(targetedLine, child.end) - child.begin + 1 + acc
    }, 0)
    const currentScopeLength =
      Math.min(targetedLine, scope.end) - scope.begin + 1
    const nonNestedLineCount = currentScopeLength - fullyOpenLineCount
    const childrenLineCount = scope.children.reduce((acc, child) => {
      if (child.begin > targetedLine) {
        return acc
      }
      return recurse(child) + acc
    }, 0)

    return nonNestedLineCount + childrenLineCount
  }

  return roots.reduce((acc, root) => acc + recurse(root), 0)
}

function computeLengthLeaf(scope: Scope, targetedLine: number) {
  if (scope.begin > targetedLine) {
    return 0
  }
  if (scope.isOpen) {
    return Math.min(targetedLine, scope.end) - scope.begin + 1
  }
  return 1
}
