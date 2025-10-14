import { fetchPlainText } from '@/_helpers/fetch-dom'
import {
  getText,
  handleNoResult,
  handleNetWorkError,
  SearchFunction,
  GetSrcPageFunction,
  DictSearchResult
} from '../helpers'
import { parseDomFromPlainHtml } from '@/_helpers/dom'

export const getSrcPage: GetSrcPageFunction = text => {
  return `https://www.vocabulary.com/dictionary/${text}`
}

export interface VocabularyResult {
  short: string
  long: string
}

export type VocabularySearchResult = DictSearchResult<VocabularyResult>

export interface _VocabularySearchResult<T> {
  data: T
}

// export const search: SearchFunction<VocabularyResult> = (
//   text,
//   config,
//   profile,
//   payload
// ) => {
//   return fetchDirtyDOM(
//     'https://www.vocabulary.com/dictionary/' +
//       encodeURIComponent(text.replace(/\s+/g, ' '))
//   )
//     .catch(handleNetWorkError)
//     .then(handleDOM)
// }

export const search: SearchFunction<_VocabularySearchResult<string>> = (
  text,
  config,
  profile,
  payload
) => {
  return fetchPlainText(
    'https://www.vocabulary.com/dictionary/' +
      encodeURIComponent(text.replace(/\s+/g, ' '))
  )
    .catch(handleNetWorkError)
    .then(doc => {
      return {
        result: {
          data: doc
        } as _VocabularySearchResult<string>
      }
    })
}

export async function parseSearchResult(
  result: _VocabularySearchResult<string>
): Promise<VocabularySearchResult> {
  return handleDOM(parseDomFromPlainHtml(result.data))
}

function handleDOM(
  doc: Document
): VocabularySearchResult | Promise<VocabularySearchResult> {
  const short = getText(doc, '.short')
  if (!short) {
    return handleNoResult()
  }

  const long = getText(doc, '.long')
  if (!long) {
    return handleNoResult()
  }

  return { result: { long, short } }
}
