import React, { FC } from 'react'
import {
  ZdicSearchResult,
  _ZdicSearchResult,
  parseSearchResult
} from './engine'
import { ViewPorps } from '@/components/dictionaries/helpers'
import EntryBox from '@/components/EntryBox'
import { StrElm } from '@/components/StrElm'

export const DictZdic: FC<ViewPorps<_ZdicSearchResult<string>>> = props => {
  const [
    parsedResult,
    setParsedResult
  ] = React.useState<ZdicSearchResult | null>(null)

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

  const result = parsedResult.result
  return (
    <div>
      {result.map(entry => (
        <EntryBox title={entry.title} key={entry.title}>
          <StrElm html={entry.content} />
        </EntryBox>
      ))}
    </div>
  )
}

export default DictZdic
