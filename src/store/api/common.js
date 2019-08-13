import SHA256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'
import { BUILD_INFO } from '~/src/constants'
import { SECRET_KEY } from './constants'
import APIManager from '~/src/store/api/APIManager'
import { store } from '~/src/store/configStore'
import { chainParse } from '~/src/utils'
import DeviceInfo from 'react-native-device-info'
import { Platform } from 'react-native'
import md5 from 'md5'
import lodash from 'lodash'
const uniqueID = DeviceInfo.getUniqueID()
const uniqueHash = md5(Platform.OS + '_' + uniqueID)
const xDevice = Platform.OS.toUpperCase() + '_' + DeviceInfo.getSystemVersion()
const xVersion = DeviceInfo.getVersion()
import { merchantIdSelector } from '~/src/store/selectors/merchant'
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

export const get = (url, params, api) => {
    return APIManager.getInstance()
        .then(apiConfig => {
            // console.log('API Config', apiConfig)
            const state = store.getState()
            const accessToken = chainParse(state, ['auth', 'accessToken'])
            const tenantCode = chainParse(state, ['auth', 'tenantCode'])
            const merchantId = merchantIdSelector(state)
            let sendHeader = {
                'X-DATA-VERSION': BUILD_INFO['X-DATA-VERSION'],
                'X-VERSION': xVersion,
                'X-DEVICE': xDevice,
                'X-UNIQUE-DEVICE': uniqueHash,
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                'X-MERCHANT-ID': merchantId,
                'X-TENANT-CODE': tenantCode
            }

            if (!api) {
                api = apiConfig.API_URL
            }
            let tailUrl = convertParamToPath(params) ? url + '?' + convertParamToPath(params, true) : url
            let tailUrlDecode = convertParamToPath(params) ? url + '?' + convertParamToPath(params) : url
            console.log('tailUrl', tailUrl)
            console.log('tailUrlDecode', tailUrlDecode)
            api += tailUrl
            console.log('API GET', api)
            console.log('Header', sendHeader)
            let timeStamp = Math.floor((new Date().getTime()) / 1000)
            let xAuthStr = (tailUrlDecode) + sendHeader['X-UNIQUE-DEVICE'] + sendHeader['X-DATA-VERSION'] + sendHeader['X-VERSION']
                + timeStamp + SECRET_KEY
            let xAuth = hashSHA256(xAuthStr)
            // console.log('xAuth', xAuth)
            // const fetchFunc = (apiConfig.name == 'PROD' || apiConfig.name == 'F5') ? pinch.fetch : fetch
            // const sslPinningObj = (apiConfig.name == 'PROD' || apiConfig.name == 'F5') ? { cert: 'mshop' } : {}
            return fetch(api, {
                method: 'GET',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-AUTH': xAuth,
                    'X-TIMESTAMP': timeStamp,
                    ...sendHeader
                },
                // sslPinning: sslPinningObj
            }
            ).then(res => resolveResponse(res))
        })
}

export const post = (url, body, api) => {
    return APIManager.getInstance()
        .then(apiConfig => {
            // console.log('API Config', apiConfig)
            const state = store.getState()
            const accessToken = chainParse(state, ['auth', 'accessToken'])
            const merchantId = merchantIdSelector(state)
            const tenantCode = chainParse(state, ['auth', 'tenantCode'])

            // SHA256(X-DATA-VERSION + X-VERSION+ X-TIMESTAMP+SecretKey+Json body)
            let stringifyBody = JSON.stringify(body)
            let sendHeader = {
                'X-DATA-VERSION': BUILD_INFO['X-DATA-VERSION'],
                'X-VERSION': xVersion,
                'X-DEVICE': xDevice,
                'X-UNIQUE-DEVICE': uniqueHash,
                'X-LANGUAGE': 'vi',
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                'X-MERCHANT-ID': merchantId,
                'X-TENANT-CODE': tenantCode
            }
            let timeStamp = Math.floor((new Date().getTime()) / 1000)
            console.log('Post url', url)
            let xAuthStr = (url) + sendHeader['X-UNIQUE-DEVICE'] + sendHeader['X-DATA-VERSION'] + sendHeader['X-VERSION']
                + timeStamp + SECRET_KEY + stringifyBody
            let xAuth = hashSHA256(xAuthStr) //SHA256(xAuthStr).toString(CryptoJS.enc.Hex)
            if (!api) {
                api = apiConfig.API_URL
            }
            console.log('API Post', api + url)
            console.log('Header', sendHeader)
            console.log('Post body', body)
            // const fetchFunc = (apiConfig.name == 'PROD' || apiConfig.name == 'F5') ? pinch.fetch : fetch
            // const sslPinningObj = (apiConfig.name == 'PROD' || apiConfig.name == 'F5') ? { cert: 'mshop' } : {}
            // console.log('Fetch func', fetchFunc)
            return fetch(api + url, {
                method: 'POST',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-AUTH': xAuth,
                    'X-TIMESTAMP': timeStamp,
                    // 'X-NO-SESSION': getSessiauthonFromCookie(sendHeader['Cookie']),
                    ...sendHeader
                },
                // sslPinning: sslPinningObj,
                body: stringifyBody
            })
                .then(res => resolveResponse(res))
            // .catch(error => { console.log('request failed', error); });
        })

}