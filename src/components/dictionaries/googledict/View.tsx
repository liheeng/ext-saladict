import React, { FC } from 'react'
import {
  GoogleDictSearchResult,
  _GoogleDictSearchResult,
  parseSearchResult
} from './engine'
import { ViewPorps } from '@/components/dictionaries/helpers'
import { StrElm } from '@/components/StrElm'

export const DictGoogleDict: FC<ViewPorps<
  _GoogleDictSearchResult<string>
>> = props => {
  const [
    parsedResult,
    setParsedResult
  ] = React.useState<GoogleDictSearchResult | null>(null)

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
    <div>
      {result.styles.map((style, i) => (
        <style key={i}>{style}</style>
      ))}
      <StrElm onClick={onEntryClick} className="xpdopen" html={result.entry} />
    </div>
  )
}

function onEntryClick(e: React.MouseEvent) {
  for (
    let isMoreBtn: boolean | null = null, node = e.target as Element | null;
    node;
    node = node.parentElement
  ) {
    if (node.getAttribute('jsname') === 'Stv3Z') {
      isMoreBtn = true
    } else if (node.getAttribute('jsname') === 'hj0qK') {
      isMoreBtn = false
    }
    if (node.classList) {
      if (node.classList.contains('P2Dfkf')) {
        if (isMoreBtn === null) {
          continue
        }
        if (isMoreBtn) {
          node.classList.replace('SkSOXb', 'KAwqid')
        } else {
          node.classList.replace('KAwqid', 'SkSOXb')
        }
        break
      }
    }
  }
}

export default DictGoogleDict
