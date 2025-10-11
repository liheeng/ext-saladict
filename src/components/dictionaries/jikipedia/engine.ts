import { fetchPlainText } from '@/_helpers/fetch-dom'
import {
  HTMLString,
  getText,
  getInnerHTML,
  handleNoResult,
  handleNetWorkError,
  SearchFunction,
  GetSrcPageFunction,
  DictSearchResult,
  getFullLink
} from '../helpers'
import { parseDomFromPlainHtml } from '@/_helpers/dom'
import { DictConfigs } from '@/app-config'

export const getSrcPage: GetSrcPageFunction = text => {
  return `https://jikipedia.com/search?phrase=${encodeURIComponent(text)}`
}

const HOST = 'https://jikipedia.com'

interface JikipediaResultItem {
  title: string
  content: HTMLString
  likes: number
  url?: string
  author?: {
    name: string
    url: string
  }
}

export type JikipediaResult = JikipediaResultItem[]

export type JikipediaSearchResult = DictSearchResult<JikipediaResult>

export interface _JikipediaSearchResult<T> {
  data: T
  options: DictConfigs['jikipedia']['options']
}
export const search: SearchFunction<_JikipediaSearchResult<string>> = (
  text,
  config,
  profile,
  payload
) => {
  const options = profile.dicts.all.jikipedia.options

  return fetchPlainText(
    `https://jikipedia.com/search?phrase=${encodeURIComponent(text)}`
  )
    .catch(handleNetWorkError)
    .then(doc => {
      return {
        result: {
          data: doc,
          options
        }
      }
    })
}

export async function parseSearchResult(
  result: _JikipediaSearchResult<string>
): Promise<JikipediaSearchResult> {
  return handleDOM(parseDomFromPlainHtml(result.data), result.options)
}

function handleDOM(
  doc: Document,
  { resultnum }: { resultnum: number }
): JikipediaSearchResult | Promise<JikipediaSearchResult> {
  const $cards = doc.querySelectorAll('.lite-card')
  if ($cards.length < 1) {
    return handleNoResult()
  }

  doc.querySelectorAll('.ad-card').forEach(el => el.remove())

  const result: JikipediaResult = []

  for (const $card of $cards) {
    if (result.length >= resultnum) {
      break
    }

    const item: JikipediaResultItem = {
      title: getText($card, '.title'),
      content: getInnerHTML(HOST, $card, '.content'),
      likes: Number(getText($card, '.like-count')) || 0
    }

    if (!item.content) {
      continue
    }

    const $a = $card.querySelector('a.card-content')
    if ($a) {
      item.url = getFullLink(HOST, $a, 'href')
    }

    const $author = $card.querySelector('.author a')
    if ($author) {
      item.author = {
        name: getText($author),
        url: getFullLink(HOST, $author, 'href')
      }
    }

    result.push(item)
  }

  return result.length > 0 ? { result } : handleNoResult()
}
