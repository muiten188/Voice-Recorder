import React, { Component } from "react"
import { Image } from 'react-native'
import { View, Text, SmallButton, TouchableOpacityHitSlop, TextInputBase as TextInput } from "~/src/themes/ThemeComponent";
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
            password: '',
            newPassword: '',
            code: ''
        }
    }

    _handlePressConfirm = () => {
        this.props.navigation.goBack()
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
                <View>
                    <View className='space10' />
                    <View className='ph16 pv12'>
                        <Text className='s13 textBlack bold'>{I18n.t('password')}</Text>
                        <TextInput
                            value={this.state.password}
                            onChangeText={text => this.setState({ password: text })}
                            secureTextEntry={true}
                            style={styles.textInput}
                        />
                    </View>
                    <View className='ph16 pv12'>
                        <Text className='s13 textBlack bold'>{I18n.t('new_password')}</Text>
                        <TextInput
                            value={this.state.newPassword}
                            onChangeText={text => this.setState({ newPassword: text })}
                            secureTextEntry={true}
                            style={styles.textInput}
                        />
                    </View>
                    <View className='ph16 pv12'>
                        <Text className='s13 textBlack bold'>{I18n.t('verify')}</Text>
                        <TextInput
                            value={this.state.code}
                            onChangeText={text => this.setState({ code: text })}
                            keyboardType={'number-pad'}
                            style={styles.textInput}
                        />
                    </View>
                    <View className='space100' />
                </View>

                <View className='row-center'>
                    <SmallButton
                        green
                        text={I18n.t('confirm')}
                        onPress={this._handlePressConfirm}
                    />
                </View>
            </View>

        );
    }
}