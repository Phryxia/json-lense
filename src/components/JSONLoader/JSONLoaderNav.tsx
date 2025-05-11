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
        {Object.values(LoaderType)
          .filter((loaderType) => loaderType !== LoaderType.FromURL)
          .map((loaderType) => (
            <li key={loaderType}>
              <button
                onClick={() => onChange(loaderType)}
                className={cn({
                  secondary: loaderType !== selectedLoaderType,
                })}
                data-tooltip={
                  loaderType === LoaderType.FromClipboard
                    ? 'Recommend for huge JSON!'
                    : undefined
                }
                data-placement="bottom"
              >
                {loaderType}
              </button>
            </li>
          ))}
      </ul>
    </nav>
  )
}
