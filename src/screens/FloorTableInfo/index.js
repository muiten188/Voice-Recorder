import React, { Component } from "react";
import { connect } from "react-redux";
import I18n from "~/src/I18n";
import { formatMoney, chainParse, revertFormatMoney, replacePatternString } from "~/src/utils";
import { merchantIdSelector } from "~/src/store/selectors/merchant";
import LoadingModal from "~/src/components/LoadingModal";
import { FORM_MODE } from "~/src/constants";
import {
    Container, View, Toolbar, Button, BottomView,
    Text, TextInputBase as TextInput, SingleRowInput,
    PopupConfirm
} from '~/src/themes/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { createFloor, syncFloorTableFromNetwork, removeFloor } from '~/src/store/actions/table'
import ToastUtils from '~/src/utils/ToastUtils'
import lodash from 'lodash'
import { getOrderWaitByFloor } from '~/src/store/actions/order'

class FloorTableInfo extends Component {

    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props);
        const mode = props.navigation.getParam("mode") || FORM_MODE.EDIT
        this.state = {
            mode,
            loading: false,
            id: props.navigation.getParam('id', ''),
            floorName: '' + props.navigation.getParam('floorName', ''),
            numOfTable: '' + props.navigation.getParam('numOfTable', ''),
            errFloorName: '',
            errNumberOfTable: '',
            changed: false,
            popupDeleteContent: '',
        }
    }

    componentDidMount() {

    }

    _deleteFloorTable = () => {
        console.log('_deleteFloorTable', this.selectedFloorId)
        const { removeFloor, syncFloorTableFromNetwork } = this.props
        this.setState({ loading: true })
        removeFloor(this.state.id, (err, data) => {
            console.log('removeFloor err', err)
            console.log('removeFloor data', data)
            this.setState({ loading: false })
            if (chainParse(data, ['httpHeaders', 'status']) == 200) {
                // Reload FloorTable
                ToastUtils.showSuccessToast(replacePatternString(I18n.t('delete_floor_success'), `"${this.state.floorName}"`))
                syncFloorTableFromNetwork()
                this.props.navigation.goBack()
            }
        })
    }

    _handlePressRight = () => {
        if (this.state.mode == FORM_MODE.ADD) {
            this.props.navigation.goBack()
        } else {
            const { getOrderWaitByFloor } = this.props
            this.setState({ loading: true })
            getOrderWaitByFloor(this.state.id, (err, data) => {
                this.setState({ loading: false })
                console.log('getOrderWaitByFloor err', err)
                console.log('getOrderWaitByFloor data', data)
                const numberWaitOrder = +chainParse(data, ['updated', 'result'])
                const hintFloorTableBusy = numberWaitOrder ? replacePatternString(I18n.t('floor_table_busy_hint'), (numberWaitOrder + '')) + ". " : ''
                const warnMessage = replacePatternString(I18n.t('warning_delete_floor_table'), `"${this.state.floorName}"`)
                this.setState({
                    popupDeleteContent: hintFloorTableBusy + warnMessage
                }, () => {
                    this.popupConfirmDelete && this.popupConfirmDelete.open()
                })
            })
        }

    }

    _handleSave = lodash.throttle(() => {
        console.log('_handleSave', this.state)
        const { createFloor, syncFloorTableFromNetwork } = this.props
        const numOfTable = +revertFormatMoney(this.state.numOfTable)
        const mode = this.props.navigation.getParam("mode") || FORM_MODE.EDIT
        const originNumberOfTable = +this.props.navigation.getParam('numOfTable', '')
        const isChangeTable = (numOfTable != originNumberOfTable)
        this.setState({ loading: true })
        createFloor(this.state.id, this.state.floorName.trim(),
            numOfTable, isChangeTable, 1, (err, data) => {
                console.log('createFloor err', err)
                console.log('createFloor data', data)
                this.setState({ loading: false })
                if (chainParse(data, ['httpHeaders', 'status']) == 200) {
                    // Reload Product
                    const toastMessage = mode == FORM_MODE.EDIT ?
                        I18n.t('update_floor_success') :
                        replacePatternString(I18n.t('create_floor_success'), `"${this.state.floorName.trim()} - ${numOfTable} ${I18n.t('table')}"`)
                    ToastUtils.showSuccessToast(toastMessage)
                    syncFloorTableFromNetwork()
                    this.props.navigation.goBack()
                } else if (data && data.code) {
                    if (data.code == 6001) {
                        this.setState({ errFloorName: I18n.t('err_floor_name_exists') })
                    } else {
                        this.setState({ errFloorName: data.msg })
                    }

                }
            })
    }, 500)

    render() {
        const numOfTable = +revertFormatMoney(this.state.numOfTable)
        const disabledButton = !(
            this.state.floorName &&
            this.state.floorName.trim() &&
            numOfTable && numOfTable > 0 &&
            this.state.changed
        )
        const toolbarTitle = this.state.mode == FORM_MODE.ADD ? I18n.t('create_floor_table') : I18n.t('update_floor_table')
        const buttonTitle = this.state.mode == FORM_MODE.ADD ? I18n.t('done') : I18n.t('save_change')
        const rightText = this.state.mode == FORM_MODE.ADD ? I18n.t('cancel') : I18n.t('delete')
        return (
            <Container>
                <View className='flex background'>
                    <LoadingModal visible={this.state.loading} />
                    <PopupConfirm
                        ref={ref => this.popupConfirmDelete = ref}
                        content={this.state.popupDeleteContent}
                        onPressYes={this._deleteFloorTable}
                        onPressNo={() => { }}
                    />
                    <Toolbar
                        title={toolbarTitle}
                        rightText={rightText}
                        onPressRight={this._handlePressRight}
                    />
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View>
                            <View style={{ width: '100%', height: 37 }} />


                            <SingleRowInput
                                onChangeText={text => this.setState({ floorName: text, changed: true })}
                                value={this.state.floorName}
                                maxLength={80}
                                autoFocus={false}
                                error={this.state.errFloorName}
                                label={I18n.t('floor_name')}
                                className='s16'
                                returnKeyType={'next'}
                                onSubmitEditing={() => {
                                    this.numOfTableInput && this.numOfTableInput.focus()
                                }}
                            />

                            <View style={SURFACE_STYLES.space12} />

                            <SingleRowInput
                                onChangeText={text => this.setState({ numOfTable: formatMoney(text), errNumberOfTable: '', changed: true })}
                                value={formatMoney(this.state.numOfTable)}
                                maxLength={2}
                                keyboardType={'number-pad'}
                                error={this.state.errNumberOfTable}
                                label={I18n.t('num_table')}
                                className='s16'
                                returnKeyType={'done'}
                                ref={ref => this.numOfTableInput = ref}
                            />
                        </View>
                    </KeyboardAwareScrollView>

                    <BottomView>
                        <Button
                            onPress={this._handleSave}
                            text={buttonTitle}
                            disabled={disabledButton}
                            style={SURFACE_STYLES.flex}
                        />
                    </BottomView>
                </View>

            </Container>
        );
    }
}

export default connect(
    state => ({
        merchantId: merchantIdSelector(state),
    }),
    {
        createFloor, syncFloorTableFromNetwork, removeFloor, getOrderWaitByFloor
    }
)(FloorTableInfo);
