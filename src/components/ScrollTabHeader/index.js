import React, { PropTypes, PureComponent } from 'react';
import { FlatList, Platform, Dimensions } from 'react-native';
import { DEVICE_WIDTH, DEVICE_HEIGHT } from '~/src/themes/common'
import styles from './styles'
import Ripple from 'react-native-material-ripple'
import { Text, View } from '~/src/themesnew/ThemeComponent'

export default class ScrollTabHeader extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            page: props.page || 0
        }
        this.height = 0
        this.layoutMap = []
    }

    _handlePress = (item, index) => {
        const { onChangeTab, onPressSameTab } = this.props
        if (index != this.state.page) {
            this.setState({ page: index })
            this._scroll(index)
            onChangeTab && onChangeTab(index)
        } else {
            onPressSameTab && onPressSameTab()
        }
    }

    _scroll = (page) => {

        let offsetOfTab = this._getOffsetCurrentTab(page)
        let distanceToEnd = this._getDistanceToEnd(page)
        if (distanceToEnd < DEVICE_WIDTH) {
            this.headerList.scrollToEnd()
            return
        }
        if (offsetOfTab + this.layoutMap[page] < DEVICE_WIDTH) {
            this.headerList.scrollToOffset({ offset: 0 })
            return
        }
        if (offsetOfTab + this.layoutMap[page] > DEVICE_WIDTH
            || offsetOfTab < DEVICE_WIDTH
        ) {
            this.headerList.scrollToOffset({ offset: offsetOfTab })
        }
    }


    setPage = (page) => {
        // this.headerList.scrollToIndex({index: page, animated: true})
        this.setState({ page: page })
        this._scroll(page)
    }

    _getOffsetCurrentTab = (page) => {
        let beforeTab = this.layoutMap.filter((item, index) => index < page)
        if (!beforeTab || beforeTab.length == 0) return 0
        return beforeTab.reduce((a, b) => a + b)
    }

    _getDistanceToEnd = (page) => {
        let afterTab = this.layoutMap.filter((item, index) => index >= page)
        if (!afterTab || afterTab.length == 0) return 0
        return afterTab.reduce((a, b) => a + b)
    }

    componentWillReceiveProps(nextProps) {
        if (typeof (nextProps.page) != 'undefined' && nextProps.page != this.state.page) {
            this.setState({ page: nextProps.page })
            this._scroll(nextProps.page)
        }
    }

    componentDidMount() {
        if (this.state.page > 0) {
            this._scroll(this.state.page)
        }
    }

    _renderItem = ({ item, index }) => {
        const itemStyle = index == this.state.page ? styles.itemOuterActive : styles.itemOuter
        const itemRipple = index == this.state.page ? styles.itemActive : styles.item
        const textStyle = index == this.state.page ? styles.textActive : styles.text
        return (
            <View
                className='row-start'
                style={itemStyle}
                onLayout={e => this.layoutMap[index] = e.nativeEvent.layout.width}>
                <Ripple style={itemRipple} onPress={() => this._handlePress(item, index)}
                    rippleCentered={true}
                >
                    <Text style={textStyle}>{item.label}</Text>
                </Ripple>
            </View>
        )
    }

    getHeight = () => this.height


    render() {
        const { data } = this.props
        if (!data) return false

        return (
            <View style={styles.list}
                onLayout={e => {
                    this.height = e.nativeEvent.layout.height
                }}
            >
                <View className='border-bottom2' style={styles.listContainer}>
                    <FlatList
                        extraData={this.state.page}
                        horizontal={true}
                        data={data}
                        renderItem={this._renderItem}
                        keyExtractor={item => item.page + ''}
                        showsHorizontalScrollIndicator={false}
                        initialScrollIndex={0}
                        ref={ref => this.headerList = ref}
                    />
                </View>
            </View>
        )

    }
}
