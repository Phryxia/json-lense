import cnx from 'classnames/bind'
import styles from './PickModule.module.css'
import { produce } from 'immer'
import { PickMapping } from '@src/logic/reactor/pick'
import type { ReactorModuleProps, ReactorModuleSocket } from './types'
import { PathInput } from '../shared/PathInput'

const cx = cnx.bind(styles)

export function PickModule({
  reactor,
  onChange,
}: ReactorModuleProps<PickMapping[]>) {
  function handleAddClick() {
    onChange(
      produce(reactor, (draft) => {
        // @ts-ignore
        draft.data.push({} satisfies PickMapping)
      }),
    )
  }

  return (
    <section className={cx('root')}>
      {reactor.data.map((mapping, index) => (
        <div key={index} className={cx('rule')}>
          <label className={cx('from')}>
            From
            <PathInput
              value={mapping.from}
              onChange={(path) =>
                onChange(
                  produce(reactor, (draft) => {
                    if (path.length) {
                      // inference is too deep
                      // @ts-ignore
                      draft.data[index].from = path
                    } else {
                      draft.data[index].from = undefined
                    }
                    return draft
                  }),
                )
              }
            />
          </label>
          <label className={cx('from')}>
            To
            <PathInput
              value={mapping.to}
              onChange={(path) =>
                onChange(
                  produce(reactor, (draft) => {
                    if (path.length) {
                      // inference is too deep
                      // @ts-ignore
                      draft.data[index].to = path
                    } else {
                      draft.data[index].to = undefined
                    }
                    return draft
                  }),
                )
              }
            />
          </label>
        </div>
      ))}
      <button onClick={handleAddClick}>Add Rule</button>
    </section>
  )
}

export const PickModuleSockets: ReactorModuleSocket = {
  inputParams: ['input'],
  outputParams: ['output'],
}
