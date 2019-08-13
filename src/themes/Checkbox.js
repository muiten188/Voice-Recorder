import React, { PureComponent } from 'react';
import Surface from '~/src/themes/Surface'
import Text from '~/src/themes/Text'
import Icon from '~/src/themes/Icon'
import { COLORS } from '~/src/themes/common'
import { TouchableOpacity } from 'react-native'


export default class Checkbox extends PureComponent {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {
        const { checked, textT, onPress } = this.props
        return (
            <Surface themeable={false} rowAlignStart>
                <TouchableOpacity onPress={onPress}>
                    <Surface rowCenter themeable={false} style={{
                        width: 20, height: 20,
                        borderWidth: 2,
                        borderColor: COLORS.BLUE,
                        borderRadius: 2,
                        borderStyle: 'solid',
                        backgroundColor: checked ? COLORS.BLUE : COLORS.WHITE,
                        marginRight: 3
                    }}>
                        {!!checked && <Icon name='GB_checked'
                            style={{ color: COLORS.WHITE, fontSize: 18 }}
                        />}
                    </Surface>
                </TouchableOpacity>
                {!!textT && <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
                    <Text t={textT} flex infoResult />
                </TouchableOpacity>}
            </Surface>
        )
    }
}
