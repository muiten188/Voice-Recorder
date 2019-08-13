import { utf8ArrayToStr, toNormalCharacter, formatPhoneNumber, formatSpaces, formatMoney } from '~/src/utils'
import { Base64 } from 'js-base64'
import lodash from 'lodash'
import { BleManager } from 'react-native-ble-plx';
import moment from 'moment'
import EscPosEncoder from '~/src/utils/EscPosEncoder'
import I18n from "~/src/I18n"
import { BLE_ERR } from '~/src/constants'

export default class BlePrintManager {
    static bleManager = null
    static device = null
    static writeableCharacteristic = null

    static reset = () => {
        BlePrintManager.bleManager = new BleManager()
        BlePrintManager.device = null
        BlePrintManager.writeableCharacteristic = null
    }

    static setup = (newDevice) => {
        if (!BlePrintManager.bleManager) {
            BlePrintManager.bleManager = new BleManager()
            BlePrintManager.device = newDevice
            BlePrintManager.writeableCharacteristic = null
        } else if (newDevice && (!BlePrintManager.device || BlePrintManager.device.id != newDevice.id)) {
            BlePrintManager.device = newDevice
            BlePrintManager.writeableCharacteristic = null
        }
    }

    static getBleManager = () => BlePrintManager.bleManager

    static _printByCharacteristic = async (escCommand) => {
        const splitEscCommand = lodash.chunk(escCommand, 5)
        // return Promise.all(
        //     splitEscCommand.map(command => BlePrintManager.writeableCharacteristic.writeWithoutResponse(Base64.encode(utf8ArrayToStr(command))))
        // )
        for (let i = 0; i < splitEscCommand.length; i++) {
            await BlePrintManager.writeableCharacteristic.writeWithoutResponse(Base64.encode(utf8ArrayToStr(splitEscCommand[i])))
        }
        return ''
    }

    static connect = (newDevice) => {
        BlePrintManager.setup(newDevice)
        return new Promise((resolve, reject) => {
            BlePrintManager.bleManager.isDeviceConnected(BlePrintManager.device.id)
                .then(isConnected => {
                    console.log('isConnected', isConnected)
                    if (isConnected) return BlePrintManager.device
                    return BlePrintManager.bleManager.connectToDevice(BlePrintManager.device.id)
                })
                .then(device => {
                    BlePrintManager.device = device
                    console.log('Connect to device', device)
                    return device.discoverAllServicesAndCharacteristics()
                })
                .then(device => {
                    BlePrintManager.device = device
                    return device.services()
                })
                .then(services => {
                    console.log('Services', services)
                    return Promise.all(
                        services.map(item => item.characteristics())
                    )
                })
                .then(characteristics => {
                    const flatCharacteristicArr = characteristics.reduce((a, b) => [...a, ...b], [])
                    const writeableCharacteristic = flatCharacteristicArr.find(item => item.isWritableWithResponse)
                    console.log('writeableCharacteristic', writeableCharacteristic)
                    if (!writeableCharacteristic) {
                        reject('No writeableCharacteristic ')
                        return
                    }
                    BlePrintManager.writeableCharacteristic = writeableCharacteristic
                    resolve('Connect ok')
                })
                .catch(err => {
                    console.log('Err', err)
                    reject(err)
                })
        })

    }

    static print = (newDevice, escCommand) => {
        BlePrintManager.setup(newDevice)
        console.log('Print escCommand', escCommand)
        return new Promise((resolve, reject) => {
            if (BlePrintManager.writeableCharacteristic) {
                console.log('Case 2')
                BlePrintManager._printByCharacteristic(escCommand)
                    .then(() => {
                        console.log('Write done _printByCharacteristic')
                        resolve('Write done _printByCharacteristic')
                    })
                    .catch(err => {
                        const strErr = err.toString()
                        console.log('Err _printByCharacteristic', strErr)
                        if (strErr.indexOf('Characteristic') > 0 && strErr.endsWith('not found')) {
                            reject(BLE_ERR.CHARACTERISTIC_NOT_FOUND)
                        }
                        reject(strErr)
                    })
            } else {
                console.log('Case 1')
                BlePrintManager.bleManager.isDeviceConnected(BlePrintManager.device.id)
                    .then(isConnected => {
                        console.log('isConnected', isConnected)
                        if (isConnected) return BlePrintManager.device
                        return BlePrintManager.bleManager.connectToDevice(BlePrintManager.device.id)
                    })
                    .then(device => {
                        BlePrintManager.device = device
                        console.log('Connect to device', device)
                        return device.discoverAllServicesAndCharacteristics()
                    })
                    .then(device => {
                        BlePrintManager.device = device
                        return device.services()
                    })
                    .then(services => {
                        console.log('Services', services)
                        return Promise.all(
                            services.map(item => item.characteristics())
                        )
                    })
                    .then(characteristics => {
                        const flatCharacteristicArr = characteristics.reduce((a, b) => [...a, ...b], [])
                        const writeableCharacteristic = flatCharacteristicArr.find(item => item.isWritableWithResponse)
                        console.log('writeableCharacteristic', writeableCharacteristic)
                        if (!writeableCharacteristic) return
                        BlePrintManager.writeableCharacteristic = writeableCharacteristic
                        return BlePrintManager._printByCharacteristic(escCommand)
                    })
                    .then(characteristic => {
                        console.log('write done')
                        resolve('write done')
                    })
                    .catch(err => {

                        const strErr = err.toString()
                        console.log('Err', strErr)
                        if (strErr.endsWith('was disconnected')) {
                            reject(BLE_ERR.DISCONNECTED)
                        }
                        console.log('Err to string')
                        reject(strErr)
                    })
            }
        })
    }

