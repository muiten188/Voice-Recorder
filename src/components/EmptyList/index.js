import React, { Component } from 'react'
import { Image } from 'react-native'
import imgEmpty from "~/src/image/imgEmpty.png"
import imgArrow from "~/src/image/imgArrow.png"
import I18n from "~/src/I18n";
import { generateHighlightText } from "~/src/utils";
import { Text, View } from "~/src/themes/ThemeComponent"
import styles from "./styles"

export default class EmptyList extends Component {
    render() {
        const { title, guide } = this.props
        return (
            <View style={{ width: "100%", alignItems: 'center',backgroundColor:"white", flex:1 }}>
                <Image source={imgEmpty} style={styles.imgEmpty}></Image>
                <View className='columnCenter ph44'>
                    <Text style={styles.txtTitle}>{title ? title : ""}</Text>
                    {generateHighlightText(guide, styles.txtGuide, styles.txtHighlight)}
                </View>

                <Image source={imgArrow} style={styles.imgArrow}></Image>
            </View>
        )
    }
}
