import React from "react";
import { TouchableOpacity } from "react-native";

export default TouchableOpacityHitSlop = (props) => {

    return (
        <TouchableOpacity
            hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
            {...props}

        />

    )
}