import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    console.log('Route Name, params', { routeName, params })
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

function goBack(key = null) {
    _navigator.dispatch(
        NavigationActions.back({
            key: key,
        })
    )
}

function dispatch(action) {
    _navigator.dispatch(action)
}
// add other navigation functions that you need and export them

export default {
    navigate,
    setTopLevelNavigator,
    goBack,
    dispatch
}