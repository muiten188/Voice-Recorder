import React, { Component } from 'react'
import { View, ActivityIndicator, Platform } from 'react-native'
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { connect } from 'react-redux'
import { StackActions, NavigationActions } from 'react-navigation'
import { userInfoSelector } from '~/src/store/selectors/auth'


class AuthLoading extends Component {

    constructor(props) {
        super(props)
        this._handleRedirect()
    }

    componentDidMount = async () => {
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