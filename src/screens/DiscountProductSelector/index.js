import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { activeProductMenuSelector } from '~/src/store/selectors/menu'
import { tempMenuProductSelector } from '~/src/store/selectors/menu'
import { setTempMenuProduct } from '~/src/store/actions/menu'
import ProductSelector from '~/src/components/ProductSelector'
import I18n from '~/src/I18n'

class DiscountProductSelector extends PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        const selectedProduct = props.navigation.getParam('selectedProduct', [])
        this.state = {
            selectedProduct,
        }
    }

    _handlePressSave = (selectedProduct) => {
        const callback = this.props.navigation.getParam('callback')
        this.props.navigation.goBack()
        callback && callback(selectedProduct)
    }

    render() {
        const { productMenu } = this.props
        return (
            <Container>
                <ProductSelector
                    productMenu={productMenu}
                    buttonRightText={I18n.t('confirm')}
                    onSave={this._handlePressSave}
                    selectedProduct={this.state.selectedProduct}
                    navigation={this.props.navigation}
                />
            </Container>
        )
    }
}

export default connect((state, props) => {
    return {
        productMenu: activeProductMenuSelector(state),
        tempMenuProduct: tempMenuProductSelector(state)
    }
}, {
        setTempMenuProduct
    })(DiscountProductSelector)