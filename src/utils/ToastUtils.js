let _successToast;
let _errorToast;
let _notAvailableWhenOffline;
let _forceUpdate;

const setForceUpdateRef = (ref) => {
    _forceUpdate = ref
}

const setNotAvailableWhenOfflineToastRef = (ref) => {
    _notAvailableWhenOffline = ref
}

const setSuccessToastRef = (ref) => {
    _successToast = ref;
}

const showSuccessToast = (text) => {
    _successToast.show(text)
}


const setErrorToastRef = (ref) => {
    _errorToast = ref;
}

const showErrorToast = (text) => {
    _errorToast.show(text)
}

const showNotAvailableWhenOfflineToast = () => {
    _notAvailableWhenOffline.show()
}

const showForceUpdate = () => {
    _forceUpdate.show()
}

const hideForceUpdate = () => {
    _forceUpdate.hide()
}

export default {
    setSuccessToastRef,
    showSuccessToast,
    setErrorToastRef,
    showErrorToast,
    setNotAvailableWhenOfflineToastRef,
    showNotAvailableWhenOfflineToast,
    setForceUpdateRef,
    showForceUpdate,
    hideForceUpdate
}