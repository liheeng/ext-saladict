import './env'
import './initialization'
import { getConfig, addConfigListener } from '@/_helpers/config-manager'
import {
  createActiveProfileStream,
  createProfileIDListStream
} from '@/_helpers/profile-manager'
import { message } from '@/_helpers/browser-api'
import { startSyncServiceInterval } from './sync-manager'
import { init as initPdf } from './pdf-sniffer'
import { ContextMenus } from './context-menus'
import { SalaDictExtension, BackgroundServer } from './server'
import { initBadge } from './badge'
import { setupCaiyunTrsBackend } from './page-translate/caiyun'
import { setupRequestGAListener } from '@/_helpers/analytics'
import './types'

// init first to recevice self messaging
message.self.initServer()

startSyncServiceInterval()

ContextMenus.init()
BackgroundServer.init()

setupCaiyunTrsBackend()

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
