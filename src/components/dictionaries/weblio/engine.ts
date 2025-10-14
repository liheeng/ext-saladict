import { fetchPlainText } from '@/_helpers/fetch-dom'
import {
  HTMLString,
  getInnerHTML,
  handleNoResult,
  handleNetWorkError,
  getOuterHTML,
  SearchFunction,
  GetSrcPageFunction,
  DictSearchResult,
  getText,
  removeChild
} from '../helpers'
import { parseDomFromPlainHtml } from '@/_helpers/dom'
export const getSrcPage: GetSrcPageFunction = text => {
  return `https://www.weblio.jp/content/${text}`
}

const HOST = 'https://www.weblio.jp'

export type WeblioResult = Array<{
  title: HTMLString
  def: HTMLString
}>

export type WeblioSearchResult = DictSearchResult<WeblioResult>

export interface _WeblioSearchResult<T> {
  data: T
}

// export const search: SearchFunction<WeblioResult> = (
//   text,
//   config,
//   profile,
//   payload
// ) => {
//   return fetchDirtyDOM(
//     'https://www.weblio.jp/content/' +
//       encodeURIComponent(text.replace(/\s+/g, ' '))
//   )
//     .catch(handleNetWorkError)
//     .then(handleDOM)
// }

export const search: SearchFunction<_WeblioSearchResult<string>> = (
  text,
  config,
  profile,
  payload
) => {
  return fetchPlainText(
    'https://www.weblio.jp/content/' +
      encodeURIComponent(text.replace(/\s+/g, ' '))
  )
    .catch(handleNetWorkError)
    .then(doc => {
      return {
        result: {
          data: doc
        } as _WeblioSearchResult<string>
      }
    })
}

export async function parseSearchResult(
  result: _WeblioSearchResult<string>
): Promise<WeblioSearchResult> {
  return handleDOM(parseDomFromPlainHtml(result.data))
}

function handleDOM(
  doc: Document
): WeblioSearchResult | Promise<WeblioSearchResult> {
  const result: WeblioResult = []
  const $titles = doc.querySelectorAll<HTMLAnchorElement>(
    '#cont>.pbarT .pbarTL>a'
  )
  doc
    .querySelectorAll<HTMLDivElement>('#cont>.kijiWrp>.kiji')
    .forEach(($dict, i) => {
      const $title = $titles[i]
      if (!$title) {
        if (process.env.DEBUG) {
          console.error(`Dict Weblio: missing title`)
        }
        return
      }

      if ($title.title === '百科事典') {
        // too long
        return
      }

      result.push({
        title: getOuterHTML(HOST, $title, { config: {} }),
        def: getInnerHTML(HOST, $dict, { config: {} })
      })
    })

  if (result.length <= 0) {
    doc.querySelectorAll('.section-card .basic-card').forEach($card => {
      const title = getText($card, '.pbarT h2')
      if (title) {
        removeChild($card, '.pbarT')
        result.push({
          title,
          def: getInnerHTML(HOST, $card, { config: {} })
        })
      }
    })
  }

  return result.length > 0 ? { result } : handleNoResult()
}
