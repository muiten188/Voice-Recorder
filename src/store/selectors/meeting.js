import { chainParse } from '~/src/utils'
import lodash from 'lodash'

const emptyArray = []
const emptyObj = {}

export const meetingListSelector = (state) => chainParse(state, ['meeting']) || emptyObj