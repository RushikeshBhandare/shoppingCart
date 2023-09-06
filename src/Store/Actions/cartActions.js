import { collection, getDocs } from "firebase/firestore/lite";
import db from "../../Helper/Firebase";
import store from "../store";


export const getAllProducts = async() => {
    try {
        const citiesCol = collection(db, 'products');
        const productSnapshot = await getDocs(citiesCol);
        const products = productSnapshot.docs.map(doc => doc.data());
        return products 
    } catch(e){
        console.log("error ",e );
    }
}

export const addToBasket = (data) => {
    const list = store.getState()?.cartReducer?.cart
    console.log("action", list);
    const offer = checkOffer(data, list ? [...list, data] : [data])
    console.log("offer ", offer);
    
    return {
        type: 'ADD_TO_BASKET',
        payload: offer
    };
}

export const addQty = (data) => {
    console.log("store ", store.getState());
    const list = store.getState()?.cartReducer?.cart
    const newList = list?.map((item)=> {
        if(data?.id === item?.id) {
            return {
                ...item,
                qty: item?.qty + 1
            }
        }
        return item
    })
    const offer = checkOffer({...data, qty: data?.qty + 1}, newList)
    console.log("offer ", offer);
    return {
        type: 'ADD_QTY',
        payload: offer
    };
}


export const removeQty = (data) => {
    const list = store.getState()?.cartReducer?.cart
    const newList = list?.map((item)=> {
        if(data?.id === item?.id) {
            return {
                ...item,
                qty: item?.qty - 1
            }
        }
        return item
    })

    const filterdList = newList?.filter((item) => item?.qty > 0)
    const offer = checkOffer({...data, qty: data?.qty -1}, filterdList)
    console.log("offer ", offer);
    return {
        type: 'REMOVE_QTY',
        payload: offer
    };
}

const checkOffer = (product, list ) => {
    // const list = store.getState()?.cartReducer?.cart
    console.log("product ", product);
    if(list?.length === 0 ) {
        return
    }
    switch(product.offerId) {
      case 1: {
        
        const cartData = list.find((item)=> item?.id === product?.id)
        if(cartData?.qty === 1) {
            return updateValue(list, product, 0)
          return 0  
        }
        if(cartData?.qty % 2 === 0) {
            return updateValue(list, product, product?.price * (cartData?.qty/2))
          return product.price * (cartData?.qty/2)
        } else {        
            return updateValue(list, product, product?.price * ((cartData?.qty - 1)/2))
          return product.price * ((cartData.qty - 1)/2)
        }
      }
      case 2: {
        // if(product.isDepend) {
          const hasItem = list.some((item) => Number(item?.id) === Number(product?.prodcutRefIId))
          if(hasItem) {
            return updateValue(list, product, (product?.price / 2) * Math.floor(product?.qty))
            return (product.salePrice / 2) * Math.floor(product.quantity);
          }
          // const data1 = cartItems.find((item) => item.isDepend === true)
          // const data2 = cartItems.find((item) => item?.productId === product.dependentProduct?.productId)
            
          // if(hasItem && data1?.quantity === data2?.quantity ) {
          //   return (product.salePrice / 2) * Math.floor(product.quantity);
          // } else if(hasItem ){
          //   return (product.salePrice / 2) * Math.floor(data2?.quantity);
          // }
        // } else {
        //     return updateValue(list, product, (product?.price / 2) * Math.floor(product?.qty))
        //   return (product.salePrice / 2) * Math.floor(product.quantity);
        // }
        return  updateValue(list, product, 0)
        return 0
      }
      case 3: {
        console.log("callign ", (product?.price / 3),  Math.floor(product?.qty));
        return  updateValue(list, product, (product?.price / 3) * Math.floor(product?.qty))
        return (product.salePrice / 3) * Math.floor(product.quantity);
      }
      default: {
        return updateValue(list, product, 0)
        return 0;
      }
    }
  };

  const updateValue = (list, data, saving) => {
    console.log("saving ", saving);
    const newList = list?.map((item)=> {
        if(data?.id === item?.id) {
            return {
                ...item,
                saving,
                itemCost: (item?.price * item?.qty) - saving
            }
        }
        return item
    })

    console.log("nwe saving list ", newList);
    return newList
  }