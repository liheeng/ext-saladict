import React, { FC } from 'react'
import {
  WeblioejjeSearchResult,
  _WeblioejjeSearchResult,
  parseSearchResult
} from './engine'
import EntryBox from '@/components/EntryBox'
import { ViewPorps } from '@/components/dictionaries/helpers'
import { StrElm } from '@/components/StrElm'

export const DictWeblioejje: FC<ViewPorps<
  _WeblioejjeSearchResult<string>
>> = props => {
  const [
    parsedResult,
    setParsedResult
  ] = React.useState<WeblioejjeSearchResult | null>(null)

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
      {result.map((entry, i) =>
        entry.title ? (
          <EntryBox key={entry.title + i} title={entry.title}>
            <StrElm html={entry.content} />
          </EntryBox>
        ) : (
          <StrElm key={i} className="dictWeblioejje-Box" html={entry.content} />
        )
      )}
    </div>
  )
}
export default DictWeblioejje
