const initialState = {
    bluetoothDevices: {}
}

export default printer = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'printer/saveBluetoothPrinter': {
            console.log('saveBluetoothPrinter payload', payload)
            if (!payload){
                return initialState
            }
            return {
                ...state,
                bluetoothDevices: {
                    id: payload.id,
                    localName: payload.localName,
                    name: payload.name
                }
            }
        }
        case 'app/logout': {
            return initialState
        }
        default:
            return state
    }
}