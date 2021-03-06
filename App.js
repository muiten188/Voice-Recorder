import React, { Component } from 'react'

import { ActivityIndicator, StatusBar, Platform, View } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '~/src/store/configStore'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import NavigationUtils from '~/src/utils/NavigationUtils'
import NoInternet from '~/src/components/NoInternet'
import AppContainer from '~/routes'
import SuccessToast from '~/src/components/SuccessToast'
import ErrorToast from '~/src/components/ErrorToast'
import NotAvailableWhenOfflineToast from '~/src/components/NotAvailableWhenOfflineToast'
import ToastUtils from '~/src/utils/ToastUtils'
import ForceUpdatePopup from '~/src/components/ForceUpdatePopup'


const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: COLORS.BLUE,
        accent: COLORS.BLUE,
        background: COLORS.WHITE
    }
}

export default class App extends Component {

    _renderLoading = () => {
        return (
            <View style={[SURFACE_STYLES.flex, { paddingTop: 50 }]}>
                <ActivityIndicator size={Platform.OS == 'android' ? 60 : 'large'} color={COLORS.GREEN} />
            </View>
        )
    }
    render() {
        console.log('App Store', store.getState())
        return (
            <PaperProvider theme={theme}>
                <Provider store={store}>
                    <PersistGate loading={this._renderLoading()} persistor={persistor}>
                        <StatusBar
                            backgroundColor={'transparent'}
                            translucent={true}
                            barStyle={'light-content'}
                        />
                        <NoInternet />
                        <AppContainer
                            ref={navigationRef => NavigationUtils.setTopLevelNavigator(navigationRef)}
                        />
                        <SuccessToast
                            ref={successToastRef => ToastUtils.setSuccessToastRef(successToastRef)}
                        />
                        <ErrorToast
                            ref={errorToastRef => ToastUtils.setErrorToastRef(errorToastRef)}
                        />
                        <NotAvailableWhenOfflineToast
                            ref={notAvailableWhenOffline => ToastUtils.setNotAvailableWhenOfflineToastRef(notAvailableWhenOffline)}
                        />
                        <ForceUpdatePopup
                            ref={forceUpdatePopup => ToastUtils.setForceUpdateRef(forceUpdatePopup)}
                        />
                    </PersistGate>
                </Provider>
            </PaperProvider>
        )
    }
}