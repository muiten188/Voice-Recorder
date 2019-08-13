import React, { Component } from 'react';
import commonStyle, { COLORS, SURFACE_STYLES, TEXT_STYLES } from '~/src/themes/common'
import { View, TextInput, Text, Animated, Easing } from 'react-native'
import Icon from '~/src/components/FontIcon'

const MIN_LABEL_FONT_SIZE = 12
const MAX_LABEL_FONT_SIZE = 14
const LABEL_Y = 15
const LABEL_X = 12
const LABEL_TRANSFROM_DURATION = 150
const BORDER_TOP2_BASE_WIDTH = 0

export default class OutlinedTextInput extends Component {

    constructor(props) {
        super(props)
        const { width } = this.props
        this.labelWidth = 0
        this.labelHeight = 0
        this.state = {
            labelTransform: {
                scaleX: new Animated.Value(1),
                translateY: new Animated.Value(15),
            },
            borderTop2Transform: {
                width: new Animated.Value(BORDER_TOP2_BASE_WIDTH),
                opacity: new Animated.Value(1),
            },
            borderTop3Transform: {
                width: new Animated.Value(width - 12 - BORDER_TOP2_BASE_WIDTH - 4),
            },
        }
    }

    _handleFocus = () => {
        const { onFocus, width } = this.props
        const labelContainerWidth = this.labelWidth / (MAX_LABEL_FONT_SIZE / MIN_LABEL_FONT_SIZE) + 10
        const newBorderTop3Width = width - 12 - 4 - labelContainerWidth
        Animated.parallel([
            Animated.timing(this.state.labelTransform.scaleX, {
                toValue: MIN_LABEL_FONT_SIZE / MAX_LABEL_FONT_SIZE,
                timing: LABEL_TRANSFROM_DURATION,
                useNativeDriver: true
            }),
            Animated.timing(this.state.labelTransform.translateY, {
                toValue: -this.labelHeight / 2,
                timing: LABEL_TRANSFROM_DURATION,
                useNativeDriver: true
            }),
            Animated.timing(this.state.borderTop2Transform.width, {
                toValue: labelContainerWidth,
                timing: LABEL_TRANSFROM_DURATION / 2,
                easing: Easing.linear,
                useNativeDriver: false
            }),
            Animated.timing(this.state.borderTop3Transform.width, {
                toValue: newBorderTop3Width,
                timing: LABEL_TRANSFROM_DURATION / 2,
                easing: Easing.linear,
                useNativeDriver: false
            }),
            Animated.timing(this.state.borderTop2Transform.opacity, {
                toValue: 0,
                timing: LABEL_TRANSFROM_DURATION / 2,
                useNativeDriver: false
            }),
        ]).start()
        onFocus && onFocus()
    }

    _animatePlaceholder = () => {
        const { width } = this.props
        const labelContainerWidth = this.labelWidth / (MAX_LABEL_FONT_SIZE / MIN_LABEL_FONT_SIZE) + 10
        const newBorderTop3Width = width - 12 - 4 - labelContainerWidth
        Animated.parallel([
            Animated.timing(this.state.labelTransform.scaleX, {
                toValue: MIN_LABEL_FONT_SIZE / MAX_LABEL_FONT_SIZE,
                timing: 1,
                useNativeDriver: true
            }),
            Animated.timing(this.state.labelTransform.translateY, {
                toValue: -this.labelHeight / 2,
                timing: 1,
                useNativeDriver: true
            }),
            Animated.timing(this.state.borderTop2Transform.width, {
                toValue: labelContainerWidth,
                timing: 1,
                easing: Easing.linear,
                useNativeDriver: false
            }),
            Animated.timing(this.state.borderTop3Transform.width, {
                toValue: newBorderTop3Width,
                timing: 1,
                easing: Easing.linear,
                useNativeDriver: false
            }),
            Animated.timing(this.state.borderTop2Transform.opacity, {
                toValue: 0,
                timing: 1,
                useNativeDriver: false
            }),
        ]).start()
    }

