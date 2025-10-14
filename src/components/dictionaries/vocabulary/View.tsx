import React, { FC } from 'react'
import {
  VocabularySearchResult,
  _VocabularySearchResult,
  parseSearchResult
} from './engine'
import { ViewPorps } from '@/components/dictionaries/helpers'

export const DictVocabulary: FC<ViewPorps<
  _VocabularySearchResult<string>
>> = props => {
  const [
    parsedResult,
    setParsedResult
  ] = React.useState<VocabularySearchResult | null>(null)

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
    <>
      <p className="dictVocabulary-Short">{result.short}</p>
      <p className="dictVocabulary-Long">{result.long}</p>
    </>
  )
}
export default DictVocabulary
