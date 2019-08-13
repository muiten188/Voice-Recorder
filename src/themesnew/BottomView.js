import React from 'react'
import styled from 'styled-components/native'
import { COLORS } from '~/src/themesnew/common'

export default BottomView = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: ${COLORS.WHITE}
`