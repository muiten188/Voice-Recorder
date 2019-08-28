import React, { PureComponent } from "react";
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native'
import { COLORS } from '~/src/themes/common'
import { withNavigation } from 'react-navigation'
import imgBackWhite from '~/src/image/imgBackWhite.png'
import Text, { Title, ActionText } from './Text'

class Toolbar extends PureComponent {
    constructor(props) {
        super(props)
    }

    _handlePressBack = () => {
        const { onPressLeft } = this.props
        if (onPressLeft) {
            onPressLeft()
            return
        }
        this.props.navigation.goBack()
        // this.props.navigation.navigate("DebtManage")
    }

    _handlePressRight = () => {
        const { onPressRight } = this.props
        onPressRight && onPressRight()
    }

    render() {
        const { title, rightText, blue } = this.props
        const color = blue ? COLORS.WHITE : COLORS.BLACK
        const rightTextColor = blue ? COLORS.WHITE : COLORS.CERULEAN
        return (
            <View style={[styles.container, { backgroundColor: blue ? COLORS.PRIMARY : COLORS.WHITE }]}>
                <View style={[styles.toolbar, { backgroundColor: blue ? COLORS.PRIMARY : COLORS.WHITE }]}>
                    <TouchableOpacity onPress={this._handlePressBack}>
                        <Image source={blue ? imgBackWhite : require('~/src/image/arrow_left.png')}
                            style={styles.backImage}
                        />
                    </TouchableOpacity>
                    <View style={styles.titleContainer} pointerEvents={'none'}>
                        <Title style={{ color }}>{title ? title.toUpperCase() : ""}</Title>
                    </View>
                    {!!rightText &&
                        <TouchableOpacity onPress={this._handlePressRight} style={styles.rightContainer}>
                            <ActionText style={[styles.rightText, { color: rightTextColor }]}>{rightText}</ActionText>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}

export default withNavigation(Toolbar)


const styles = StyleSheet.create({
    container: {
        // paddingTop: 13.8,
        height: 56,
        backgroundColor: COLORS.WHITE,
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.BORDER_COLOR,
        height: 56,
    },
    titleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        // paddingTop: 13,
        // paddingBottom: 9,
        top: 0,
        bottom: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0
    },
    backImage: {
        width: 46,
        height: 46,
        zIndex: 100
    },
    rightContainer: {
        position: 'absolute',
        right: 16
    },
    rightText: {
        fontSize: 13
    }
});