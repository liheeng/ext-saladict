import React, { FC } from 'react'
import {
  _CambridgeSearchResult,
  CambridgeSearchResult,
  parseSearchResult
} from './engine'
import { ViewPorps } from '@/components/dictionaries/helpers'
import { StrElm } from '@/components/StrElm'

// export const DictCambridge: FC<ViewPorps<CambridgeResult>> = props => (
//   <>
//     {props.result.map(entry => (
//       <section
//         key={entry.id}
//         id={entry.id}
//         className="dictCambridge-Entry"
//         onClick={handleEntryClick}
//       >
//         <StrElm html={entry.html} />
//       </section>
//     ))}
//   </>
// )

export const DictCambridge: FC<ViewPorps<
  _CambridgeSearchResult<string>
>> = props => {
  const [
    parsedResult,
    setParsedResult
  ] = React.useState<CambridgeSearchResult | null>(null)
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

  return (
    <>
      {parsedResult.result.map(entry => (
        <section
          key={entry.id}
          id={entry.id}
          className="dictCambridge-Entry"
          onClick={handleEntryClick}
        >
          <StrElm html={entry.html} />
        </section>
      ))}
    </>
  )
}

export default DictCambridge

function handleEntryClick(e: React.MouseEvent<HTMLElement>) {
  const target = e.nativeEvent.target as HTMLDivElement
  if (target && target.classList) {
    if (target.classList.contains('js-accord')) {
      target.classList.toggle('open')
    }

    if (target.classList.contains('daccord_h')) {
      target.parentElement!.classList.toggle('open')
    }
  }
}
