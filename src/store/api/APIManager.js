import AsyncStorage from '@react-native-community/async-storage'
import { API_ENDPOINT, APP_MODE, APP_MODE_DEF } from '~/src/store/api/constants'

export default class APIManager {
    static apiInstance = null
    static getInstance = () => {
        if (APP_MODE == APP_MODE_DEF.RELEASE) {
            APIManager.apiInstance = API_ENDPOINT['PROD']
            return Promise.resolve(APIManager.apiInstance)
        }
        if (APIManager.apiInstance == null) {
            return new Promise((resolve, reject) => {
                AsyncStorage.getItem('ip', (ipErr, ipResult) => {
                    if (ipErr) reject(ipErr)
                    if (ipResult) {
                        APIManager.apiInstance = {
                            ...API_ENDPOINT['DEV'],
                            IP: ipResult,
                            API_URL: `http://${ipResult}:8888`,
                            AUDIO_URL: `http://${ipResult}:9000/meeting/`
                        }
                        resolve(APIManager.apiInstance)
                    } else {
                        AsyncStorage.getItem('api_endpoint', (err, result) => {
                            if (err) reject(err)
                            const key = result || 'DEV'
                            APIManager.apiInstance = API_ENDPOINT[key]
                            resolve(APIManager.apiInstance)
                        })
                    }
                })
            })
        }
        return Promise.resolve(APIManager.apiInstance)
    }

    static saveIp = (ip) => {
        APIManager.apiInstance = {
            ...API_ENDPOINT['DEV'],
            IP: ip,
            API_URL: `http://${ip}:8888`,
            AUDIO_URL: `http://${ip}:9000/meeting/`
        }
        AsyncStorage.setItem('ip', ip)
    }

    static save = (endpoint) => {
        if (APP_MODE == APP_MODE_DEF.RELEASE) return
        APIManager.apiInstance = API_ENDPOINT[endpoint] || API_ENDPOINT['DEV']
        AsyncStorage.setItem('api_endpoint', endpoint)
    }
}