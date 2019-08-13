import React from 'react';
import { Text, View, FlatList, TouchableOpacity, ActivityIndicator, Platform, InteractionManager } from 'react-native';
import I18n from '~/src/I18n'
import styles from './styles'
import { chainParse } from '~/src/utils'
import { GOOGLE_API_KEY } from '~/src/constants'
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
const DELTA_LAT = 0.005
const DELTA_LONG = 0.005

export default class AddressPicker extends React.Component {

    static navigationOptions = {
        headerTitle: I18n.t('choose_position'),
    }

    constructor(props) {
        super(props)
        this.state = {
            selectPlace: {},
            region: {
                latitude: 21.0285512,
                longitude: 105.8114176,
                latitudeDelta: DELTA_LAT,
                longitudeDelta: DELTA_LONG,
            },
            geoCodingData: [],
            showGeoCodingData: true,
            showMap: false
        }
        this.currentLocation = {}
    }

    onRegionChangeComplete = (region) => {
        const deltaLat = region.latitude - this.state.region.latitude
        const deltaLong = region.longitude - this.state.region.longitude
        console.log('On Region Change Complete', region)
        const distance = Math.sqrt(deltaLat * deltaLat + deltaLong * deltaLong) * 100000
        console.log('Distance', distance)
        if (distance < 5 || distance > 100000) return
        this.setState({
            region,
            showGeoCodingData: true
        })
        this._fetchGeoCodingData(region.latitude, region.longitude)
    }


    _changeRegion = (latitude, longitude) => {
        this.setState({
            region: {
                latitude, longitude,
                latitudeDelta: DELTA_LAT,
                longitudeDelta: DELTA_LONG
            },
            showMap: true
        })
    }

    _fetchGeoCodingData = (latitude, longitude) => {
        let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&rankby=distance&key=${GOOGLE_API_KEY}`
        console.log('URL', url)
        return fetch(url)
            .then(response => {
                console.log('Response', response)
                return response.json()
            })
            .then(responseJSON => {
                if (responseJSON.status == 'OK') {
                    console.log('Response JSON', responseJSON)
                    if (responseJSON && responseJSON.results && responseJSON.results[0]) {
                        this.setState({ geoCodingData: responseJSON.results, selectPlace: responseJSON.results[0] })
                    }
                }
            })
            .catch(err => {
                console.log('Error', err)
            })
    }

    componentDidMount() {
        this._fetchGeoCodingData(21.0285512, 105.8114176)
        setTimeout(() => {
            this.setState({ showMap: true }, () => {
            })
        }, 300)
    }

    _handleConfirm = () => {
        this.props.navigation.goBack()
        const callback = this.props.navigation.getParam('callback')
        callback && callback(this.state.selectPlace)

    }

    _handlePressGeoCodingItem = (item) => {
        console.log('Handle Press GeoCoding Item', item)
        this.setState({ selectPlace: item })
    }

    _renderGeoCodingItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this._handlePressGeoCodingItem(item)} style={styles.geoCodingItem}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.textBold}>{item.name}</Text>
                    <Text style={styles.text}>{item.formatted_address || item.vicinity}</Text>
                </View>
                {(item.place_id == this.state.selectPlace.place_id) && <Icon name='check' color={COLORS.BLUE} size={24} />}
            </TouchableOpacity>
        )
    }

    _renderGeoCodingHeader = () => {
        return (
            <View style={styles.geoCodingHeader}>
                <Text style={styles.text}>{I18n.t('recommend')}</Text>
            </View>
        )
    }

    _goToCurrentLocation = () => {

        if (this.defaultLocation) {
            this.currentLocation = {
                latitude: this.defaultLocation.latitude,
                longitude: this.defaultLocation.longitude
            }

            this._fetchGeoCodingData(this.currentLocation.latitude, this.currentLocation.longitude)
            setTimeout(() => {
                this._changeRegion(this.currentLocation.latitude, this.currentLocation.longitude)
            }, 100)

        } else {
            ClingmeUtils.getGeoLocation((err, data) => {
                if (!err) {
                    this.currentLocation = {
                        latitude: data.latitude,
                        longitude: data.longitude
                    }

                    this._fetchGeoCodingData(this.currentLocation.latitude, this.currentLocation.longitude)
                    setTimeout(() => {
                        this._changeRegion(this.currentLocation.latitude, this.currentLocation.longitude)
                    }, 100)
                } else {

                }
            })
        }

    }

    render() {
        if (!this.state.showMap) {
            return <View style={SURFACE_STYLES.columnCenter}>
                <ActivityIndicator size={Platform.OS == 'android' ? 60 : 'large'} color={COLORS.BLUE} />
            </View>
        }

        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    {/* <MapView
                        onMapReady={this._onMapReady}
                        onRegionChangeComplete={this.onRegionChangeComplete}
                        showsMyLocationButton={true}
                        region={this.state.region}
                        style={styles.map}
                        moveOnMarkerPress={false}
                        provider={PROVIDER_GOOGLE}
                        ref={ref => this.map = ref}
                        onUserLocationChange={e => {
                            console.log('On User Location Change', e)
                            if (e && e.nativeEvent && e.nativeEvent.coordinate) {
                                this.currentLocation = e.nativeEvent.coordinate
                            } else if (e && e.coordinate) {
                                this.currentLocation = e.coordinate
                            }
                        }}
                    >
                    </MapView> */}
                    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name='map-marker' color={COLORS.BLUE} size={24} />
                    </View>
                </View>
                <View style={styles.buttonBottomContainer}>
                    <View style={{ height: 170 }}>
                        {this._renderGeoCodingHeader()}
                        <FlatList
                            data={this.state.geoCodingData}
                            renderItem={this._renderGeoCodingItem}
                            keyExtractor={item => item.place_id}
                            extraData={this.state}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={this._handleConfirm}
                        style={styles.buttonNextContainer}
                    >
                        <Text style={{ ...styles.textWhite, textAlign: 'center' }}>
                            {I18n.t('confirm').toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
