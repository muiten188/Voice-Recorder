import React, { Component } from 'react'
import I18n from '~/src/I18n'
import {
    Container, Text, Toolbar,
    Button, BottomView, View,
    TextInputBase as TextInput, SingleRowInput
} from '~/src/themes/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import { syncProductAndMenu } from '~/src/store/actions/backgroundSync'
import LoadingModal from '~/src/components/LoadingModal'
import { connect } from 'react-redux'
import { createMerchantMenu } from '~/src/store/actions/menu'
import { chainParse, replacePatternString } from '~/src/utils'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import ToastUtils from '~/src/utils/ToastUtils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import lodash from 'lodash'

class AddMenu extends Component {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            menuName: '',
            errMenuName: '',
            id: '',
            ordinal: 1
        }
    }

    _handleSave = lodash.throttle(() => {
        const { merchantId, createMerchantMenu, syncProductAndMenu } = this.props
        if (!this.state.menuName || !this.state.menuName.trim()) return
        this.setState({ loading: true })
        createMerchantMenu(merchantId, this.state.id, this.state.menuName.trim(), this.state.ordinal, (err, data) => {
            console.log('createMerchantMenu err', err)
            console.log('createMerchantMenu data', data)
            this.setState({ loading: false })
            if (chainParse(data, ['httpHeaders', 'status']) == 200) {
                // Reload Menu
                syncProductAndMenu()
                ToastUtils.showSuccessToast(replacePatternString(I18n.t('add_menu_success'), `"${this.state.menuName.trim()}"`))
                const goBack = this.props.navigation.getParam('goBack', false)
                if (goBack) {
                    this.props.navigation.goBack()
                    const callback = this.props.navigation.getParam('callback')
                    callback && callback(chainParse(data, ['id']))
                } else {
                    this.props.navigation.replace('UpdateMenu', {
                        id: chainParse(data, ['id']),
                        menuName: chainParse(data, ['name'])
                    })
                }


                // this.props.navigation.goBack()
            } else if (data && data.code) {
                this.setState({ errMenuName: data.msg })
            }
        })
    }, 500)

    _handlePressRight = () => {
        this.props.navigation.goBack()
    }


    render() {
        return (
            <Container>
                <LoadingModal visible={this.state.loading} />
                <View className='flex background'>
                    <Toolbar
                        title={I18n.t('add_menu').toUpperCase()}
                        rightText={I18n.t('cancel')}
                        onPressRight={this._handlePressRight}
                    />
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View style={{ width: '100%', height: 37 }} />
                        <SingleRowInput
                            onChangeText={text => this.setState({ menuName: text })}
                            value={this.state.menuName}
                            maxLength={80}
                            autoFocus={true}
                            error={this.state.errMenuName}
                            label={I18n.t('menu_name')}
                            className='s16'
                            returnKeyType={'done'}
                        />

                    </KeyboardAwareScrollView>

                    <BottomView>
                        <Button
                            active
                            onPress={this._handleSave}
                            text={I18n.t('add')}
                            disabled={(!this.state.menuName || !this.state.menuName.trim)}
                            style={SURFACE_STYLES.flex}
                        />
                    </BottomView>
                </View>
            </Container>
        )
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
}), {
        createMerchantMenu, syncProductAndMenu
    })(AddMenu)