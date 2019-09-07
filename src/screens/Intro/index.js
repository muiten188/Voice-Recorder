import React, { Component } from "react";
import {
    Image,
    ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import Carousel from "react-native-snap-carousel";
import styles from "./styles";
import { DEVICE_WIDTH, DEVICE_HEIGHT, COLORS } from "~/src/themes/common";
import { Text, View, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent";
import I18n from "~/src/I18n";
import { scaleHeight } from '~/src/utils'
import { StackActions, NavigationActions } from "react-navigation";

export default class Intro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
        }
        this.intros = [
            { id: 1, title: 'WELCOME', content: I18n.t('text_intro_1') },
            { id: 2, title: 'WELCOME2', content: I18n.t('text_intro_2') }
        ]
    }
    _renderItem = ({ item, index }) => {
        return (
            <View>
                <View className='row-center'>
                    <Text className='green s18 bold'>{item.title}</Text>
                </View>
                <View style={{ height: scaleHeight(22) }} />
                <Text className='s13 textBlack lh16'>{item.content}</Text>
                <View style={{ height: scaleHeight(56) }} />
            </View>
        )
    }

    _updateCurrentIndex = currentIndex => {
        this.setState({
            currentIndex: currentIndex
        });
    };

    _renderItemIndicator = (item, index) => {
        if (item.index !== this.state.currentIndex) {
            return <View style={styles.viewIndicator} />;
        } else {
            return <View style={styles.viewIndicatorFocus} />;
        }
    };

    _saveIntro = async (status) => {
        try {
            await AsyncStorage.setItem("intro", status);
            console.log("SET ITEM SUCCESSFUL" + status);
        } catch (error) {
            console.log("SET ITEM FAIL");
        }
    };

    _handleOnPressNext = () => {
        this.setState({
            currentIndex: this.state.currentIndex + 1
        })
    }

    _renderIndicatorItem = (item, index) => {
        const isActive = index == this.state.currentIndex
        const indicatorStyle = isActive ? styles.indicatorActive : styles.indicator
        const marginRight = index < this.intros.length - 1 ? 8 : 0
        return <View style={[indicatorStyle, { marginRight }]} key={item.id} />
    }

    _handlePressActionText = () => {
        if (this.state.currentIndex < this.intros.length - 1) {
            this.setState({ currentIndex: this.state.currentIndex + 1 })
        } else {
            this._saveIntro("true")
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: "Login" })],
                key: undefined
            });
            this.props.navigation.dispatch(resetAction);
        }
    }

    _renderIndicator = () => {
        const actionText = this.state.currentIndex < this.intros.length - 1 ? I18n.t('next') : I18n.t('done')
        return (
            <View className='row-center' style={{ width: '100%', position: 'absolute', bottom: scaleHeight(56), left: 16, right: 16 }}>
                {this.intros.map(this._renderIndicatorItem)}
                <TouchableOpacityHitSlop style={styles.actionText} onPress={this._handlePressActionText}>
                    <Text className='green'>{actionText}</Text>
                </TouchableOpacityHitSlop>
            </View>
        )
    }



    render() {
        return (
            <View className='flex white'>
                <ImageBackground
                    source={require('~/src/image/intro_background.png')}
                    style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
                    resizeMode={'cover'}
                >
                    <View className='flex ph16'>
                        <View style={{ height: scaleHeight(320) }} />
                        <View className='row-center'>
                            <Image source={require('~/src/image/logo_info.png')}
                                style={{ width: scaleHeight(296), height: scaleHeight(107) }}
                                resizeMode={'contain'}
                            />
                        </View>
                        <View style={{ height: scaleHeight(46) }} />
                        <Carousel
                            data={this.intros}
                            firstItem={this.state.currentIndex}
                            itemWidth={DEVICE_WIDTH - 32}
                            onSnapToItem={this._updateCurrentIndex}
                            sliderWidth={DEVICE_WIDTH - 32}
                            renderItem={this._renderItem}
                        />
                        {this._renderIndicator()}
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
