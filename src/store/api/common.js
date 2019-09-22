import SHA256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'
import APIManager from '~/src/store/api/APIManager'
import { store } from '~/src/store/configStore'
import { chainParse } from '~/src/utils'
import DeviceInfo from 'react-native-device-info'
import { Platform } from 'react-native'
import md5 from 'md5'
import lodash from 'lodash'

const convertParamToPath = (data, encode = false) => data ? Object.keys(data).map((key) => key + '=' + (encode ? encodeURIComponent(data[key]) : data[key])).join('&') : ''

const hashSHA256 = (strData) => {
    return SHA256(strData).toString(CryptoJS.enc.Hex)
}

const resolveResponse = async (res) => {
    const httpStatus = lodash.pick(res, ['status', 'statusText'])
    const headerMap = (res && res.headers && res.headers.map) ? { ...res.headers.map, ...httpStatus } : httpStatus
    let responseText = await res.text()
    try {
        let jsonBody = JSON.parse(responseText)
        if (jsonBody && lodash.isPlainObject(jsonBody)) {
            return {
                ...jsonBody,
                httpHeaders: {
                    ...headerMap
                }
            }
        } else {
            return {
                result: jsonBody,
                httpHeaders: {
                    ...headerMap
                }
            }
        }
    } catch (e) {
        return {
            result: responseText,
            httpHeaders: {
                ...headerMap
            }
        }
    }
}

export const get = (url, params, customHeader, api) => {
    return APIManager.getInstance()
        .then(apiConfig => {
            const state = store.getState()
            const accessToken = chainParse(state, ['auth', 'access_token']) || ''
            let sendHeader = {
                token: accessToken,
                ...customHeader,
            }

            if (!api) {
                api = apiConfig.API_URL
            }
            let tailUrl = convertParamToPath(params) ? url + '?' + convertParamToPath(params, true) : url
            let tailUrlDecode = convertParamToPath(params) ? url + '?' + convertParamToPath(params) : url
            api += tailUrl
            // console.log('get tailUrl', tailUrl)
            // console.log('get tailUrlDecode', tailUrlDecode)
            console.log('API GET', api)
            console.log('Header', sendHeader)
            return fetch(api, {
                method: 'GET',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...sendHeader
                },
            }
            ).then(res => resolveResponse(res))
        })
}

export const post = (url, body, customHeader, api) => {
    return APIManager.getInstance()
        .then(apiConfig => {
            const state = store.getState()
            const accessToken = chainParse(state, ['auth', 'access_token'])
            let stringifyBody = JSON.stringify(body)
            let sendHeader = {
                token: accessToken,
                ...customHeader,
            }
            if (!api) {
                api = apiConfig.API_URL
            }
            console.log('API Post', api + url)
            console.log('Header', sendHeader)
            console.log('Post body', body)

            return fetch(api + url, {
                method: 'POST',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...sendHeader
                },
                body: stringifyBody
            })
                .then(res => resolveResponse(res))
        })
}

export const deleteMethod = (url, params, customHeader, api) => {
    return APIManager.getInstance()
        .then(apiConfig => {
            const state = store.getState()
            const accessToken = chainParse(state, ['auth', 'access_token']) || ''
            let sendHeader = {
                token: accessToken,
                ...customHeader,
            }

            if (!api) {
                api = apiConfig.API_URL
            }
            let tailUrl = convertParamToPath(params) ? url + '?' + convertParamToPath(params, true) : url
            let tailUrlDecode = convertParamToPath(params) ? url + '?' + convertParamToPath(params) : url
            api += tailUrl
            console.log('DELETE tailUrl', tailUrl)
            console.log('DELETE tailUrlDecode', tailUrlDecode)
            console.log('API DELETE', api)
            console.log('Header', sendHeader)
            return fetch(api, {
                method: 'DELETE',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...sendHeader
                },
            }
            ).then(res => resolveResponse(res))
        })
}