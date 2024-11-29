import { ReactorName } from '@src/logic/reactor/consts'
import type { ReactorModuleProps } from './types'
import { PickModule, PickModuleSockets } from './PickModule'

export function ReactorModule(props: ReactorModuleProps<any>) {
  switch (props.reactor.name) {
    case ReactorName.Pick:
      return <PickModule {...props} />
  }
  return null
}

export function getReactorSockets(name: ReactorName) {
  switch (name) {
    case ReactorName.Pick:
      return PickModuleSockets
  }
  return {}
}
