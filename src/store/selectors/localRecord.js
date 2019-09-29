import { chainParse } from '~/src/utils'
const emptyArray = []
import lodash from 'lodash'
import { LOCAL_RECORD_STATUS } from '~/src/constants'
export const localRecordSelector = state => chainParse(state, ['localRecord'])

export const notFailedLocalRecordSelector = state => {
    const localRecord = chainParse(state, ['localRecord'])
    if (!localRecord || localRecord.length == 0) return emptyArray
    return localRecord.filter(item => item.status != LOCAL_RECORD_STATUS.FAILED)
}

const memoizeProcessingRecord = lodash.memoize(localRecord => {
    return localRecord.filter(item => item.status != LOCAL_RECORD_STATUS.MEETING_CREATED)
})

export const processingLocalRecordSelector = state => {
    const localRecord = chainParse(state, ['localRecord'])
    if (!localRecord || localRecord.length == 0) return emptyArray
    return memoizeProcessingRecord(localRecord)
}