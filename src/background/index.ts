import './env'
import './initialization'
import { getConfig, addConfigListener } from '@/_helpers/config-manager'
import {
  createActiveProfileStream,
  createProfileIDListStream
} from '@/_helpers/profile-manager'
import { message, getGlobalThis } from '@/_helpers/browser-api'
import { startSyncServiceInterval } from './sync-manager'
import { init as initPdf } from './pdf-sniffer'
import { ContextMenus } from './context-menus'
import { SalaDictExtension, BackgroundServer } from './server'
import { initBadge } from './badge'
import { setupCaiyunTrsBackend } from './page-translate/caiyun'
import { setupRequestGAListener } from '@/_helpers/analytics'
import './types'

// window is not defined in background script, but we need it for some reason
getGlobalThis().fake_background_window = {
  name: 'background',
  version: '1.0.0'
} as any

console.info(
  'getGlobalThis().fake_background_window',
  getGlobalThis().fake_background_window
)

console.debug('Saladict extension initializing...')
SalaDictExtension.init()

// init first to recevice self messaging
console.debug('Saladict Server init...')
message.self.initServer()

console.debug('Starting sync services...')
startSyncServiceInterval()

console.debug('ContextMenus init...')
ContextMenus.init()

console.debug('BackgroundServer init...')
BackgroundServer.init()

console.debug('Caiyun translation backend setup...')
setupCaiyunTrsBackend()

console.debug('Request GA listener setup...')
setupRequestGAListener()

getConfig().then(async config => {
  SalaDictExtension.appConfig = config
  initPdf(config)
  initBadge()

  addConfigListener(({ newConfig }) => {
    SalaDictExtension.appConfig = newConfig
  })
})

createActiveProfileStream().subscribe(profile => {
  SalaDictExtension.activeProfile = profile
})

createProfileIDListStream().subscribe(list => {
  SalaDictExtension.profileIDList = list
})
