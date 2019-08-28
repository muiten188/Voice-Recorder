import React, { Component } from 'react';
import { FlatList } from 'react-native';
import I18n from '~/src/I18n'
import { SURFACE_STYLES, NEW_COLORS } from '~/src/themes/common'
import { COLORS } from '~/src/themes/common'
import { connect } from 'react-redux'
import { getProductReport } from '~/src/store/actions/report'
import { Container, View, Text, Toolbar } from '~/src/themes/ThemeComponent'
import { topProductSelector } from '~/src/store/selectors/report'
import { chainParse } from '~/src/utils'

class TopProductList extends Component {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super();

        this.state = {
            loading: false,
            refreshing: false,
        }
    }

    _onRefresh = () => {
        this._load(true)
    }

    _load = (page = 1, refreshing = false) => {
        const { getProductReport } = this.props
        if (refreshing) {
            this.setState({ refreshing: true })
        } else {
            this.setState({ loading: true })
        }
        const startTime = this.props.navigation.getParam('startTime')
        const endTime = this.props.navigation.getParam('endTime')
        getProductReport(startTime, endTime, page, (err, data) => {
            console.log('getProductReport err', err)
            console.log('getProductReport data', data)
            this.setState({ loading: false, refreshing: false })
        })

    }

    _loadMore = () => {
        if (this.state.loading || this.state.refreshing) return
        const pageNumber = +chainParse(this.props, ['topProduct', 'pagingInfo', 'pageNumber'])
        const totalPages = +chainParse(this.props, ['topProduct', 'totalPages'])
        console.log('PageNumber, TotalPage', pageNumber, totalPages)
        if (pageNumber >= totalPages) return
        this._load(pageNumber + 1)
    }

    _renderTopProductItem = ({ item, index }) => {
        const backgroundColor = index % 2 == 0 ? 'rgba(0, 0, 0, 0.05)' : NEW_COLORS.WHITE
        return (
            <View style={[SURFACE_STYLES.rowStart, { paddingHorizontal: 24, backgroundColor }]}>
                <View style={{ paddingVertical: 8, paddingRight: 24, width: 138, borderRightWidth: 1, borderRightColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.85)' }}>{item.productName}</Text>
                </View>
                <View style={{ paddingVertical: 8, paddingLeft: 50, flex: 1 }}>
                    <Text style={{ fontSize: 14, color: NEW_COLORS.BLUE }}>{item.cntProduct}</Text>
                </View>
            </View>
        )
    }

    componentDidMount() {
        this._load()
    }

    render() {
        const { topProduct } = this.props
        const topProductContent = topProduct.content || []
        return (

            <Container>
                <Toolbar
                    title={I18n.t('all_sale_product')}
                />
                <View className='flex background'>
                    <View className='space24' />
                    <FlatList
                        data={topProductContent}
                        renderItem={this._renderTopProductItem}
                        keyExtractor={item => item.productId}
                        ListFooterComponent={<View style={{ height: 50 }} />}
                        style={{ padding: 24, backgroundColor: COLORS.WHITE }}
                        onEndReached={this._loadMore}
                    />
                </View>
            </Container>
        )
    }
}

export default connect(state => ({
    topProduct: topProductSelector(state)
}), { getProductReport })(TopProductList)
