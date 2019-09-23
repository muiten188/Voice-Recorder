import React, { Component } from 'react'
import { View, ActivityIndicator, Platform } from 'react-native'
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { connect } from 'react-redux'
import { StackActions, NavigationActions } from 'react-navigation'
import { userInfoSelector } from '~/src/store/selectors/auth'
import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

class AuthLoading extends Component {

    constructor(props) {
        super(props)
        this._handleRedirect()
    }

    componentDidMount = async () => {

        PushNotification.configure({
            onRegister: function(token) {
              console.log("TOKEN:", token);
            },
            onNotification: function(notification) {
              console.log("NOTIFICATION:", notification);
              // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
              notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            permissions: {
              alert: true,
              badge: true,
              sound: true
            },
            popInitialNotification: true,
            requestPermissions: true
          })
    }

    componentWillUnmount() {
    }


    _handleRedirect = () => {
        console.log('Token', this.props.accessToken)
        const { userInfo } = this.props
        console.log('userInfo', userInfo)
        let nextScreen = 'Login'
        if (userInfo && userInfo.id){
            nextScreen = 'Drawer'
        }
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: nextScreen })],
            key: undefined
        });
        this.props.navigation.dispatch(resetAction)

    }

    render() {
        return (
            <View style={[SURFACE_STYLES.columnCenter, SURFACE_STYLES.flex]}>
                <ActivityIndicator size={Platform.OS == 'android' ? 60 : 'large'} color={COLORS.GREEN} />
            </View>
        )
    }
}

export default connect((state) => ({
    userInfo: userInfoSelector(state)
}))(AuthLoading)