import React, { Component } from "react"
import { TouchableOpacity, Image, FlatList } from 'react-native'
import { View, Text, GradientToolbar, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent";
import FastImage from 'react-native-fast-image'
import I18n from '~/src/I18n'
import styles from './styles'
import LinearGradient from 'react-native-linear-gradient'

export default class MyAccount extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    _handleBack = () => {
        this.props.navigation.goBack()
    }

    _handlePressEdit = () => {
        console.log('Pressing Edit')
    }

    render() {
        return (
            <View className="flex white">
                <LinearGradient
                    colors={['#d63e3b', '#209955']}
                    style={[styles.gradientContainer]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View>
                        <View className='statusbar' />
                        <TouchableOpacityHitSlop onPress={this._handleBack}>
                            <Image source={require('~/src/image/back.png')}
                                style={styles.backIcon}
                            />
                        </TouchableOpacityHitSlop>
                        <View className='column-center' style={{ marginTop: 25 }}>
                            <FastImage
                                source={{ uri: 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fewedit.files.wordpress.com%2F2016%2F10%2Fdr-strange.jpg&w=400&c=sc&poi=face&q=85' }}
                                style={styles.avatar}
                            />
                            <Text className='white bold s14 mb4'>Vũ Long Hải</Text>
                            <Text className='white s12'>Admintrator</Text>
                        </View>

                    </View>

                </LinearGradient>
                <View className='row-end ph14' style={styles.actionContainer}>
                    <TouchableOpacityHitSlop onPress={this._handlePressEdit}>
                        <Image source={require('~src/image/edit.png')} style={styles.actionIcon} />
                    </TouchableOpacityHitSlop>
                </View>
            </View>

        );
    }
}