import { combineReducers } from 'redux';
import { home } from '~/src/store/reducers/home';
import { auth } from '~/src/store/reducers/auth'
import { merchant } from '~/src/store/reducers/merchant'
import { product } from '~/src/store/reducers/product'
import { order } from '~/src/store/reducers/order'
import { notification } from '~/src/store/reducers/notification'
import { table } from '~/src/store/reducers/table'
import { permission } from '~/src/store/reducers/permission'
// import { toast } from '~/src/store/reducers/toast'
import { info } from '~/src/store/reducers/info'
import { menu } from '~/src/store/reducers/menu'
import printer from '~/src/store/reducers/printer'
import supplier from '~/src/store/reducers/supplier'
import { costManage } from '~/src/store/reducers/costManage'
import setting from '~/src/store/reducers/setting'
import { debtManage } from '~/src/store/reducers/debtManage'
import report from '~/src/store/reducers/report'

const rootReducer = combineReducers({
    home,
    auth,
    merchant,
    product,
    order,
    notification,
    table,
    permission,
    // toast,
    info,
    menu,
    printer,
    supplier,
    costManage,
    setting,
    debtManage,
    report
});

export default rootReducer;