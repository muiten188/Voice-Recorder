import React, { PureComponent } from 'react'
import { FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { chainParse, replacePatternString } from '~/src/utils'
import I18n from '~/src/I18n'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import Image from 'react-native-fast-image'
import { View, Toolbar, PopupConfirm, Text, Caption } from '~/src/themes/ThemeComponent'
import { SURFACE_STYLES } from '~/src/themes/common'
import { floorTableSelector } from '~/src/store/selectors/table'
import LoadingModal from '~/src/components/LoadingModal'
import { removeFloor, syncFloorTableFromNetwork } from '~/src/store/actions/table'
import { getOrderWaitByFloor } from '~/src/store/actions/order'
import ToastUtils from '~/src/utils/ToastUtils'

class FloorTableDelete extends PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            popupDeleteContent: '',
            selectedFloorId: '',
            selectedFloorName: ''
        }
    }


    _handlePressDeleteFloor = (item) => {
        console.log('_handlePressDeleteFloor', item)
        const floorId = chainParse(item, ['floor', 'id'])
        const floorName = chainParse(item, ['floor', 'floorName'])
        this.selectedFloorId = floorId
        this.selectedFloorName = floorName
        if (!this.selectedFloorId) return
        const { getOrderWaitByFloor } = this.props
        this.setState({ loading: true })
        getOrderWaitByFloor(floorId, (err, data) => {
            this.setState({ loading: false })
            console.log('getOrderWaitByFloor err', err)
            console.log('getOrderWaitByFloor data', data)
            const numberWaitOrder = +chainParse(data, ['updated', 'result'])
            const hintFloorTableBusy = numberWaitOrder ? replacePatternString(I18n.t('floor_table_busy_hint'), (numberWaitOrder + '')) + ". " : ''
            const warnMessage = replacePatternString(I18n.t('warning_delete_floor_table'), `"${floorName}"`)
            this.setState({
                popupDeleteContent: hintFloorTableBusy + warnMessage
            }, () => {
                this.popupConfirmDelete && this.popupConfirmDelete.open()
            })
        })

    }


    _deleteFloorTable = () => {
        console.log('_deleteFloorTable', this.selectedFloorId)
        const { removeFloor, syncFloorTableFromNetwork } = this.props
        this.setState({ loading: true })
        removeFloor(this.selectedFloorId, (err, data) => {
            console.log('removeFloor err', err)
            console.log('removeFloor data', data)
            this.setState({ loading: false })
            this.selectedFloorId = ''
            if (chainParse(data, ['httpHeaders', 'status']) == 200) {
                // Reload FloorTable
                ToastUtils.showSuccessToast(replacePatternString(I18n.t('delete_floor_success'), `"${this.selectedFloorName}"`))
                syncFloorTableFromNetwork()
                this.props.navigation.goBack()
            }
        })
    }

    _renderFloorItem = ({ item, index }) => {
        const floorName = chainParse(item, ['floor', 'floorName'])
        return (
            <View className='row-start white ph24 pv14 mb8'>
                <View className='row-start flex'>
                    <TouchableOpacity onPress={() => this._handlePressDeleteFloor(item)}>
                        <Image
                            source={require('~/src/image/delete_red.png')}
                            style={{ width: 24, height: 24, marginRight: 24 }}
                        />
                    </TouchableOpacity>
                    <View className='row-start'>
                        <Text style={{ marginRight: 10, lineHeight: 20 }}>{floorName}</Text>
                    </View>
                </View>
            </View>
        )
    }


    render() {
        const { floorTable } = this.props
        return (
            <SafeAreaView style={SURFACE_STYLES.flex}>
                <View className='flex background'>
                    <LoadingModal visible={this.state.loading} />
                    <PopupConfirm
                        ref={ref => this.popupConfirmDelete = ref}
                        content={this.state.popupDeleteContent}
                        onPressYes={this._deleteFloorTable}
                        onPressNo={() => this.selectedFloorId = ''}
                    />
                    <Toolbar
                        title={I18n.t('delete_floor_table')}
                    />
                    {/* <View className='ph24 pt16 pb8'>
                        <Caption>{I18n.t('delete_floor_table')}</Caption>
                    </View> */}
                    <View className='space12' />
                    <FlatList
                        data={floorTable}
                        renderItem={this._renderFloorItem}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => chainParse(item, ['floor', 'id'])}
                        ListFooterComponent={<View className='space50' />}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
    floorTable: floorTableSelector(state)
}), { removeFloor, syncFloorTableFromNetwork, getOrderWaitByFloor })(FloorTableDelete)