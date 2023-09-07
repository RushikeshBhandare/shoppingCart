import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addQty, addToBasket, getAllProducts, getCartItems, removeQty } from '../../Store/Actions/cartActions'

const HomeScreen = () => {
    const [productList, setProductList] = useState([])
    const [totalPrice, setTotalPrice] = useState({})
    const basketList = useSelector((state) => state?.cartReducer?.cart)
    const [isLoading, setIsloading] = useState(true)
    const dispatch = useDispatch()

    useEffect(()=> {
        getProducts()
    }, [])

    useEffect(()=> {
        let subTotal = 0
        let saving = 0
        if(basketList?.length > 0) {
            basketList?.forEach((item)=> {
                subTotal += (item?.price * item?.qty)
                saving += item?.saving
            })
            let totalAmount = subTotal - saving
            setTotalPrice({
                subTotal,
                saving,
                totalAmount
            })
        }
        
    }, [basketList])

    const getProducts = async () => {
        try {
            setIsloading(true)
            const list  = await getAllProducts()
            setProductList(list)
            await getCartItems(dispatch) 
            setIsloading(false)
        }catch(e){
            setIsloading(false)
            console.log("error ", e);
        }
    }


    const onClickAdd = (item) => {
        dispatch(addToBasket({...item, qty: 1}))
    }

    const onPressAdd = (item) => {
        dispatch(addQty(item))
    }

    const onPressRemove = (item) => {
        dispatch(removeQty(item))
    }

    const renderProductItem = (item) => {
        const isDisabled = basketList?.length > 0 && basketList?.find((val) => val?.id === item?.id)
        return (
            <div style={styles.productItemContainer}>
                <p style={styles.productItemName}>{item?.name}</p>
                <p style={styles.productItemPrice}>£{item?.price}</p>
                <button disabled={isDisabled} onClick={() => onClickAdd(item)} style={!isDisabled ? styles.addBtn : styles.addBtnDisabled}>Add</button>
            </div>
        )
    }

    const renderProducts = () => {
        return (
            <div style={styles.productsMainContainer}>
                <h1 style={styles.titile}>Products</h1>
                {
                    productList?.map((item)=> {
                        return renderProductItem(item)

                    })
                }
            </div>
        )
    }

    const rendetBasketItem = (item) => {
        return (
            <div style={styles.basketItem}>
                <div style={styles.basketItemContainer}>
                    <p style={styles.productItemName}>{item?.name}</p>
                    <p style={styles.productItemName}>{item?.price}</p>
                    <div style={styles.basketItemBtnContainer}>
                        <button onClick={() => onPressRemove(item)} style={styles.minusBtn}>-</button>
                        <p style={styles.countText}>{item?.qty}</p>
                        <button onClick={() => onPressAdd(item)} style={styles.plusBtn}>+</button>
                    </div>
                </div>
                <p style={styles.priceCalText}>Item price £{item?.price} * {item?.qty} = £{(item?.price * item?.qty)?.toFixed(2)}</p>
                {
                    !!item?.saving && <p style={styles.savingText}>Saving £{item?.saving?.toFixed(2)}</p>
                }
                <p style={styles.itemCost}>Item cost £{item?.itemCost?.toFixed(2)}</p>
            </div>
        )
    }

    const renderBasket = () => {
        return(
            <div style={styles.basketMainContainer}>
                <h1 style={styles.titile}>Basket</h1>
                {
                    basketList?.map((item)=> {
                        return rendetBasketItem(item)
                    })
                }
                {renderTotalAmount()}
            </div>
        )
    }

    const renderTotalAmount = () => {
        return (
            <div>
                <div style={styles.totalContainer}>
                    <p style={styles.productItemPrice}>Sub Total: </p>
                    <p>  £ {totalPrice?.subTotal?.toFixed(2)}</p> 
                </div>
                <div style={styles.totalContainer}>
                    <p style={styles.productItemPrice}>Savings:: </p>
                    <p> £ {totalPrice?.saving?.toFixed(2)}</p> 
                </div>
                <div style={styles.totalContainer}>
                    <p style={styles.productItemPrice}>Total Amount: </p>
                    <p>  £ {totalPrice?.totalAmount?.toFixed(2)}</p> 
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div style={styles.rootContainer}>
                loading...
            </div>
        )
    }

  return (
    <div style={styles.rootContainer}>
        {renderProducts()}
        { basketList?.length > 0 && renderBasket()}
    </div>
  )
}

const styles = {
    rootContainer: {
        backgroundColor: '#c5ccd6',
        display: 'flex',
        flex: 1,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    titile: {
        fontSize: 24,
        fontWeight: 'bold',
        borderBottom: "1px solid rgb(212, 212, 212)"

    },
    productsMainContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        margin: 10
    },
    productItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: 400,
        alignItems: 'center',
        borderBottom: "1px solid rgb(212, 212, 212)",
        padding: 10
    },
    productItemName: {
        fontSize: 18,
        display: 'flex',
        flex: 1
    },
    productItemPrice: {
        fontSize: 18,
        padding: 10,
        flex: 1
    },
    addBtn: {
        backgroundColor: '#7ab0fa',
        borderRadius: 5,
        fontSize: 16,
        padding: 10,
        color: '#fff'
    },
    addBtnDisabled: {
        backgroundColor: 'gray',
        borderRadius: 5,
        fontSize: 16,
        padding: 10,
        color: '#fff'
    },
    basketMainContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        margin: 10
    },
    basketItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: 400,
        alignItems: 'center',
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 10,
    },
    basketItemBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    plusBtn: {
        backgroundColor: '#7ab0fa',
        padding: 10,
        borderRadius: 5,
        color: '#fff',
        fontSize: 18
    },
    minusBtn: {
        border: "1px solid rgb(212, 212, 212)",
        padding: 10,
        borderRadius: 5,
        fontSize: 18
    },
    countText: {
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 18
    },
    priceCalText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'right',
        padding: 5
    },
    itemCost: {
        fontSize: 16,
        textAlign: 'right',
        padding: 5
    },
    savingText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'right',
        padding: 5
    },
    basketItem: {
        borderBottom: "1px solid rgb(212, 212, 212)"
    },
    totalContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
}

export default HomeScreen