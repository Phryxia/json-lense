import cn from 'classnames'
import { LoaderType } from './consts'

interface Props {
  loaderType: LoaderType
  onChange(loaderType: LoaderType): void
}

export function LoaderNav({ loaderType: selectedLoaderType, onChange }: Props) {
  return (
    <nav>
      <ul>
        {Object.values(LoaderType).map((loaderType) => (
          <li key={loaderType}>
            <button
              onClick={() => onChange(loaderType)}
              className={cn({
                secondary: loaderType !== selectedLoaderType,
              })}
            >
              {loaderType}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
