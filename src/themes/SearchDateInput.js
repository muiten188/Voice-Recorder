import React, { useState } from "react";
import { COLORS } from "~/src/themes/common";
import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import View from './View'
import Text from './Text'
import TextInput from './TextInputBase'
import DateRangePicker from '~/src/components/DateRangePicker'

export default SearchDateInput = (props) => {
    const {
        keyword, onChangeKeyword, onClearKeyword, onPressDelete, showSearch, toggleSearch, onBackKeyword,
        startDate, endDate, onChangeStartDate, onChangeEndDate, onClearDate, showDelete,
        placeholder = '', isDeleting
    } = props

    _switchToSearch = () => {
        toggleSearch && toggleSearch(true)
    }

    _handleBackKeyword = () => {
        toggleSearch && toggleSearch(false)
        onBackKeyword && onBackKeyword()
    }

    return (
        <View className='row-start white ph24 pv8'>
            <View className='row-start'>
                {showSearch ?
                    <View className='row-start'>
                        <TouchableOpacity onPress={_handleBackKeyword}>
                            <Image source={require('~/src/image/arrow_longleft.png')} style={styles.backIcon} />
                        </TouchableOpacity>
                        <View className='row-start ph8 flex' style={styles.textInputContainer}>
                            <Image source={require('~/src/image/search.png')} style={styles.searchIcon} />
                            <TextInput
                                style={styles.textInput}
                                value={keyword}
                                onChangeText={onChangeKeyword}
                                underlineColorAndroid='transparent'
                                placeholder={placeholder}
                                autoFocus={true}
                            />
                            {!!keyword &&
                                <TouchableOpacity onPress={onClearKeyword}>
                                    <Image source={require('~/src/image/imgClear.png')} style={styles.clearIcon} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    :
                    <View className='row-start'>
                        <View className='row-start flex' style={{ height: 32 }}>
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                onChangeStartDate={onChangeStartDate}
                                onChangeEndDate={onChangeEndDate}
                                visible={true}
                                visibleButtonClear={!!startDate || !!endDate}
                                style={{ paddingHorizontal: 0, paddingVertical: 0 }}
                                onPressClose={onClearDate}
                            />

                        </View>
                        <TouchableOpacity onPress={_switchToSearch}>
                            <Image source={require('~/src/image/search.png')} style={styles.searchIcon} />
                        </TouchableOpacity>
                        {!!showDelete &&
                            <TouchableOpacity onPress={onPressDelete}>
                                <Image source={isDeleting ? require('~/src/image/delete_active.png') : require('~/src/image/delete2.png')} style={styles.deleteIcon} />
                            </TouchableOpacity>
                        }
                    </View>
                }

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    backIcon: {
        width: 24,
        height: 24,
        marginRight: 14
    },
    textInputContainer: {
        height: 32,
        backgroundColor: COLORS.BACKGROUND3,
        borderRadius: 8,
        flex: 1
    },
    searchIcon: {
        width: 24,
        height: 24,
    },
    textInput: {
        flex: 1,
        marginHorizontal: 8,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 0,
        paddingRight: 0
    },
    clearIcon: {
        width: 20,
        height: 20
    },
    deleteIcon: {
        width: 24,
        height: 24,
        marginLeft: 16
    }

})
