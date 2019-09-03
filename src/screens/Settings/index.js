import React, { Component } from "react"
import { Container, View, Text, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent";


export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        return (
            <Container blue>
                <View className="flex background">
                    <Text>Settings</Text>

                </View>
            </Container>
        );
    }
}