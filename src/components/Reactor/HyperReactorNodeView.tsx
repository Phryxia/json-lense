import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { ReactorNodeView, ReactorNodeViewProps } from './ReactorNodeView'
import { ReactorPlayground } from './ReactorPlayground'
import { useReactorVisual } from './ReactorVisualContext'

const cx = cnx.bind(styles)

export function HyperReactorNodeView({
  id,
  name,
  children,
  ...rest
}: ReactorNodeViewProps) {
  const { nodeEditor } = useReactorVisual()

  return (
    <ReactorNodeView id={id} name={name} {...rest}>
      <div>
        {/* <button
          onClick={() => {
            nodeEditor.add({
              x: 10,
              y: 10,
              parentId: id,
            })
          }}
        >
          ADD
        </button> */}

        {/* <button
          onClick={() => {
            nodeEditor.add({
              x: 10,
              y: 10,
              isHyper: true,
              parentId: id,
            })
          }}
        >
          ADD HYPER
        </button> */}
      </div>
      {children}
      <div className={cx('hyper')}>
        <ReactorPlayground id={id} />
      </div>
    </ReactorNodeView>
  )
}
