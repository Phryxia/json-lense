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
    <div className={cx('root')}>
      <ul className={cx('rules')}>
        {reactor.data.map((mapping, index) => (
          <li key={index} className={cx('rule')}>
            <label className={cx('from')}>
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
              <span className={cx('from-text')}>→</span>
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
            <button className="secondary">Delete</button>
          </li>
        ))}
        <li className={cx('rule')}>
          <button className={cx('add-button')} onClick={handleAddClick}>
            Add Rule
          </button>
        </li>
      </ul>
    </div>
  )
}

export const PickModuleSockets: ReactorModuleSocket = {
  inputParams: ['input'],
  outputParams: ['output'],
}
