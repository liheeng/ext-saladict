import React, { FC } from 'react'
import {
  EtymonlineSearchResult,
  _EtymonlineSearchResult,
  parseSearchResult
} from './engine'
import { ViewPorps } from '@/components/dictionaries/helpers'
import { StrElm } from '@/components/StrElm'

export const DictEtymonline: FC<ViewPorps<
  _EtymonlineSearchResult<string>
>> = props => {
  const [
    parsedResult,
    setParsedResult
  ] = React.useState<EtymonlineSearchResult | null>(null)

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
    <ul className="dictEtymonline-List">
      {result.map(item => (
        <li key={item.title} className="dictEtymonline-Item">
          <h2 id={item.id} className="dictEtymonline-Title">
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </h2>
          <StrElm tag="p" className="dictEtymonline-Def" html={item.def} />
          {item.chart ? (
            <img src={item.chart} alt={'Origin of ' + item.title} />
          ) : null}
        </li>
      ))}
    </ul>
  )
}

export default DictEtymonline
