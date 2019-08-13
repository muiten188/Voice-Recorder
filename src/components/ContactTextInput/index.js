import React from 'react';
import { TextInput, Surface } from '~/src/themes/ThemeComponent'
import Permissions from 'react-native-permissions'
import { Platform } from 'react-native'
import { PERMISSION_RESPONSE } from '~/src/constants'
import PopupConfirm from '~/src/components/PopupConfirm'
import OpenAppSettings from 'react-native-app-settings'

export default class ContactTextInput extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    _openContactChooser = () => {
        this.props.navigation.navigate('ContactChooser', {
            onChooseContact: this._handleChooseContact
        })
    }

    _requestPermission = () => {
        const startTime = new Date().getTime()
        Permissions.request('contacts').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            console.log('check request permsion callback', { response });
            if (response == PERMISSION_RESPONSE.AUTHORIZED) {
                this._openContactChooser()
            } else if (response == PERMISSION_RESPONSE.RESTRICTED) {
                const endTime = new Date().getTime()
                console.log('Time to response', (endTime - startTime))
                // Assume if permission restricted from previous prompt
                if (endTime - startTime < 500) {
                    OpenAppSettings.open()
                }
                // Deny on iOS only happen once
            } else if (response == PERMISSION_RESPONSE.DENIED) {
                if (Platform.OS == 'ios') {
                    const endTime = new Date().getTime()
                    console.log('Time to response', (endTime - startTime))
                    // Assume if permission restricted from previous prompt
                    if (endTime - startTime < 500) {
                        OpenAppSettings.open()
                    }
                }
            }
        })
    }

    _handleChooseContact = (phone, contact) => {
        const { onChooseContact } = this.props
        onChooseContact && onChooseContact(phone, contact)
    }

    _handlePressContact = async () => {
        Permissions.check('contacts').then(response => {
            if (response != PERMISSION_RESPONSE.AUTHORIZED) {
                this.popupContactPermission && this.popupContactPermission.open()
            } else {
                this._openContactChooser()
            }
        })
    }


    render() {
        const { placeholderT = 'phone_number', error, ...rest } = this.props
        return (
            <Surface themeable={false}>
                <PopupConfirm
                    animationType='none'
                    contentT={'grant_contact_permission_hint'}
                    titleT={'grant_permission'}
                    textYesT={'agree'}
                    textNoT={'cancel'}
                    onPressYes={this._requestPermission}
                    ref={ref => this.popupContactPermission = ref} />
                <TextInput
                    placeholderT={placeholderT}
                    blackWithDarkblueIcon
                    keyboardType='number-pad'
                    iconRight={'GB_contact'}
                    onPressIconRight={this._handlePressContact}
                    showIconRight={true}
                    hasError={!!this.props.error}
                    errorText={this.props.error}
                    maxLength={14}
                    {...rest}
                />
            </Surface>
        )
    }
}