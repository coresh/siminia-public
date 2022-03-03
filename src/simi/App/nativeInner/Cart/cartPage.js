import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {Check} from 'react-feather';
import {useCartPage} from '@magento/peregrine/lib/talons/CartPage/useCartPage';
import {useStyle} from '@magento/venia-ui/lib/classify';
import {useToasts} from '@magento/peregrine';
import Icon from '@magento/venia-ui/lib/components/Icon';
import {StoreTitle} from '@magento/venia-ui/lib/components/Head';
import {fullPageLoadingIndicator} from '@magento/venia-ui/lib/components/LoadingIndicator';
import {PriceAdjustments} from './PriceAdjustments';
import {PriceSummary} from './PriceSummary';
import defaultClasses from '../../core/Cart/cartPage.module.css';
import defaultClasses_1 from './cartPage.module.css';
import Image from "@magento/venia-ui/lib/components/Image";
import {RedButton} from "./RedButton";
import {ProductListingWithBrandSeparation} from "./ProductListingWithBrandSeparation";
import {useBottomNotification} from "./bottomNotificationHook";
import LoadingBridge from "./LoadingBridge/LoadingBridge";
import {useLoading} from "./loadingHook/useLoading";
import HeightPad from "./HeightPad/heightPad";
import SimpleHeader from "./SimpleHeader/simpleHeader";

const CheckIcon = <Icon size={20} src={Check}/>;

/**
 * Structural page component for the shopping cart.
 * This is the main component used in the `/cart` route in Venia.
 * It uses child components to render the different pieces of the cart page.
 *
 * @see {@link https://venia.magento.com/cart}
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides for the component.
 * See [cartPage.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/cartPage.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CartPage from "@magento/venia-ui/lib/components/CartPage";
 */
const CartPage = props => {

    const talonProps = useCartPage();
    const {history} = props;
    const {
        cartItems,
        hasItems,
        isCartUpdating,
        fetchCartDetails,
        onAddToWishlistSuccess,
        setIsCartUpdating: _setIsCartUpdating,
        shouldShowLoadingIndicator,
        wishlistSuccessProps,
    } = talonProps;

    const classes = useStyle(defaultClasses, defaultClasses_1, props.classes);
    const {formatMessage} = useIntl();
    const [, {addToast}] = useToasts();

    const {
        component: notiComponent,
        makeNotification
    } = useBottomNotification()

    const {
        component: loadingComponent,
        setLoading
    } = useLoading()

    const setIsCartUpdating = useCallback((v) => {
        setLoading(v)
        _setIsCartUpdating(v)
    }, [setLoading, _setIsCartUpdating])

    const [displayOutOfStockLabel, _setDisplayOutOfStockLabel] = useState(false)

    const setDisplayOutOfStockLabel = (v) => {
        if (v !== displayOutOfStockLabel) {
            _setDisplayOutOfStockLabel(v)
        }
    }

    useEffect(() => {
        if (wishlistSuccessProps) {
            addToast({...wishlistSuccessProps, icon: CheckIcon});
        }
    }, [addToast, wishlistSuccessProps]);

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    const productListing = hasItems ? (
        <ProductListingWithBrandSeparation
            onAddToWishlistSuccess={onAddToWishlistSuccess}
            setIsCartUpdating={setIsCartUpdating}
            fetchCartDetails={fetchCartDetails}
            history={history}
            setDisplayOutOfStockLabel={setDisplayOutOfStockLabel}
            setLoading={setLoading}
            makeNotification={makeNotification}
        />
    ) : (
        <h3>
            <FormattedMessage
                id={'cartPage.noItems'}
                defaultMessage={'You have no items in your shopping cart.'}
            />
        </h3>
    );

    const priceAdjustments = hasItems ? (
        <PriceAdjustments setIsCartUpdating={setIsCartUpdating}
                          makeNotification={makeNotification}/>
    ) : null;

    const priceSummary = hasItems ? (
        <PriceSummary isUpdating={isCartUpdating}/>
    ) : null;

    // will use this in header
    const totalQuantity = cartItems.length ? (
        cartItems.reduce((total, item) => {
            return total + item.quantity
        }, 0)) : 0

    const outOfStockLabel = displayOutOfStockLabel ? (
        <div className={classes.topOutOfStockContainer}>
            <span className={classes.stockText}>
                    <span className={classes.stockTextNote}>
                        <FormattedMessage
                            id={'cartPage.stockTextNote'}
                            defaultMessage={'Note'}
                        />:
                    </span>
                <span className={classes.stockTextContent}>
                    <FormattedMessage
                        id={'cartPage.stockTextContent'}
                        defaultMessage={'A product is out of stock in the cart'}
                    />
                </span>
            </span>
        </div>
    ) : null

    const cartBody = hasItems ? (
        <Fragment>
            <div className={classes.heading_container}>

                {/*<h1 className={classes.heading}>*/}
                {/*    <FormattedMessage*/}
                {/*        id={'cartPage.headingCart'}*/}
                {/*        defaultMessage={'Shopping Cart'}*/}
                {/*    />*/}
                {/*</h1>*/}
                {/*<h1 className={classes.items_count}>*/}
                {/*    {totalQuantity}*/}
                {/*</h1>*/}
                {/*<div className={classes.stockStatusMessageContainer}>*/}
                {/*    <StockStatusMessage cartItems={cartItems}/>*/}
                {/*</div>*/}
            </div>
            <div className={classes.body}>
                <div className={classes.items_container}>{productListing}</div>
                {!isCartUpdating && (<Fragment>
                    <div className={classes.price_adjustments_container}>
                        {priceAdjustments}
                    </div>
                    <div className={classes.summary_container}>
                        <div className={classes.summary_contents}>
                            {priceSummary}
                        </div>
                    </div>
                </Fragment>)}
            </div>
        </Fragment>
    ) : (
        <div className={classes.emptyBody}>
            <Image src={require('../../../../../static/images/empty-cart.png')}
                   alt={'no-cart'}
                   className={classes.emptyImage}
            />
            <h3 className={classes.noProductText}>
                <FormattedMessage
                    id={'cartNoProductText'}
                    defaultMessage={'There are no products matching'}
                />
            </h3>

            <RedButton onClick={() => history.push('/')}
                       style={{maxWidth: '16rem'}}
            >
                <FormattedMessage
                    id={'Continue Shopping'}
                    defaultMessage={'Continue Shopping'}
                />
            </RedButton>
        </div>
    )

    const cartHeader = (
        <SimpleHeader
            titleText={formatMessage({
                    id: 'cart.headTitle',
                    defaultMessage: 'Shopping Cart ({total})',
                }, {
                    total: totalQuantity
                }
            )}
        />
    )

    return (
        <Fragment>
            {outOfStockLabel}
            <div className={classes.root}>
                <StoreTitle>
                    {formatMessage({
                        id: 'cartPage.title',
                        defaultMessage: 'Cart'
                    })}
                </StoreTitle>
                {cartHeader}
                {cartBody}
                <HeightPad/>
                {loadingComponent}
                {notiComponent}
            </div>
        </Fragment>

    );
};

export default CartPage;

