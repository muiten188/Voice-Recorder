import React from 'react';
import { View } from 'react-native';
import { COLORS } from '~/src/themes/common'
import { CURSOR_TYPE } from "~/src/constants";

export default class Cursor extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            type: props.type || CURSOR_TYPE.HORIZONTAL,
            customStyle: props.style
        }
    }

    componentDidMount() {
        this.timer = setInterval(e => this.setState({
            visible: !this.state.visible
        }), 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const { visible, customStyle } = this.state

        if (!visible) {
            return <View />;
        }

        let ownerStyle = {
            height: 28,
            width: 1,
            backgroundColor: COLORS.WHITE
        };

        if (this.state.type == CURSOR_TYPE.HORIZONTAL) {
            ownerStyle = {
                height: 1,
                width: 28,
                backgroundColor: COLORS.WHITE
            };
        }

        return <View style={[ownerStyle, customStyle]} />
    }
}