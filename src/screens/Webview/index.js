import React from 'react';
import { Dimensions, WebView, BackHandler, Linking, ActivityIndicator, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Surface, Toolbar } from '~/src/themes/ThemeComponent'
import { DEFAULT_PUSH_ANIMATION, DEFAULT_POP_ANIMATION, DEVICE_WIDTH, DEVICE_HEIGHT, COLORS, SIZES } from '~/src/themes/common'

export default class Webview extends React.PureComponent {

    static get options() {
        if (Platform.OS == 'android') {
            return {
                animations: {
                    push: DEFAULT_PUSH_ANIMATION,
                    pop: DEFAULT_POP_ANIMATION
                }
            }
        }
        return {}
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            url: props.url
        }

    }

    _handleBack = () => {
        this.props.navigation.goBack()
        return true
    }

    _changeStep = (obj) => {
        this.setState(obj)
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBack)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBack)
    }

    _onLoadStart = () => {

    }

    _onLoadEnd = () => {

    }

    _onLoadError = () => {

    }

    render() {
        const { title } = this.props
        return (
            <Surface themeable={false} flex>
                <Toolbar
                    themeable={false}
                    iconStyle={{ color: COLORS.WHITE }}
                    title={title}
                    titleStyle={{ color: COLORS.WHITE }}
                    componentId={this.props.componentId}
                    onPressIconLeft={this._handleBack}
                    containerStyle={{ backgroundColor: COLORS.BLUE }}
                    iconLeft={'GB_close'}
                />
                <WebView
                    startInLoadingState={true}
                    onLoadStart={this._onLoadStart}
                    onLoadEnd={this._onLoadEnd}
                    onError={this._onLoadError}
                    source={{ uri: this.props.url }}
                    ref={ref => this.webview = ref}
                    scalesPageToFit={false}
                    style={{ backgroundColor: COLORS.WHITE, width: DEVICE_WIDTH, height: DEVICE_HEIGHT - SIZES.TOOLBAR_AND_STATUSBAR }}
                />
            </Surface>
        )
    }
}