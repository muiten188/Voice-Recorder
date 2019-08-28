import React, { Component } from 'react';
import {
    ScrollView, Platform, RefreshControl, processColor,
    TouchableOpacity, FlatList, StatusBar, Image
} from 'react-native';
import I18n from '~/src/I18n'
import { SURFACE_STYLES, COLORS, NEW_COLORS } from '~/src/themes/common'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import { getOrderStatistic, getTotalPaidOrderByMethod } from '~/src/store/actions/order'
import { connect } from 'react-redux'
import moment from 'moment'
import { formatMoney, getWidth } from '~/src/utils'
import { BarChart } from 'react-native-charts-wrapper'
import { getProductReport, getTransactionReport } from '~/src/store/actions/report'
import DateRangePicker from '~/src/components/DateRangePicker'
import { Container, View, Text } from '~/src/themes/ThemeComponent'
import styles from './styles'
import { topProductListSelector } from '~/src/store/selectors/report'

class Chart extends Component {

    constructor(props) {
        super();

        this.state = {
            loading: false,
            refreshing: false,
            selectedPeriod: '',
            currentViewPeriod: 'week',
            startTime: moment().subtract(7, 'days').startOf('day'),
            endTime: moment().endOf('day'),
            totalPay: {},
            topProduct: [],
            totalRevenue: 0,
            totalCost: 0,
            totalTransaction: 0,

            orderStatistic: [],
            orderStatisticChart: {
                showChart: false,
                legend: {
                    enabled: true,
                    xEntrySpace: 20
                },
                data: {
                    dataSets: [
                        {
                            values: [],
                            label: I18n.t('revenue'),
                            config: {
                                color: processColor(NEW_COLORS.GREEN),
                                drawValues: false,
                            }
                        },
                        {
                            values: [],
                            label: I18n.t('expense'),
                            config: {
                                color: processColor(NEW_COLORS.ORANGE),
                                drawValues: false,
                            }
                        },
                    ],
                    config: {
                        barWidth: 0.4,
                        group: {
                            fromX: 0,
                            groupSpace: 0.2,
                            barSpace: 0,
                        },
                    }
                },
                xAxis: {
                    valueFormatter: [],
                    granularityEnabled: true,
                    granularity: 1,
                    position: 'BOTTOM',
                    drawGridLines: false,
                    drawAxisLine: false,
                    centerAxisLabels: true
                },
                yAxis: {
                    left: {
                        axisMinimum: 0,
                        drawGridLines: false,
                        drawLabels: false,
                        drawAxisLine: false,
                    },
                    right: {
                        axisMinimum: 0,
                        drawGridLines: false,
                        drawAxisLine: false,
                        drawLabels: false,
                    },
                },
                marker: {
                    enabled: true,
                    markerColor: processColor('rgba(0, 0, 0, 0.9)'),
                    textColor: processColor('white'),
                    markerFontSize: 14,
                },
            },

            orderNumberInfo: [],
            orderNumberChart: {
                showChart: false,
                legend: {
                    enabled: true,
                    xEntrySpace: 20
                },
                data: {
                    dataSets: [
                        {
                            values: [],
                            label: I18n.t('paid_order'),
                            config: {
                                color: processColor(NEW_COLORS.GREEN),
                                drawValues: false,
                            }
                        },
                        {
                            values: [],
                            label: I18n.t('waiting_order'),
                            config: {
                                color: processColor(NEW_COLORS.ORANGE),
                                drawValues: false,
                            }
                        },
                    ],
                    config: {
                        barWidth: 0.4,
                        group: {
                            fromX: 0,
                            groupSpace: 0.2,
                            barSpace: 0,
                        },
                    }
                },
                xAxis: {
                    valueFormatter: [],
                    granularityEnabled: true,
                    granularity: 1,
                    position: 'BOTTOM',
                    drawGridLines: false,
                    drawAxisLine: false,
                    centerAxisLabels: true
                },
                yAxis: {
                    left: {
                        axisMinimum: 0,
                        drawGridLines: false,
                        drawLabels: false,
                        drawAxisLine: false,
                    },
                    right: {
                        axisMinimum: 0,
                        drawGridLines: false,
                        drawAxisLine: false,
                        drawLabels: false,
                    },
                },
                marker: {
                    enabled: true,
                    markerColor: processColor('rgba(0, 0, 0, 0.9)'),
                    textColor: processColor('white'),
                    markerFontSize: 14,
                },
            }
        }

        this.didFocusListener = props.navigation.addListener(
            'didFocus',
            this.componentDidFocus,
        )
    }

