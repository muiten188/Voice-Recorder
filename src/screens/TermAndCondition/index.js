import React, { Component } from 'react'
import I18n from '~/src/I18n'
import { StatusBar, Platform, ActivityIndicator, BackHandler } from 'react-native'
import { Container, Toolbar, View, Text } from '~/src/themesnew/ThemeComponent'
import { COLORS } from '~/src/themesnew/common';
import { WebView } from 'react-native-webview'

export default class TermAndCondition extends Component {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
        }
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this._handleBack)
        );
    }

    componentDidMount() {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this._handleBack)
        );
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    _handleBack = () => {
        if (this.canGoBack) {
            this.webView && this.webView.goBack()
            return true
        }
        this.props.navigation.goBack()
        return true
    }

    render() {
        return (
            <Container>
                <Toolbar
                    title={I18n.t('term_and_condition')}
                    onPressLeft={this._handleBack}
                />
                <View className='flex background'>
                    <WebView
                        source={{ uri: 'https://mshop.io/terms.html' }}
                        startInLoadingState={true}
                        renderLoading={() => <View className='row-center' style={{ position: 'absolute', top: 20, width: '100%' }}>
                            <ActivityIndicator size={'large'} color={COLORS.CERULEAN} />
                        </View>}
                        onNavigationStateChange={navState => {
                            this.canGoBack = navState.canGoBack;
                        }}
                        ref={ref => this.webView = ref}
                    />
                </View>
            </Container>
        )
    }
}