import React, { Component } from "react";
import { StyleSheet } from 'react-native'
import { Container, View, Text } from "~/src/themesnew/ThemeComponent";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { COLORS } from "~/src/themesnew/common";
import { TouchableOpacity } from "react-native-gesture-handler";


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
                    <View className='flex pd32 column-all-start'>
                        <Text className='s18 gray'>Ghi âm</Text>
                        <Text className='s48' style={{ marginTop: 16 }}>00 : 00 : 00</Text>
                    </View>
                    <View style={styles.actionBlock}>
                        <TouchableOpacity>
                            <View style={styles.iconContainer}>
                                <Icon name='menu' size={24} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.iconContainerCenter}>
                                <Icon name='microphone' size={36} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.iconContainer}>
                                <Icon name='playlist' size={28} />
                            </View>
                        </TouchableOpacity>
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
    iconContainerCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: COLORS.BORDER_COLOR2
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