    _onRefresh = () => {
        this._load(true)
    }

    _load = (refreshing = false) => {
        const { getOrderStatistic, merchantId, getTotalPaidOrderByMethod, getProductReport, getTransactionReport } = this.props
        if (refreshing) {
            this.setState({ refreshing: true })
        } else {
            this.setState({ loading: true })
        }

        getOrderStatistic(merchantId, this.state.startTime.unix(), this.state.endTime.unix(), (err, data) => {
            console.log('getOrderStatistic err', err)
            console.log('getOrderStatistic data', data)
            if (data && data.result && Array.isArray(data.result)) {
                const lastResult = data.result[data.result.length - 1]
                console.log('Last Result', lastResult)
                const orderStatistic = data.result

                const totalRevenue = orderStatistic.map(item => item.total).reduce((a, b) => a + b, 0)
                const totalCost = orderStatistic.map(item => item.cost).reduce((a, b) => a + b, 0)

                this.setState({
                    selectedPeriod: lastResult.tradingDate,
                    orderStatistic: data.result,
                    loading: false, refreshing: false,
                    totalRevenue, totalCost,
                    orderStatisticChart: {
                        ...this.state.orderStatisticChart,
                        showChart: true,
                        xAxis: {
                            ...this.state.orderStatisticChart.xAxis,
                            valueFormatter: [...orderStatistic.map(item => moment(item.tradingDate, "DD-MM-YYYY").format("DD-MM")), '']
                        },
                        data: {
                            ...this.state.orderStatisticChart.data,
                            dataSets: [
                                {
                                    label: I18n.t('revenue'),
                                    values: [...orderStatistic.map(item => item.total), 0],
                                    config: {
                                        color: processColor(NEW_COLORS.GREEN),
                                        drawValues: false,
                                        xEntrySpace: 0,
                                    }
                                },
                                {
                                    label: I18n.t('expense'),
                                    values: [...orderStatistic.map(item => item.cost), 0],
                                    config: {
                                        color: processColor(NEW_COLORS.ORANGE),
                                        drawValues: false,
                                        xEntrySpace: 10
                                    }
                                },
                            ]
                        }
                    }
                }, () => {
                    setTimeout(() => {
                        this.orderChart && this.orderChart.moveViewToX(1000)
                    }, 100)
                })
            } else {
                this.setState({ loading: false, refreshing: false })
            }
        })

        getTotalPaidOrderByMethod(merchantId, this.state.startTime.unix(), this.state.endTime.unix(), (err, data) => {
            console.log('getTotalPaidOrderByMethod err', err)
            console.log('getTotalPaidOrderByMethod data', data)
            if (data && data.updated) {
                this.setState({ totalPay: data.updated })
            }
        })

        getProductReport(this.state.startTime.unix(), this.state.endTime.unix(), (err, data) => {
            console.log('getProductReport err', err)
            console.log('getProductReport data', data)
        })
        getTransactionReport(this.state.startTime.unix(), this.state.endTime.unix(), (err, data) => {
            console.log('getTransactionReport err', err)
            console.log('getTransactionReport data', data)
            if (data && data.result && Array.isArray(data.result)) {
                const orderNumberInfo = data.result
                const totalTransaction = orderNumberInfo.map(item => item.waitPayment + item.completed).reduce((a, b) => a + b, 0)
                console.log('orderNumberInfo', orderNumberInfo)
                this.setState({
                    orderNumberInfo,
                    totalTransaction,
                    orderNumberChart: {
                        ...this.state.orderNumberChart,
                        showChart: true,
                        xAxis: {
                            ...this.state.orderNumberChart.xAxis,
                            valueFormatter: [...orderNumberInfo.map(item => moment(item.forDate, "DD-MM-YYYY").format("DD-MM")), '']
                        },
                        data: {
                            ...this.state.orderNumberChart.data,
                            dataSets: [
                                {
                                    label: I18n.t('paid_order'),
                                    values: [...orderNumberInfo.map(item => item.completed), 0],
                                    config: {
                                        color: processColor(NEW_COLORS.GREEN),
                                        drawValues: false,
                                        xEntrySpace: 0,
                                    }
                                },
                                {
                                    label: I18n.t('waiting_order'),
                                    values: [...orderNumberInfo.map(item => item.waitPayment), 0],
                                    config: {
                                        color: processColor(NEW_COLORS.ORANGE),
                                        drawValues: false,
                                        xEntrySpace: 10
                                    }
                                },
                            ]
                        }
                    }
                })
            }
        })
    }

