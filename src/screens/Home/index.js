import React, { Component } from "react";
import { StyleSheet } from 'react-native'
import { Container, View, Text } from "~/src/themesnew/ThemeComponent";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { COLORS } from "~/src/themesnew/common";


export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    render() {

        return (
            <Container blue>
                <View className="flex background column-end" >
                    <View style={styles.actionBlock}>
                        <View style={styles.iconContainer}>
                            <Icon name='menu' size={32} />
                        </View>
                        <View style={styles.iconContainer}>
                            <Icon name='microphone' size={32} />
                        </View>
                        <View style={styles.iconContainer}>
                            <Icon name='playlist' size={32} />
                        </View>

                    </View>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    actionBlock: {
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER_COLOR2,
        width: '100%',
        padding: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: COLORS.BORDER_COLOR2
    }
})
