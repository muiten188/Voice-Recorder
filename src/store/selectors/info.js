import { chainParse } from '~/src/utils'

export const isConnectSelector = state => chainParse(state, ['info', 'isConnected'])

export const isShowingForceUpdateSelector = state => chainParse(state, ['info', 'showingForceUpdate'])

export const appStateSelector = state => chainParse(state, ['info', 'appState'])