    componentDidFocus = () => {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }
        this.setState({
            startTime: moment().subtract(7, 'days').startOf('day'),
            endTime: moment().endOf('day'),
        }, () => {
            this._load()
        })
    }

    _handlePressBar = (props) => {
        this.setState({ selectedPeriod: props.datum.tradingDate })
    }

    _handleChangePeriod = (period) => {
        console.log('Period', period)
        if (this.state.currentViewPeriod != period.value) {
            const startTime = (period.value == 'week') ?
                moment().subtract(7, 'days').startOf('day') : moment().subtract(30, 'days').startOf('day')
            const endTime = moment().endOf('day')
            this.setState({ currentViewPeriod: period.value, startTime, endTime }, () => {
                this._load()
            })
        }
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

    _handleChangeStartDate = (newStartDate) => {
        console.log('_handleChangeStartDate', newStartDate)
        this.setState({ startTime: newStartDate }, () => {
            if (this.state.startTime < this.state.endTime) {
                this._load()
            }
        })
    }

    _handleChangeEndDate = (newEndDate) => {
        console.log('_handleChangeEndDate', newEndDate)
        this.setState({ endTime: newEndDate }, () => {
            if (this.state.startTime < this.state.endTime) {
                this._load()
            }
        })
    }

    _renderBarChartPlaceholder = () => {
        return (
            <View className='row-center'>
                <View className='column-center pv16' style={{ width: getWidth(310) }}>
                    <View className='row-center' style={{ position: 'absolute', top: 57 }}>
                        <Text className='bold gray center'>{I18n.t('no_report_data')}</Text>
                    </View>
                    <Image source={require('~/src/image/chart_placeholder.png')}
                        style={{ width: getWidth(306), height: getWidth(144) }}
                    />
                </View>
            </View>
        )
    }

    _handlePressViewAllProduct = () => {
        console.log('_handlePressViewAllProduct')
        this.props.navigation.navigate('TopProductList', {
            startTime: this.state.startTime.unix(),
            endTime: this.state.endTime.unix()
        })
    }

    render() {
        const { topProduct } = this.props
        return (
            <Container>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                >

                    <DateRangePicker
                        startDate={this.state.startTime}
                        endDate={this.state.endTime}
                        onChangeStartDate={this._handleChangeStartDate}
                        onChangeEndDate={this._handleChangeEndDate}
                        visible={true}
                        visibleButtonClear={false}
                    />

                    <View style={SURFACE_STYLES.seperator16} />
                    <View style={{ paddingHorizontal: 24 }}>
                        <View style={{ paddingTop: 16 }}>
                            <Text style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.5)' }}>
                                THU CHI
                            </Text>
                        </View>
                        {!!this.state.orderStatisticChart.showChart && (this.state.totalRevenue + this.state.totalCost > 0) ?
                            <BarChart
                                style={{ height: 200 }}
                                data={this.state.orderStatisticChart.data}
                                xAxis={this.state.orderStatisticChart.xAxis}
                                yAxis={this.state.orderStatisticChart.yAxis}
                                legend={this.state.orderStatisticChart.legend}
                                marker={this.state.orderStatisticChart.marker}
                                animation={{ durationX: 500 }}
                                drawBarShadow={false}
                                drawValueAboveBar={true}
                                drawHighlightArrow={false}
                                visibleRange={{ x: { min: 6, max: 7 } }}
                                scaleYEnabled={false}
                                chartDescription={{ text: '' }}
                                highlightPerTapEnabled={true}
                                onSelect={this._handleSelectBar}
                                ref={ref => this.orderChart = ref}
                            />
                            :
                            this._renderBarChartPlaceholder()
                        }
                    </View>
                    <View style={SURFACE_STYLES.seperator16} />

                    <View style={[SURFACE_STYLES.rowStart, { paddingHorizontal: 24, paddingVertical: 16, backgroundColor: NEW_COLORS.WHITE }]}>
                        <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: 'rgba(0, 0, 0, 0.1)' }}>
                            <Text style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.5)' }}>
                                {I18n.t('total_revenue').toUpperCase()}
                            </Text>
                            <Text style={{ paddingTop: 8, fontSize: 18, lineHeight: 28, fontWeight: 'bold', color: NEW_COLORS.GREEN }}>
                                {this.state.totalRevenue ? formatMoney(this.state.totalRevenue) : '--'}
                            </Text>

                        </View>

                        <View style={{ flex: 1, paddingLeft: 24 }}>
                            <Text style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.5)' }}>
                                {I18n.t('total_cost').toUpperCase()}
                            </Text>
                            <Text style={{ paddingTop: 8, fontSize: 18, lineHeight: 28, fontWeight: 'bold', color: NEW_COLORS.ORANGE }}>
                                {this.state.totalCost ? formatMoney(this.state.totalCost) : '--'}
                            </Text>

                        </View>
                    </View>
                    <View style={SURFACE_STYLES.seperator16} />

                    <View style={{ paddingHorizontal: 24 }}>
                        <View style={{ paddingTop: 16 }}>
                            <Text style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.5)' }}>
                                {I18n.t('number_order').toUpperCase()}
                            </Text>
                        </View>
                        {!!this.state.orderNumberChart.showChart && (this.state.totalTransaction > 0) ?
                            <BarChart
                                style={{ height: 200 }}
                                data={this.state.orderNumberChart.data}
                                xAxis={this.state.orderNumberChart.xAxis}
                                yAxis={this.state.orderNumberChart.yAxis}
                                legend={this.state.orderNumberChart.legend}
                                marker={this.state.orderNumberChart.marker}
                                animation={{ durationX: 500 }}
                                drawBarShadow={false}
                                drawValueAboveBar={true}
                                drawHighlightArrow={false}
                                visibleRange={{ x: { min: 6, max: 7 } }}
                                scaleYEnabled={false}
                                chartDescription={{ text: '' }}
                                highlightPerTapEnabled={true}
                                onSelect={this._handleSelectBar}
                                ref={ref => this.orderNumberChart = ref}
                            />
                            :
                            this._renderBarChartPlaceholder()
                        }
                    </View>
                    <View style={SURFACE_STYLES.seperator16} />



                    <View style={{ paddingHorizontal: 24, backgroundColor: NEW_COLORS.WHITE }}>
                        <View className='row-start pt16 pb12'>
                            <Text className='gray s12 flex'>
                                {I18n.t('top_sale_product').toUpperCase()}
                            </Text>
                            {(topProduct && topProduct.length > 10) &&
                                <TouchableOpacity onPress={this._handlePressViewAllProduct}>
                                    <View className='row-start'>
                                        <Text className='gray s12'>{I18n.t('view_all')}</Text>
                                        <Image
                                            source={require('~/src/image/chevron_right_gray.png')}
                                            style={styles.forwardArrow}
                                        />
                                    </View>
                                </TouchableOpacity>
                            }

                        </View>

                        {(topProduct && topProduct.length > 0) ?
                            <FlatList
                                data={topProduct.slice(0, 10)}
                                renderItem={this._renderTopProductItem}
                                keyExtractor={item => item.productId}
                                ListFooterComponent={<View style={{ height: 50 }} />}
                            />
                            :
                            <View className='row-center pv24 ph18'>
                                <Text className='gray center bold'>{I18n.t('no_report_data')}</Text>
                            </View>
                        }
                    </View>
                </ScrollView>
            </Container>
        );
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
    topProduct: topProductListSelector(state)
}), { getOrderStatistic, getTotalPaidOrderByMethod, getProductReport, getTransactionReport })(Chart)
