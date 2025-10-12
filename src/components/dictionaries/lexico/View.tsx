import React, { FC } from 'react'
import {
  LexicoResult,
  LexicoResultLex,
  LexicoResultRelated,
  _LexicoSearchResult,
  parseSearchResult
} from './engine'
import { ViewPorps, DictSearchResult } from '@/components/dictionaries/helpers'
import { StrElm } from '@/components/StrElm'

export const DictLexico: FC<ViewPorps<_LexicoSearchResult<string>>> = props => {
  const [parsedResult, setParsedResult] = React.useState<DictSearchResult<
    LexicoResult
  > | null>(null)

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

function renderLex(result: LexicoResultLex) {
  return (
    <StrElm
      className="dictLexico-Lex"
      onClick={onLexClick}
      html={result.entry}
    />
  )
}

function renderRelated(result: LexicoResultRelated) {
  return (
    <>
      <p>Did you mean:</p>
      <ul className="dictLexico-Related">
        {result.list.map((item, i) => (
          <li key={i}>
            <a
              rel="nofollow noopener noreferrer"
              target="_blank"
              href={item.href}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

export default DictLexico

function onLexClick(e: React.MouseEvent): void {
  const $target = e.target as Element
  const $info = $target.classList?.contains('moreInfo')
    ? $target
    : $target.parentElement?.classList?.contains('moreInfo')
    ? $target.parentElement
    : null
  if ($info) {
    $info.classList.toggle('active')
  }
}
