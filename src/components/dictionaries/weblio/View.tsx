import React, { FC } from 'react'
import {
  WeblioSearchResult,
  _WeblioSearchResult,
  parseSearchResult
} from './engine'
import { ViewPorps } from '@/components/dictionaries/helpers'
import EntryBox from '@/components/EntryBox'
import { StrElm } from '@/components/StrElm'

export const DictWeblio: FC<ViewPorps<_WeblioSearchResult<string>>> = props => {
  const [
    parsedResult,
    setParsedResult
  ] = React.useState<WeblioSearchResult | null>(null)

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
    <div className="dictWeblio-Container">
      {result.map(({ title, def }) => (
        <EntryBox
          key={title}
          className="dictWeblio-Entry"
          title={<StrElm tag="span" html={title} />}
        >
          <StrElm html={def} />
        </EntryBox>
      ))}
    </div>
  )
}

export default DictWeblio
