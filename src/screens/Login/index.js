import LoginMobile from './index.mobile.js'
import LoginTablet from './index.tablet.js'
import { isTablet } from '~/src/utils'
export default isTablet() ? LoginTablet : LoginMobile
