import React, { useEffect, useRef } from 'react'
import { TouchableOpacity, ScrollView } from 'react-native'
import { chainParse } from '~/src/utils'
import I18n from '~/src/I18n'
import Image from 'react-native-fast-image'
import { Text, Caption, View, Button } from '~/src/themes/ThemeComponent'
import { DEVICE_WIDTH, SURFACE_STYLES, COLORS } from '~/src/themes/common'
import ScrollTabHeader from '~/src/components/ScrollTabHeader'
const NUMBER_TABLE_EACH_ROW = 4
const TABLE_WIDTH = (DEVICE_WIDTH - 24 * 5) / NUMBER_TABLE_EACH_ROW
import lodash from 'lodash'


export default FloorTableCollapsibleSelector = (props) => {
    const { floorTable, floorIndex, collapsed, onChangeFloor, onChangeCollapse, onSelectTable, selectedTable, editable = true, onPressAddFloorTable } = props

    // _getDisplayTableName = lodash.memoize((selectedTable, floorTable) => {
    //     if (!selectedTable) return ''
    //     let currentTable = ''
    //     const currentFloor = floorTable.find(item => (
    //         item && item.listTable && (currentTable = item.listTable.find(it => it.id == selectedTable))
    //     ))
    //     if (!currentFloor || !currentTable) return ''
    //     const currentFloorName = chainParse(currentFloor, ['floor', 'floorName'])
    //     return `${currentFloorName}:${currentTable.tableName}`

    // })

    _getDisplayTableArr = lodash.memoize((selectedTableArr, floorTable) => {
        if (!selectedTableArr || selectedTableArr.length == 0) return []
        const tableArr = []
        floorTable.forEach(floor => {
            floor.listTable.forEach(table => {
                if (selectedTableArr.find(it => it == table.id)) {
                    tableArr.push({
                        id: table.id,
                        tableDisplayName: `${chainParse(floor, ['floor', 'floorName'])}-${table.tableName}`
                    })
                }
            })
        })
        return tableArr
    })

    _handlePressHeader = () => {
        onChangeCollapse && onChangeCollapse()
    }

    _onChangeFloor = (floorIndex) => {
        onChangeFloor && onChangeFloor(floorIndex)
    }

    _onChangeFloorTab = ({ i, ref }) => {
        onChangeFloor && onChangeFloor(i)
    }

    _onChooseTable = (table) => {
        onSelectTable && onSelectTable(table)
        // onChangeCollapse && onChangeCollapse()
    }

    _onClear = (table) => {
        onSelectTable && onSelectTable(table)
    }

    _handlePressAddFloorTable = () => {
        console.log('_handlePressAddFloorTable')
        onPressAddFloorTable && onPressAddFloorTable()
    }

    const selectedTableArr = selectedTable ? selectedTable.split(',') : []
    const displayTableArr = _getDisplayTableArr(selectedTableArr, floorTable)
    const tabData = floorTable.map((item, index) => ({
        page: index,
        label: chainParse(item, ['floor', 'floorName'])
    }))
    const floorData = floorTable[floorIndex]
    const floorId = chainParse(floorData, ['floor', 'id'])
    const floorName = chainParse(floorData, ['floor', 'floorName'])
    const listTable = chainParse(floorData, ['listTable']) || []
    const numRow = Math.ceil(listTable.length / NUMBER_TABLE_EACH_ROW)



    if (!editable) {
        return (
            <View className='ph24 pv14 row-start white border-bottom2'>
                <View className='row-start flex'>
                    <Text style={{ lineHeight: 20, marginRight: 8 }}>{I18n.t('choose_table')}</Text>
                    {(!displayTableArr || displayTableArr.length == 0) ?
                        <View />
                        :
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            <Text className='action bold'>{displayTableArr.map(item => item.tableDisplayName).join(', ')}</Text>
                        </ScrollView>
                    }
                </View>
            </View>
        )
    }

    return (
        <View>
            <View>
                <View className='ph24 pv14 row-start white border-bottom2'>
                    <View className='row-start flex'>
                        <TouchableOpacity onPress={_handlePressHeader}>
                            <Text style={{ lineHeight: 20, marginRight: 8 }}>{I18n.t('choose_table')}</Text>
                        </TouchableOpacity>
                        {(!displayTableArr || displayTableArr.length == 0 || !collapsed) ?

                            <View />
                            :
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                <Text className='action bold'>{displayTableArr.map(item => item.tableDisplayName).join(', ')}</Text>
                            </ScrollView>
                        }

                    </View>
                    <TouchableOpacity onPress={_handlePressHeader} hitSlop={{ top: 16, left: 16, right: 16, bottom: 16 }}>
                        <Image
                            source={require('~/src/image/chevron_down.png')}
                            style={{ marginLeft: 6, width: 10, height: 6, backgroundColor: COLORS.WHITE, transform: [{ rotate: !collapsed ? '180deg' : '-90deg' }] }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {!collapsed && ((!listTable || listTable.length == 0) ?
                <View className='column-center pv24 white'>
                    <Text className='bold gray s12'>{I18n.t('no_setup_floor_table')}</Text>
                    <View className='space16' />
                    <Button
                        text={I18n.t('add_floor_table')}
                        onPress={_handlePressAddFloorTable}
                        style={{ borderRadius: 6 }}
                    />
                </View>
                :
                <View>
                    <ScrollTabHeader data={tabData}
                        onChangeTab={_onChangeFloor}
                        page={floorIndex}
                    />
                    <View
                        className='row-all-start white ph24 pv16'
                        style={{ flexWrap: 'wrap' }}
                        tabLabel={floorName} key={floorId}>
                        {listTable.map((item, index) => {
                            const isTableSelected = selectedTableArr.find(tableItem => tableItem == item.id)
                            const isLastColumn = (index + 1) % NUMBER_TABLE_EACH_ROW == 0
                            const isLastRow = Math.ceil(index / NUMBER_TABLE_EACH_ROW) == numRow
                            const backgroundColor = isTableSelected ? COLORS.WHITE : COLORS.PALE_LILAC
                            const textColor = item.busy ? COLORS.TEXT_GRAY : COLORS.BLACK

                            if (isTableSelected) {
                                return (
                                    <TouchableOpacity key={item.id} onPress={() => _onChooseTable(item)}>
                                        <View class='column-center'
                                            style={{
                                                marginRight: isLastColumn ? 0 : 24,
                                                marginBottom: isLastRow ? 0 : 16,
                                            }}
                                        >
                                            <View style={{
                                                width: TABLE_WIDTH,
                                                height: 48,
                                                backgroundColor,
                                                borderRadius: 6,
                                                marginBottom: 6,
                                                borderStyle: "solid",
                                                borderWidth: 4,
                                                borderColor: COLORS.CERULEAN
                                            }} />
                                            <Text style={{ color: textColor, fontSize: 12, textAlign: 'center' }}>{item.tableName}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                            return (
                                <TouchableOpacity key={item.id} onPress={() => _onChooseTable(item)}>
                                    <View class='column-center'
                                        style={{
                                            marginRight: isLastColumn ? 0 : 24,
                                            marginBottom: isLastRow ? 0 : 16,
                                        }}
                                    >
                                        <View style={{ width: TABLE_WIDTH, height: 48, backgroundColor, borderRadius: 6, marginBottom: 6 }} />
                                        <Text style={{ color: textColor, fontSize: 12, textAlign: 'center' }}>{item.tableName}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>)}
        </View>
    )
}