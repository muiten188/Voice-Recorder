import React, { Component } from 'react'
import NetInfo from "@react-native-community/netinfo"
import styles from './styles';
import { connect } from 'react-redux'
import { setConnection } from '~/src/store/actions/common'
import { Text, View } from '~/src/themes/ThemeComponent'
import { Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import I18n from '~/src/I18n'
import { isConnectSelector } from '~/src/store/selectors/info'
import { syncOrderData } from "~/src/store/actions/backgroundSync"
import lodash from 'lodash'

class NoInternet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            manualClosed: false
        }
    }

    _handleChangeConnection = (isConnected) => {
        console.log('Change Connection', isConnected)
        const { setConnection } = this.props
        setConnection(isConnected)
    }

    _fetchConnectionStatus = () => {
        NetInfo.isConnected.fetch().then(isConnected => {
            console.log('isConnected', isConnected)
            const { setConnection } = this.props
            setConnection(isConnected)
        })
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isConnected && this.props.isConnected) {
            const { syncOrderData } = this.props
            syncOrderData()
        }
    }

    componentDidMount() {
        setInterval(() => {
            this._fetchConnectionStatus()
        }, 60000)
        this._fetchConnectionStatus()
        NetInfo.isConnected.addEventListener('connectionChange', this._handleChangeConnection)
    }

    _handlePressClose = () => {
        this.setState({ manualClosed: true })
    }

    render() {
        const { isConnected } = this.props
        if (isConnected || this.state.manualClosed) return <View />
        return (
            <View style={styles.container}>
                <View className='row-start ph24 pv18'>
                    <Image
                        source={require('~/src/image/no_internet_red.png')}
                        style={styles.errorIcon}
                    />
                    <Text className='flex textBlack' numberOfLines={2}>{I18n.t('no_internet_hint')}</Text>
                    <TouchableOpacity onPress={this._handlePressClose}>
                        <Image
                            source={require('~/src/image/close_white.png')}
                            style={styles.closeIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default connect(state => ({
    isConnected: isConnectSelector(state)
}), { setConnection, syncOrderData })(NoInternet)