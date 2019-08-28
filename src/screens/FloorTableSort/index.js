import React, { PureComponent } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { chainParse } from '~/src/utils'
import I18n from '~/src/I18n'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import Image from 'react-native-fast-image'
import { TextInputBase as TextInput, Container, View, Toolbar, BottomView, Button, Text } from '~/src/themes/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import { floorTableSelector } from '~/src/store/selectors/table'
import { updateOrdinalFloor, syncFloorTableFromNetwork } from '~/src/store/actions/table'
import LoadingModal from '~/src/components/LoadingModal'
import ToastUtils from '~/src/utils/ToastUtils'

class FloorTableSort extends PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        const initInputValue = {}
        props.floorTable.forEach((item, index) => {
            initInputValue[chainParse(item, ['floor', 'id'])] = index + 1
        })
        this.state = {
            loading: false,
            floorTable: props.floorTable,
            inputValue: initInputValue
        }
    }

    _handlePressSave = () => {
        const { updateOrdinalFloor, syncFloorTableFromNetwork } = this.props
        const items = this.state.floorTable.map((item, index) => ({
            ordinal: index + 1,
            floorId: chainParse(item, ['floor', 'id'])
        }))
        this.setState({ loading: true })
        updateOrdinalFloor(items, (err, data) => {
            console.log('updateOrdinalFloor err', err)
            console.log('updateOrdinalFloor data', data)
            this.setState({ loading: false })
            if (chainParse(data, ['httpHeaders', 'status']) == 200) {
                // Reload FloorTable
                ToastUtils.showSuccessToast(I18n.t('update_floor_order_success'))
                syncFloorTableFromNetwork()
                this.props.navigation.goBack()
            }
        })
    }

    _handlePressUp = (item, index) => {
        if (index == 0) return
        this._swap(index, index - 1, () => {
            this._recaculateInputValue()
        })
    }

    _handlePressDown = (item, index) => {
        const { floorTable } = this.state
        if (index == floorTable.length - 1) return
        this._swap(index, index + 1, () => {
            this._recaculateInputValue()
        })
    }

    _swap = (index, newIndex, callback) => {
        const newFloorTable = [...this.state.floorTable]
        const currentItem = newFloorTable.splice(index, 1)[0]
        newFloorTable.splice(newIndex, 0, currentItem)
        this.setState({ floorTable: newFloorTable }, () => {
            callback && callback()
        })

    }

    _handleChangePositionText = (floorId, text) => {
        const newInputValue = { ...this.state.inputValue }
        newInputValue[floorId] = text
        this.setState({ inputValue: newInputValue })
    }

    _recaculateInputValue = () => {
        const newInputValue = {}
        this.state.floorTable.forEach((item, index) => {
            newInputValue[chainParse(item, ['floor', 'id'])] = index + 1
        })
        this.setState({ inputValue: newInputValue })
    }

    _handleBlurPositionText = (floorId, currentIndex) => {
        let newIndex = +this.state.inputValue[floorId]
        if (newIndex > this.state.floorTable.length - 1) {
            newIndex = this.state.floorTable.length - 1
        } else if (newIndex < 0) {
            newIndex = 0
        }

        this._swap(currentIndex, newIndex, () => {
            this._recaculateInputValue()
        })
    }

    _renderFloorItem = ({ item, index }) => {
        const floorName = chainParse(item, ['floor', 'floorName'])
        const floorId = chainParse(item, ['floor', 'id'])
        return (
            <View className='row-start white ph24 pv8 mb8'>
                <View className='flex row-start'>
                    <View className='column-center' style={{ marginRight: 22 }}>
                        <TouchableOpacity onPress={() => this._handlePressUp(item, index)}>
                            <View className='row-center' style={{
                                width: 52,
                                height: 24,
                                borderRadius: 6,
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: 'rgba(0, 0, 0, 0.25)',

                            }}>
                                <Image source={require('~/src/image/chevron_up_large.png')} style={{ width: 13.9, height: 6.9, }} />
                            </View>
                        </TouchableOpacity>
                        <View className='space8' />
                        <TouchableOpacity onPress={() => this._handlePressDown(item, index)}>
                            <View className='row-center' style={{
                                width: 52,
                                height: 24,
                                borderRadius: 6,
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: 'rgba(0, 0, 0, 0.25)'
                            }}>
                                <Image source={require('~/src/image/chevron_down_large.png')} style={{ width: 13.9, height: 6.9, }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View className='column-align-start' style={{ marginRight: 10 }}>
                        <Text className='caption' style={{ marginBottom: 4 }}>{I18n.t('position')}</Text>
                        <TextInput
                            style={{ paddingTop: 4, paddingBottom: 4, fontWeight: 'bold', fontSize: 17, color: COLORS.TEXT_GRAY, width: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.25)' }}
                            value={'' + this.state.inputValue[floorId]}
                            onChangeText={(text) => this._handleChangePositionText(floorId, text)}
                            onBlur={() => this._handleBlurPositionText(floorId, index)}
                            underlineColorAndroid='transparent'
                            keyboardType='number-pad'
                        />
                    </View>
                    <Text className='lh20'>{floorName}</Text>
                </View>
            </View>
        )
    }

    _handlePressRightText = () => {
        this.props.navigation.goBack()
    }


    render() {
        const { floorTable } = this.state
        console.log('floorTable', floorTable)
        return (
            <Container>
                <View className='flex background'>
                    <LoadingModal visible={this.state.loading} />
                    <Toolbar
                        title={I18n.t('floor_table_sort')}
                        rightText={I18n.t('cancel')}
                        onPressRight={this._handlePressRightText}
                    />
                    <View className='ph24 pt16 pb8 row-start background'>
                        <Text className='caption'>{I18n.t('change_sort_order')}</Text>
                    </View>
                    <FlatList
                        data={floorTable}
                        renderItem={this._renderFloorItem}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => chainParse(item, ['floor', 'id'])}
                        ListFooterComponent={<View className='space50' />}
                    />
                    <BottomView>
                        <Button
                            onPress={this._handlePressSave}
                            style={SURFACE_STYLES.flex}
                            text={I18n.t('save_change')}
                        />
                    </BottomView>
                </View>
            </Container>
        )
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
    floorTable: floorTableSelector(state)
}), {
        updateOrdinalFloor, syncFloorTableFromNetwork
    })(FloorTableSort)