import type { App } from 'vue'
import * as Components from '~/components'

import './css/main.scss'

function install(app: App) {
  Object.keys(Components).forEach((key) => {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    app.component(key, Components[key])
  })
}

export default { install }

export * from '~/components'
export * from '~/constant'
export * from '~/utils'
