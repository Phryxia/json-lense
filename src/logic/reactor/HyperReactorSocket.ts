import type { HyperReactor } from '@src/model/reactor'

export class HyperReactorFn {
  static getInputNodes(h: HyperReactor, id: number) {
    return h.nodes[id].sources.map((sourceId) => h.nodes[sourceId])
  }

  static getOutputNodes(h: HyperReactor, id: number) {
    return h.nodes.filter((node) => node.sources.includes(id))
  }
}
