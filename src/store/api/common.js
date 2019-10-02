import SHA256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'
import APIManager from '~/src/store/api/APIManager'
import { store } from '~/src/store/configStore'
import { chainParse } from '~/src/utils'
import DeviceInfo from 'react-native-device-info'
import { Platform } from 'react-native'
import md5 from 'md5'
import lodash from 'lodash'
import { TIMEOUT_TIME, NETWORD_ERROR_EXCEPTION, TIMEOUT, NETWORK_ERROR } from '~/src/constants'

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

export const get = (url, params, extra = {}) => {
    const { customHeader = {}, api = '', timeout = TIMEOUT_TIME } = extra
    return APIManager.getInstance()
        .then(apiConfig => {
            const state = store.getState()
            const accessToken = chainParse(state, ['auth', 'access_token']) || ''
            let sendHeader = {
                token: accessToken,
                ...customHeader,
            }
            let apiEndpoint = api || apiConfig.API_URL
            let tailUrl = convertParamToPath(params) ? url + '?' + convertParamToPath(params, true) : url
            apiEndpoint += tailUrl
            console.log('API GET', apiEndpoint)
            console.log('Header', sendHeader)
            return new Promise((resolve, reject) => {
                Promise.race([
                    fetch(apiEndpoint, {
                        method: 'GET',
                        credentials: 'omit',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            ...sendHeader
                        },
                    }).then(res => resolveResponse(res)),
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(TIMEOUT)
                        }, timeout)
                    })
                ])
                    .then(value => {
                        if (value == TIMEOUT) {
                            resolve({ code: TIMEOUT })
                        } else {
                            resolve(value)
                        }
                    })
                    .catch(err => {
                        if (err.toString().indexOf(NETWORD_ERROR_EXCEPTION) == 0) {
                            resolve({ code: NETWORK_ERROR })
                        }
                    })
            })
        })
}

export const post = (url, body, extra = {}) => {
    const { customHeader = {}, api = '', timeout = TIMEOUT_TIME } = extra
    return APIManager.getInstance()
        .then(apiConfig => {
            const state = store.getState()
            const accessToken = chainParse(state, ['auth', 'access_token'])
            let stringifyBody = JSON.stringify(body)
            let sendHeader = {
                token: accessToken,
                ...customHeader,
            }
            const apiEndpoint = api || apiConfig.API_URL
            console.log('API Post', apiEndpoint + url)
            console.log('Header', sendHeader)
            console.log('Post body', body)


            return new Promise((resolve, reject) => {
                Promise.race([
                    fetch(apiEndpoint + url, {
                        method: 'POST',
                        credentials: 'omit',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            ...sendHeader
                        },
                        body: stringifyBody
                    }).then(res => resolveResponse(res)),
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(TIMEOUT)
                        }, timeout)
                    })
                ])
                    .then(value => {
                        if (value == TIMEOUT) {
                            resolve({ code: TIMEOUT })
                        } else {
                            resolve(value)
                        }
                    })
                    .catch(err => {
                        if (err.toString().indexOf(NETWORD_ERROR_EXCEPTION) == 0) {
                            resolve({ code: NETWORK_ERROR })
                        }
                    })
            })
        })
}

export const put = (url, body, extra = {}) => {
    const { customHeader = {}, api = '', timeout = TIMEOUT_TIME } = extra
    return APIManager.getInstance()
        .then(apiConfig => {
            const state = store.getState()
            const accessToken = chainParse(state, ['auth', 'access_token'])
            let stringifyBody = JSON.stringify(body)
            let sendHeader = {
                token: accessToken,
                ...customHeader,
            }
            const apiEndpoint = api || apiConfig.API_URL
            console.log('API Post', apiEndpoint + url)
            console.log('Header', sendHeader)
            console.log('Post body', body)


            return new Promise((resolve, reject) => {
                Promise.race([
                    fetch(apiEndpoint + url, {
                        method: 'POST',
                        credentials: 'omit',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            ...sendHeader
                        },
                        body: stringifyBody
                    }).then(res => resolveResponse(res)),
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(TIMEOUT)
                        }, timeout)
                    })
                ])
                    .then(value => {
                        if (value == TIMEOUT) {
                            resolve({ code: TIMEOUT })
                        } else {
                            resolve(value)
                        }
                    })
                    .catch(err => {
                        if (err.toString().indexOf(NETWORD_ERROR_EXCEPTION) == 0) {
                            resolve({ code: NETWORK_ERROR })
                        }
                    })
            })
        })
}


export const deleteMethod = (url, params, extra = {}) => {
    const { customHeader = {}, api = '', timeout = TIMEOUT_TIME } = extra
    return APIManager.getInstance()
        .then(apiConfig => {
            const state = store.getState()
            const accessToken = chainParse(state, ['auth', 'access_token']) || ''
            let sendHeader = {
                token: accessToken,
                ...customHeader,
            }

            let apiEndpoint = api || apiConfig.API_URL
            let tailUrl = convertParamToPath(params) ? url + '?' + convertParamToPath(params, true) : url
            apiEndpoint += tailUrl
            console.log('DELETE tailUrl', tailUrl)
            console.log('API DELETE', apiEndpoint)
            console.log('Header', sendHeader)

            return new Promise((resolve, reject) => {
                Promise.race([
                    fetch(apiEndpoint, {
                        method: 'DELETE',
                        credentials: 'omit',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            ...sendHeader
                        },
                    }).then(res => resolveResponse(res)),
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(TIMEOUT)
                        }, timeout)
                    })
                ])
                    .then(value => {
                        if (value == TIMEOUT) {
                            resolve({ code: TIMEOUT })
                        } else {
                            resolve(value)
                        }
                    })
                    .catch(err => {
                        if (err.toString().indexOf(NETWORD_ERROR_EXCEPTION) == 0) {
                            resolve({ code: NETWORK_ERROR })
                        }
                    })
            })
        })
}