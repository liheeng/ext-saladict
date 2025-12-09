import React, { FC, useState } from 'react'
import { Speaker } from '@/components/Speaker'
import StarRates from '@/components/StarRates'
import {
  COBUILDResult,
  COBUILDCibaResult,
  COBUILDColResult,
  _COBUILDSearchResult,
  parseSearchResult
} from './engine'
import { ViewPorps, DictSearchResult } from '@/components/dictionaries/helpers'
import { StrElm } from '@/components/StrElm'

export const DictCOBUILD: FC<ViewPorps<
  _COBUILDSearchResult<string>
>> = props => {
  const [parsedResult, setParsedResult] = React.useState<DictSearchResult<
    COBUILDResult
  > | null>(null)
  const [iSec, setiSec] = useState(0)

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
  function renderCiba(result: COBUILDCibaResult) {
    return (
      <>
        <h1 className="dictCOBUILD-Title">{result.title}</h1>
        {result.prons && (
          <ul className="dictCOBUILD-Pron">
            {result.prons.map(p => (
              <li key={p.phsym} className="dictCOBUILD-PronItem">
                {p.phsym}
                <Speaker src={p.audio} />
              </li>
            ))}
          </ul>
        )}
        <div className="dictCOBUILD-Rate">
          {(result.star as number) >= 0 && <StarRates rate={result.star} />}
          {result.level && (
            <span className="dictCOBUILD-Level">{result.level}</span>
          )}
        </div>
        {result.defs && (
          <ol className="dictCOBUILD-Defs">
            {result.defs.map((def, i) => (
              <StrElm tag="li" className="dictCOBUILD-Def" key={i} html={def} />
            ))}
          </ol>
        )}
      </>
    )
  }
  function renderCol(result: COBUILDColResult) {
    const curSection = result.sections[iSec]

    return (
      <div className="dictCOBUILD-ColEntry">
        {result.sections.length > 0 && (
          <select value={iSec} onChange={e => setiSec(e.currentTarget.value)}>
            {result.sections.map((section, i) => (
              <option key={section.id} value={i}>
                {section.type}
                {section.title ? ` :${section.title}` : ''}
                {section.num ? ` ${section.num}` : ''}
              </option>
            ))}
          </select>
        )}
        <div className="dictionary">
          <div className="dc">
            <div className="he">
              <div className="page">
                <div className="dictionary">
                  <div className="dictentry">
                    <div className="dictlink">
                      <StrElm
                        key={curSection}
                        className={curSection.className}
                        html={curSection.content}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const result: COBUILDResult = parsedResult.result
  switch (result.type) {
    case 'ciba':
      return renderCiba(result)
    case 'collins':
      return renderCol(result)
  }
  return null
}

export default DictCOBUILD
