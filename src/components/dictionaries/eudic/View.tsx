import React, { FC } from 'react'
import {
  _EudicSearchResult,
  EudicSearchResult,
  parseSearchResult
} from './engine'
import Speaker from '@/components/Speaker'
import { ViewPorps } from '@/components/dictionaries/helpers'

export const DictEudic: FC<ViewPorps<_EudicSearchResult<string>>> = props => {
  const [
    parsedResult,
    setParsedResult
  ] = React.useState<EudicSearchResult | null>(null)

  React.useEffect(() => {
    let isMounted = true
    parseSearchResult(props.result).then(value => {
      if (isMounted) {
        setParsedResult(value)
      }
    })

    return () => {
      isMounted = false
    }
  }, [props.result])

  if (!parsedResult) {
    return null
  }

  const result: any = parsedResult.result
  return (
    <ul className="dictEudic-List">
      {result.map(item => (
        <li key={item.chs} className="dictEudic-Item">
          <p>
            {item.eng} <Speaker src={item.mp3} />
          </p>
          <p>{item.chs}</p>
          <footer>
            {item.channel && (
              <p className="dictEudic-Channel">{item.channel}</p>
            )}
          </footer>
        </li>
      ))}
    </ul>
  )
}

export default DictEudic
