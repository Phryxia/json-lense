import { atom } from 'jotai'
import { Arranger } from '@src/model/Arranger'
import { createMolecule } from '@src/logic/molecule'
import { JsonArranger } from '@src/logic/arrangers/JsonArranger'
import { searchFromContent } from './JSONSearch/logic'

function createInpectorMolecule(arranger: Arranger) {
  return createMolecule('target', undefined as any)
    .append('contents', ({ target }) =>
      atom((get) => arranger.arrange(get(target))),
    )
    .append('lastLine', ({ contents }) =>
      atom((get) => get(contents).at(-1)?.lineEnd ?? 0),
    )
    .append('keyword', () => atom(''))
    .append('isMatchCase', () => atom(false))
    .append('isMatchWord', () => atom(false))
    .append('isRegexUsed', () => atom(false))
    .append(
      'searchResults',
      ({ contents, keyword, isMatchCase, isMatchWord, isRegexUsed }) =>
        atom((get) =>
          get(contents).flatMap((content) =>
            searchFromContent(content, {
              keyword: get(keyword),
              isMatchCase: get(isMatchCase),
              isMatchWord: get(isMatchWord),
              isRegexUsed: get(isRegexUsed),
            }),
          ),
        ),
    )
    .append('selectedMatchIndex', () => atom(-1))
    .append('selectedMatch', ({ searchResults, selectedMatchIndex }) =>
      atom((get) => get(searchResults)[get(selectedMatchIndex)]),
    )
}

const jsonInspectorMolecule = createInpectorMolecule(JsonArranger)

export const JsonInspectorSuite = jsonInspectorMolecule.instantiate({})