    _handleBlur = () => {
        const { width, onBlur, value } = this.props
        onBlur && onBlur()

        if (value){

            return
        } 
        Animated.parallel([
            Animated.timing(this.state.labelTransform.scaleX, {
                toValue: new Animated.Value(1),
                timing: LABEL_TRANSFROM_DURATION,
                useNativeDriver: true
            }),
            Animated.timing(this.state.labelTransform.translateY, {
                toValue: new Animated.Value(LABEL_Y),
                timing: LABEL_TRANSFROM_DURATION,
                useNativeDriver: true
            }),
            Animated.timing(this.state.borderTop2Transform.width, {
                toValue: BORDER_TOP2_BASE_WIDTH,
                timing: LABEL_TRANSFROM_DURATION,
                easing: Easing.linear,
                useNativeDriver: false
            }),
            Animated.timing(this.state.borderTop3Transform.width, {
                toValue: width - 12 - BORDER_TOP2_BASE_WIDTH - 4,
                timing: LABEL_TRANSFROM_DURATION,
                easing: Easing.linear,
                useNativeDriver: false
            }),
            Animated.timing(this.state.borderTop2Transform.opacity, {
                toValue: 1,
                timing: LABEL_TRANSFROM_DURATION,
                useNativeDriver: false
            }),
        ])
            .start(() => {
                console.log('Animated Complete')
            })
    }

    componentDidMount() {
        const { value } = this.props
        if (value) {
            setTimeout(() => {
                this._animatePlaceholder()
            }, 100)
            
        }
    }
    componentDidUpdate(){
        const { value } = this.props
        if (value) {
            setTimeout(() => {
                this._animatePlaceholder()
            }, 100)
            
        } 
    }


    render() {
        const { borderColor = COLORS.WHITE, label, width, onFocus, onBlur, style,
            errorText, hasError, ...props } = this.props
        return (
            <View>
                <Animated.Text
                    onLayout={e => {
                        this.labelWidth = e.nativeEvent.layout.width
                        this.labelHeight = e.nativeEvent.layout.height
                    }}
                    style={{
                        position: 'absolute',
                        fontSize: MAX_LABEL_FONT_SIZE, color: borderColor, left: LABEL_X,
                        transform: [
                            {
                                scale: this.state.labelTransform.scaleX
                            },
                            {
                                translateY: this.state.labelTransform.translateY
                            }
                        ]
                    }}
                >
                    {label}
                </Animated.Text>
                <View style={[SURFACE_STYLES.rowStart, { bottom: -1 }]}>
                    <View style={{
                        width: 12,
                        height: 1,
                        backgroundColor: borderColor,
                        left: 2
                    }} />
                    <Animated.View style={{
                        width: this.state.borderTop2Transform.width,
                        height: 1,
                        backgroundColor: borderColor,
                        left: 2,
                        opacity: this.state.borderTop2Transform.opacity,
                    }} />
                    <Animated.View style={{
                        width: this.state.borderTop3Transform.width,
                        height: 1,
                        backgroundColor: borderColor,
                        left: 2,
                    }} />
                </View>


                <View style={{
                    height: 44,
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 4,
                    justifyContent: 'center',
                    padding: 2,
                    borderTopWidth: 0,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderBottomWidth: 1
                }}>
                    <TextInput
                        selectionColor={COLORS.WHITE}
                        {...props}
                        onFocus={this._handleFocus}
                        onBlur={this._handleBlur}
                        style={[
                            { flex: 1, paddingHorizontal: 12, color: COLORS.WHITE },
                            style
                        ]}
                    />
                </View>
                {!!hasError && <View style={[SURFACE_STYLES.rowSpacebetween, SURFACE_STYLES.fullWidth, { marginTop: 5 }]}>
                    <Text themeable={false} style={TEXT_STYLES.error}>{errorText}</Text>
                    <Icon name='GB_alert' style={commonStyle.textInput.iconError} />
                </View>}
            </View>
        )
    }
}
