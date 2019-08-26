import React, { Component } from 'react'
import { COLORS } from '~/src/themesnew/common'
import { View, Text } from '~/src/themesnew/ThemeComponent'
import { Image } from 'react-native'

export default class Drawer extends Component {
    componentDidMount() {
        console.log('Drawer didmount')
    }

    render() {
        return (
            <View className='pv16'>
                <View className='space16' />
                <View className='row-start ph16 pv16 border-bottom'>
                    <Image source={{ uri: 'https://dsdigitaladvertisingdda.com/wp-content/uploads/2017/07/client.png' }}
                        style={{ width: 60, height: 60, marginRight: 8 }}
                    />
                    <View>
                        <Text className='textBlack s16 bold mb8'>Hải Vũ</Text>
                        <Text className='gray'>vu.longhai93@gmail.com</Text>
                    </View>
                </View>
            </View>
        )
    }

}