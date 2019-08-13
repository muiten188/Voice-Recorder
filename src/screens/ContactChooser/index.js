import React from 'react';
import { BackHandler, Platform, FlatList, ActivityIndicator, View } from 'react-native'
import { Surface, Text, TextInput2 as TextInput } from '~/src/themes/ThemeComponent'
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import styles from './styles'
import Contacts from 'react-native-contacts'
import Ripple from 'react-native-material-ripple'
import { toNormalCharacter } from '~/src/utils'
import { errorUnknownBlue } from '~/src/components/Assets/ErrorUnknownBlue'
import SvgUri from 'react-native-svg-uri'
import I18n from '~/src/I18n'

export default class ContactChooser extends React.PureComponent {
    static navigationOptions = {
        headerTitle: I18n.t('choose_contact'),
    }

    constructor(props) {
        super(props)
        this.state = {
            keyword: '',
            contacts: [],
            loadingContact: true
        }
        this.contacts = []
    }

    _handleBack = () => {
        this.props.navigation.goBack()
        return true
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBack)
        Contacts.getAllWithoutPhotos((err, contacts) => {
            this.contacts = contacts.filter(item => item.phoneNumbers && item.phoneNumbers.length > 0)
            this.setState({ contacts: this.contacts, loadingContact: false })
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBack)
    }


    _onChangeKeyword = (text) => {
        this.setState({ keyword: text }, () => {
            const filterContacts = this.contacts.filter(item => {
                let phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0 ?
                    item.phoneNumbers[0].number : ''
                phoneNumber = phoneNumber.replace(/-|\s/g, '')

                let name = (item.givenName || '')
                if (item.middleName) name += ` ${item.middleName}`
                if (item.familyName) name += ` ${item.familyName}`
                name = toNormalCharacter(name.toLowerCase())
                return (
                    (phoneNumber.indexOf(text) > -1) ||
                    (name.indexOf(toNormalCharacter(text.toLowerCase())) > -1)
                )
            })
            this.setState({ contacts: filterContacts })
        })
    }

    _handlePressContactItem = (item) => {
        const onChooseContact = this.props.navigation.getParam('onChooseContact')
        this.props.navigation.goBack()
        let phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0 ?
            item.phoneNumbers[0].number : ''
        phoneNumber = phoneNumber.replace(/-|\s/g, '')
        onChooseContact && onChooseContact(phoneNumber, item)
    }

    _renderContactItem = ({ item, index }) => {
        const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0 ?
            item.phoneNumbers[0].number : ''
        let name = (item.givenName || '')
        if (item.middleName) name += ` ${item.middleName}`
        if (item.familyName) name += ` ${item.familyName}`
        return (
            <Ripple onPress={() => this._handlePressContactItem(item)}>
                <Surface borderBottomBlue style={{ paddingVertical: 16 }}>
                    <Text description>{name}</Text>
                    <Text description>{phoneNumber}</Text>
                </Surface>
            </Ripple>
        )
    }

    _renderEmptySearchResult = () => {
        return (
            <Surface columnStart>
                <SvgUri
                    width="350"
                    height="170"
                    svgXmlData={errorUnknownBlue}
                />
                <Text errorNormal t='no_result' />
            </Surface>
        )
    }

    render() {
        return (
            <Surface flex>
                <View style={SURFACE_STYLES.containerHorizontalMargin}>
                    <View style={SURFACE_STYLES.space16} />
                    <TextInput
                        placeholder={I18n.t('search_contact_hint')}
                        descriptionIcon={'account-search'}
                        iconRight={'close'}
                        showIconRight={!!this.state.keyword}
                        onChangeText={this._onChangeKeyword}
                        value={this.state.keyword}
                        onPressIconRight={() => this.setState({ keyword: '' })}
                    />
                </View>
                {!!this.state.loadingContact ?
                    <ActivityIndicator size={Platform.OS == 'android' ? 60 : 'large'} color={COLORS.BLUE} /> :
                    (this.state.contacts && this.state.contacts.length > 0) ?
                        <FlatList
                            data={this.state.contacts}
                            renderItem={this._renderContactItem}
                            keyExtractor={item => '' + item.rawContactId}
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                        /> :
                        this._renderEmptySearchResult()
                }
            </Surface>
        )
    }
}