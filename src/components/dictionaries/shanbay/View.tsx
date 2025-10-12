import React, { FC } from 'react'
import Speaker from '@/components/Speaker'
import {
  _ShanbaySearchResult,
  ShanbaySearchResult,
  parseSearchResult
} from './engine'
import { ViewPorps } from '@/components/dictionaries/helpers'
import { StrElm } from '@/components/StrElm'

export const DictShanbay: FC<ViewPorps<
  _ShanbaySearchResult<string>
>> = props => {
  const [
    parsedResult,
    setParsedResult
  ] = React.useState<ShanbaySearchResult | null>(null)

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
      {result.title && (
        <div className="dictShanbay-HeaderContainer">
          <h1 className="dictShanbay-Title">{result.title}</h1>
          <span className="dictShanbay-Pattern">{result.pattern}</span>
        </div>
      )}
      {result.prons.length > 0 && (
        <div className="dictShanBay-HeaderContainer">
          {result.prons.map(({ phsym, url }) => (
            <React.Fragment key={url}>
              {phsym} <Speaker src={url} />
            </React.Fragment>
          ))}
        </div>
      )}
      {result.basic && (
        <StrElm className="dictShanbay-Basic" html={result.basic} />
      )}
      {result.sentences && (
        <div>
          <h1 className="dictShanbay-SecTitle">权威例句</h1>
          <ol className="dictShanbay-Sentence">
            {result.sentences.map(sentence => (
              <li key={sentence.annotation}>
                <StrElm tag="p" html={sentence.annotation} />
                <p>{sentence.translation}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  )
}
export default DictShanbay
