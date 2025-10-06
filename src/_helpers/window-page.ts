export interface WindowPageInfo {
  width: number
  height: number
  availWidth: number
  availHeight: number
  colorDepth: number
  pixelDepth: number
}
export interface WindowPageInfoResult {
  WindowPageInfo: WindowPageInfo
  error?: string
}
export interface WindowPageInfoError {
  error: string
  WindowPageInfo?: WindowPageInfo
}
export interface WindowPageInfoSuccess {
  WindowPageInfo: WindowPageInfo
  error?: string
}
export interface WindowPageInfoResponse {
  WindowPageInfo: WindowPageInfo
  error?: string
}
export async function getWindowPageInfo(): Promise<WindowPageInfo | null> {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    if (tabs.length > 0 && typeof tabs[0].id === 'number') {
      const activeTabId = tabs[0].id

      const results = await browser.tabs.executeScript(activeTabId, {
        code: `
          ({
            width: window.screen.width,
            height: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth
          })
        `
      })

      if (results && results.length > 0 && results[0]) {
        console.info('Screen information:', results[0])
        return Promise.resolve(results[0] as WindowPageInfo)
      } else {
        console.log(
          'Could not retrieve screen information from the content script.'
        )
        return null
      }
    } else {
      console.log('No active tab with a valid id found.')
      return null
    }
  } catch (error) {
    console.error('Error getting screen information:', error)
    return null
  }
}
