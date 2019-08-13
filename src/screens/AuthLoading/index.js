import React, { Component } from 'react'
import { View, ActivityIndicator, Platform } from 'react-native'
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { accessTokenSelector } from '~/src/store/selectors/auth'
import { connect } from 'react-redux'
import { StackActions, NavigationActions } from 'react-navigation'
import { currentUserPermissionSelector } from '~/src/store/selectors/permission'
import { ROLES, NOTIFICATION_TYPE, ORDER_TAB, DB_VERSION } from '~/src/constants'
import { chainParse } from '~/src/utils'
import { updateOrderTab } from "~/src/store/actions/order"
import AsyncStorage from "@react-native-community/async-storage";
import initQuery from '~/src/db/query.js'
import DBManager from '~/src/db/DBManager'


class AuthLoading extends Component {

    constructor(props) {
        super(props)
        this._handleRedirect()
    }

    _handlePressNotification = (notification) => {
        console.log('_handlePressNotification', notification)
        const { accessToken, navigation } = this.props
        if (!accessToken) return
        const notificationType = chainParse(notification, ['_data', 'type'])
        if (notificationType == NOTIFICATION_TYPE.WAITING_ORDER) {
            updateOrderTab(ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY)
            navigation.navigate('OrderList')
        }
    }

    componentDidMount = async () => {
    }

    componentWillUnmount() {
    }


    _handleRedirect = () => {
        console.log('Token', this.props.accessToken)
        const { accessToken, currentUserPermission } = this.props
        console.log('currentUserPermission', currentUserPermission)
        const isEmployee = currentUserPermission && currentUserPermission[0] && currentUserPermission[0].permissionId == ROLES.SALE
        AsyncStorage.getItem('intro', (err, result) => {
            const _redirect = () => {
                const nextScreen = accessToken ? (isEmployee ? 'HomeEmployee' : 'Home') : (result == "true" ? 'Login' : 'Intro')
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: nextScreen })],
                    key: undefined
                });
                this.props.navigation.dispatch(resetAction)
            }
            const selecteTableQuery = 'SELECT name FROM sqlite_master WHERE type="table" AND name="db_version";'
            const deleteVersionQuery = 'DELETE FROM db_version'
            const insertVersionQuey = `INSERT INTO db_version(version) VALUES (${DB_VERSION});`
            const selectVersionQuery = 'SELECT version FROm db_version;'

            DBManager.getInstance()
                .then(db => {
                    const _initDBAndRedirect = () => {
                        console.log('Init query', initQuery)
                        db.sqlBatch(initQuery, (initResult) => {
                            console.log('initResult', initResult)
                            db.executeSql(deleteVersionQuery, [], delteVersionResult => {
                                console.log('delteVersionResult', delteVersionResult)
                                db.executeSql(insertVersionQuey, [], insertVersionResult => {
                                    console.log('insertVersionResult', insertVersionResult)
                                    _redirect()
                                },
                                    insertVersionErr => {
                                        console.log('insertVersionErr', insertVersionErr)
                                    })
                            }, delteVersionErr => {
                                console.log('delteVersionErr', delteVersionErr)
                            })
                        },
                            (initErr) => {
                                console.log('initErr', initErr)
                            })
                    }

                    db.executeSql(selecteTableQuery, [], (selectTableResult) => {
                        const dbVersion = selectTableResult.rows.raw()
                        console.log('Db Version', dbVersion)
                        if (!dbVersion || !dbVersion[0]) {
                            console.log('Case not have DB Version table')
                            _initDBAndRedirect()
                        } else {
                            db.executeSql(selectVersionQuery, [], selectVersionResult => {
                                console.log('selectVersionResult', selectVersionResult.rows.raw())
                                const selectVersion = selectVersionResult.rows.raw()
                                if (!selectVersion || !selectVersion[0] || selectVersion[0].version < DB_VERSION) {
                                    console.log('Case not have select version or version invalid')
                                    _initDBAndRedirect()
                                } else {
                                    console.log('Case redirect only')
                                    _redirect()
                                }

                            }, selectVersionErr => {
                                console.log('selectVersionErr', selectVersionErr)
                            })
                        }

                    }, (selectTableErr) => {
                        console.log('selectTableErr', selectTableErr)
                    })
                })
                .catch(err => {
                    console.log('Open DB Err', err)
                })
        });


    }

    render() {
        return (
            <View style={[SURFACE_STYLES.columnCenter, SURFACE_STYLES.flex]}>
                <ActivityIndicator size={Platform.OS == 'android' ? 60 : 'large'} color={COLORS.BLUE} />
            </View>
        )
    }
}

export default connect((state) => ({
    accessToken: accessTokenSelector(state),
    currentUserPermission: currentUserPermissionSelector(state)
}), { updateOrderTab })(AuthLoading)