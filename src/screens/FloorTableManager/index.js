import React, { PureComponent } from 'react'
import { FlatList, TouchableOpacity, StatusBar, Platform } from 'react-native'
import { connect } from 'react-redux'
import { chainParse, getShortenString } from '~/src/utils'
import I18n from '~/src/I18n'
import { getProductList, syncProductListFromDBToRedux, syncProductFromNetwork } from '~/src/store/actions/product'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import Image from 'react-native-fast-image'
import { FORM_MODE } from '~/src/constants'
import { checkAndSyncMasterData } from '~/src/store/actions/backgroundSync'
import { Container, View, Toolbar, BottomView, Button, Text, TextBold, Caption, ActionText } from '~/src/themes/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import { floorTableSelector } from '~/src/store/selectors/table'
import { generateHighlightText, getWidth } from '~/src/utils'
import { textStyles } from '~/src/themes/Text'

class FloorTableManager extends PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            activeSections: [0]
        }
    }

    _handlePressDetele = () => {
        this.props.navigation.navigate('FloorTableDelete')
    }


    _handlePressAddMenu = () => {
        this.props.navigation.navigate('AddMenu')
    }

    _handlePressAddFloorTable = () => {
        this.props.navigation.navigate('FloorTableInfo', {
            mode: FORM_MODE.ADD
        })
    }

    _handlePressUpdateFloorTable = (item) => {
        console.log('_handlePressUpdateFloorTable', item)
        this.props.navigation.navigate('FloorTableInfo', {
            mode: FORM_MODE.EDIT,
            id: chainParse(item, ['floor', 'id']),
            floorName: chainParse(item, ['floor', 'floorName']),
            numOfTable: item.listTable && item.listTable.length > 0 ? item.listTable.length : 0
        })
    }

    _renderFloorItem = ({ item, index }) => {
        const numTable = item && item.listTable ? item.listTable.length : 0
        const floorName = chainParse(item, ['floor', 'floorName'])
        return (
            <View className='row-start white ph24 pv14 mb8'>
                <View className='row-start border-right' style={{ paddingRight: 10 }}>
                    <Text className='lh20' style={{ marginRight: 10 }}>{getShortenString(floorName, 15)}</Text>
                    <Text className='caption s13'>- {numTable} {I18n.t('table')}</Text>

                </View>
                <TouchableOpacity onPress={() => this._handlePressUpdateFloorTable(item)}>
                    <View className='row-start flex'>
                        <Text className='action' style={{ marginLeft: 16 }}>{I18n.t('update')}</Text>
                    </View>

                </TouchableOpacity>
            </View>
        )
    }

    _renderEmptyState = () => {
        return (
            <View className='white flex'>
                <View className='space12 background' />
                <View className='row-center' style={{ marginTop: getWidth(80) }}>
                    <Image source={require('~/src/image/empty_location.png')}
                        style={{ width: getWidth(160), height: getWidth(102) }}
                    />
                </View>
                <View className='column-center' style={{ marginTop: getWidth(25), marginHorizontal: getWidth(42) }}>
                    <Text className='center'>
                        <Text className='s14 gray bold'>{I18n.t('no_setup_floor_table')}</Text>
                        {"\n\n"}
                        {generateHighlightText(
                            I18n.t('add_floor_table_hint'),
                            { ...textStyles.gray, ...textStyles.s14 },
                            { ...textStyles.cerulean, ...textStyles.s14, ...textStyles.bold }
                        )}
                    </Text>
                </View>
                <View className='column-center' style={{ marginTop: getWidth(40) }}>
                    <Image source={require('~/src/image/guide_arrow.png')}
                        style={{ width: getWidth(27), height: getWidth(77.4), position: 'absolute', right: getWidth(101), top: 0 }}
                    />
                </View>

            </View>
        )

    }

    _handlePressRightText = () => {
        this.props.navigation.navigate('FloorTableSort')
    }

    componentDidMount() {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }
    }

    render() {
        const { floorTable } = this.props
        return (
            <Container>
                <View className='flex background'>
                    <Toolbar
                        title={I18n.t('floor_table_manager').toUpperCase()}
                        rightText={I18n.t('sort')}
                        onPressRight={this._handlePressRightText}
                    />
                    <View className='ph24 pv12 row-start white'>
                        <Caption style={{ fontSize: 14, lineHeight: 20, flex: 1 }}>{I18n.t('floor_list')}</Caption>
                        <TouchableOpacity onPress={this._handlePressDetele}>
                            <Image source={require('~/src/image/delete2.png')} style={{ width: 24, height: 24, marginLeft: 33 }} />
                        </TouchableOpacity>
                    </View>
                    {(!floorTable || floorTable.length == 0) ?
                        this._renderEmptyState()
                        :
                        <FlatList
                            data={floorTable}
                            renderItem={this._renderFloorItem}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => chainParse(item, ['floor', 'id'])}
                            ListHeaderComponent={<View className='space12' />}
                            ListFooterComponent={<View className='space50' />}
                        />
                    }
                    <BottomView>
                        <Button
                            onPress={this._handlePressAddFloorTable}
                            style={SURFACE_STYLES.flex}
                            text={I18n.t('create_floor_table')}
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
}), { getProductList, syncProductListFromDBToRedux, syncProductFromNetwork, checkAndSyncMasterData })(FloorTableManager)