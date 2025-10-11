import { fetchPlainText } from '@/_helpers/fetch-dom'
import {
  HTMLString,
  getText,
  getInnerHTML,
  handleNoResult,
  handleNetWorkError,
  SearchFunction,
  GetSrcPageFunction,
  removeChildren,
  DictSearchResult
} from '../helpers'
import { parseDomFromPlainHtml } from '@/_helpers/dom'
export type JukuuLang = 'engjp' | 'zhjp' | 'zheng'

function getUrl(text: string, lang: JukuuLang) {
  text = encodeURIComponent(text.replace(/\s+/g, '+'))

  switch (lang) {
    case 'engjp':
      return 'http://www.jukuu.com/jsearch.php?q=' + text
    case 'zhjp':
      return 'http://www.jukuu.com/jcsearch.php?q=' + text
    // case 'zheng':
    default:
      return 'http://www.jukuu.com/search.php?q=' + text
  }
}

export const getSrcPage: GetSrcPageFunction = (text, config, profile) => {
  return getUrl(text, profile.dicts.all.jukuu.options.lang)
}

interface JukuuTransItem {
  trans: HTMLString
  original: string
  src: string
}

export interface JukuuResult {
  lang: JukuuLang
  sens: JukuuTransItem[]
}

export interface JukuuPayload {
  lang?: JukuuLang
}

export type JukuuSearchResult = DictSearchResult<JukuuResult>

export interface _JukuuSearchResult<T> {
  data: T
  lang: JukuuLang
}

export const search: SearchFunction<
  _JukuuSearchResult<string>,
  JukuuPayload
> = (text, config, profile, payload) => {
  const lang = payload.lang || profile.dicts.all.jukuu.options.lang
  return fetchPlainText(getUrl(text, lang))
    .catch(handleNetWorkError)
    .then(doc => {
      return {
        result: {
          data: doc,
          lang: lang
        }
      }
    })
}

export async function parseSearchResult(
  result: _JukuuSearchResult<string>
): Promise<JukuuSearchResult> {
  return new Promise((resolve, reject) => {
    resolve(handleDOM(parseDomFromPlainHtml(result.data)))
  }).then(sens => {
    if ((sens as any).length > 0) {
      return {
        result: { lang: result.lang, sens } as JukuuResult
      }
    } else {
      return handleNoResult()
    }
  })
}

function handleDOM(doc: Document): JukuuTransItem[] {
  return [...doc.querySelectorAll('tr.e')]
    .map($e => {
      const $trans = $e.lastElementChild
      if (!$trans) {
        return
      }
      removeChildren($trans, 'img')

      const $original = $e.nextElementSibling
      if (!$original || !$original.classList.contains('c')) {
        return
      }

      const $src = $original.nextElementSibling

      return {
        trans: getInnerHTML('http://www.jukuu.com', $trans),
        original: getText($original),
        src:
          $src && $src.classList.contains('s')
            ? getText($src).replace(/^[\s-]*/, '')
            : ''
      }
    })
    .filter((item): item is JukuuTransItem => Boolean(item && item.trans))
}
