import React, { PureComponent } from 'react'
import { TextInput, TouchableOpacity, View, FlatList } from 'react-native'
import Text from '~/src/themes/Text'
import commonStyle, { SURFACE_STYLES } from '~/src/themes/common'
import { COLORS } from '~/src/themes/common'
import { TouchableRipple } from 'react-native-paper'
import { connect } from 'react-redux'
import I18n from '~/src/I18n'
import { getListProvince } from '~/src/store/actions/address'
import { chainParse } from '~/src/utils'

class ProvincePicker extends PureComponent {
    static navigationOptions = {
        headerTitle: I18n.t('choose_province_hint'),
    }

    constructor(props) {
        super(props)
        this.state = {
            provinceList: ''
        }
    }

    _handPress = (item) => {
        console.log('Pressing Item', item)
        const callback = this.props.navigation.getParam('callback')
        this.props.navigation.goBack()
        callback && callback(item)
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableRipple onPress={() => this._handPress(item)}>
                <View style={[SURFACE_STYLES.rowAlignStart, SURFACE_STYLES.borderBottom, { paddingVertical: 10 }]}>
                    <View style={SURFACE_STYLES.flex}>
                        <Text style={{ color: COLORS.TEXT_BLACK }}>{item.name}</Text>
                    </View>
                </View>
            </TouchableRipple>
        )
    }

    componentDidMount() {
        this.props.getListProvince((err, data) => {
            console.log('Err List Province', err)
            console.log('Data List Province', data)
            const result = chainParse(data, ['updated', 'result'])
            if (result){
                this.setState({provinceList: result})
            }
            
        })
    }

    render() {
        return (
            <View style={SURFACE_STYLES.containerHorizontalMargin}>
                <FlatList
                    data={this.state.provinceList}
                    extraData={this.props}
                    renderItem={this._renderItem}
                    keyExtractor={item => '' + item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }
}

export default connect(null, { getListProvince })(ProvincePicker)