    static printOrder = async (device, orderInfo) => {
        console.log('printOrder orderInfo', orderInfo)
        let totalAmount = orderInfo.totalAmount || 0
        let discountAmount = orderInfo.discountAmount || 0
        let paidAmount = orderInfo.paidAmount || 0
        const merchantName = toNormalCharacter(orderInfo.merchantName)
        const encoder = new EscPosEncoder()
        const merchantNameCommand = encoder
            .initialize()
            .newline()
            .align('center')
            .setPrintMode(0x20)
            .text(merchantName)
            .setPrintMode(0x00)
            .encode()

        const merchantAddress = toNormalCharacter(orderInfo.merchantAddress)
        const merchantAddressCommand = encoder
            .newline()
            .align('center')
            .text(merchantAddress)
            .encode()

        const merchantPhone = formatPhoneNumber(orderInfo.merchantPhone)
        const merchantPhoneCommand = encoder
            .newline()
            .align('center')
            .text(merchantPhone)
            .encode()
        const billLabelStr = toNormalCharacter(I18n.t('bill_label')).toUpperCase()
        const invoiceCommand = encoder
            .newline()
            .newline()
            .align('center')
            .setPrintMode(0x20)
            .text(billLabelStr)
            .setPrintMode(0x00)
            .newline()
            .text(orderInfo.orderCode)
            .newline()
            .encode()

        const dateCommand = encoder
            .newline()
            .align('left')
            .text(`${toNormalCharacter(I18n.t('bill_time_label'))}: ${moment().format(I18n.t('full_date_time_format'))}`)
            .encode()

        const staffCommand = encoder
            .newline()
            .align('left')
            .text(`${toNormalCharacter(I18n.t('staff_label'))}: ${toNormalCharacter(orderInfo.staff)}`)
            .encode()

        const productHeaderCommand = encoder
            .newline2()
            .text(formatSpaces(toNormalCharacter(I18n.t('bill_qty_label')), 4, 'left'))
            .text(formatSpaces(toNormalCharacter(I18n.t('bill_price_label')), 14, 'left'))
            .text(formatSpaces(toNormalCharacter(I18n.t('bill_money_label')), 14, 'right'))
            .encode()

        const split1Command = encoder
            .newline2()
            .align('center')
            .text('------------------------------')
            .encode()

        const splitCommand = encoder
            .newline()
            .align('center')
            .text('------------------------------')
            .encode()

        const goodByeCommand = encoder
            .newline()
            .align('center')
            .text(toNormalCharacter(I18n.t('bill_goodbye')))
            .encode()

        const endCommand = encoder
            .newline()
            .newline()
            .newline()
            .newline()
            .encode()

        await BlePrintManager.print(device, merchantNameCommand)
        await BlePrintManager.print(device, merchantAddressCommand)
        await BlePrintManager.print(device, merchantPhoneCommand)
        await BlePrintManager.print(device, invoiceCommand)
        if (orderInfo.tableDisplayName) {
            const tableDisplayCommand = encoder
                .newline()
                .align('left')
                .text(`${toNormalCharacter(I18n.t('bill_floor_table'))}: ${toNormalCharacter(orderInfo.tableDisplayName)}`)
                .encode()
            await BlePrintManager.print(device, tableDisplayCommand)
        }

        await BlePrintManager.print(device, dateCommand)
        await BlePrintManager.print(device, staffCommand)
        await BlePrintManager.print(device, splitCommand)
        await BlePrintManager.print(device, productHeaderCommand)
        await BlePrintManager.print(device, split1Command)
        for (let i = 0; i < orderInfo.items.length; i++) {
            const product = orderInfo.items[i]
            const productNameCommand = encoder
                .newline()
                .align('left')
                .text(toNormalCharacter(product.productName))
                .encode()
            const priceQty = product.price * product.qty
            // totalAmount += priceQty
            const productCommand = encoder
                .newline2()
                .text(formatSpaces(product.qty, 4, 'left'))
                .text(formatSpaces(`${formatMoney(product.price)}${I18n.t('d_normal')}`, 14, 'left'))
                .text(formatSpaces(`${formatMoney(priceQty)}${I18n.t('d_normal')}`, 14, 'right'))
                .encode()

            await BlePrintManager.print(device, productNameCommand)
            await BlePrintManager.print(device, productCommand)
        }
        await BlePrintManager.print(device, splitCommand)
        const totalAmountCommand = encoder
            .newline2()
            .align('left')
            .text(formatSpaces(toNormalCharacter(I18n.t('total_amount')), I18n.t('total_amount').length, 'left'))
            .text(formatSpaces(`${formatMoney(totalAmount)}${I18n.t('d_normal')}`, 32 - I18n.t('total_amount').length, 'right'))
            .encode()
        const discountAmountCommand = encoder
            .newline2()
            .align('left')
            .text(formatSpaces(toNormalCharacter(I18n.t('direct_discount')), I18n.t('direct_discount').length, 'left'))
            .text(formatSpaces(`${formatMoney(discountAmount)}${I18n.t('d_normal')}`, 32 - I18n.t('direct_discount').length, 'right'))
            .encode()
        const paidAmountCommand = encoder
            .newline2()
            .align('left')
            .text(formatSpaces(toNormalCharacter(I18n.t('paid_amount')), I18n.t('paid_amount').length, 'left'))
            .text(formatSpaces(`${formatMoney(paidAmount)}${I18n.t('d_normal')}`, 32 - I18n.t('paid_amount').length, 'right'))
            .encode()

        await BlePrintManager.print(device, totalAmountCommand)
        await BlePrintManager.print(device, discountAmountCommand)
        await BlePrintManager.print(device, paidAmountCommand)
        await BlePrintManager.print(device, split1Command)
        await BlePrintManager.print(device, goodByeCommand)
        await BlePrintManager.print(device, endCommand)

    }
}