import React, { FC } from 'react'
import Speaker from '@/components/Speaker'
import {
  WebsterLearnerResultLex,
  WebsterLearnerResultRelated,
  WebsterLearnerSearchResult,
  _WebsterLearnerSearchResult,
  parseSearchResult
} from './engine'
import { ViewPorps } from '@/components/dictionaries/helpers'
import { StrElm } from '@/components/StrElm'

export const DictWebsterLearner: FC<ViewPorps<
  _WebsterLearnerSearchResult<string>
>> = props => {
  const [
    parsedResult,
    setParsedResult
  ] = React.useState<WebsterLearnerSearchResult | null>(null)

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
  switch (result.type) {
    case 'lex':
      return renderLex(result)
    case 'related':
      return renderRelated(result)
    default:
      return null
  }
}

function renderLex(result: WebsterLearnerResultLex) {
  return (
    <>
      {result.items.map(entry => (
        <section key={entry.title} className="dictWebsterLearner-Entry">
          <header className="dictWebsterLearner-Header">
            <StrElm tag="span" className="hw_d hw_0" html={entry.title} />
            <Speaker src={entry.pron} />
          </header>
          {entry.infs && (
            <div className="dictWebsterLearner-Header">
              <StrElm tag="span" className="hw_infs_d" html={entry.infs} />
              <Speaker src={entry.infsPron} />
            </div>
          )}
          {entry.labels && <StrElm className="labels" html={entry.labels} />}
          {entry.senses && <StrElm className="sblocks" html={entry.senses} />}
          {entry.arts &&
            entry.arts.length > 0 &&
            entry.arts.map(src => <img key={src} src={src} />)}
          {entry.phrases && <StrElm className="dros" html={entry.phrases} />}
          {entry.derived && <StrElm className="uros" html={entry.derived} />}
        </section>
      ))}
    </>
  )
}

function renderRelated(result: WebsterLearnerResultRelated) {
  return (
    <>
      <p>Did you mean:</p>
      <StrElm
        tag="ul"
        className="dictWebsterLearner-Related"
        html={result.list}
      />
    </>
  )
}

export default DictWebsterLearner
