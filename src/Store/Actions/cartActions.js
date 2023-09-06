import { collection, doc, getDocs, updateDoc } from "firebase/firestore/lite";
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
    console.log("loist ", list );
    const offer = checkOffer(data, list?.length !== 0 ? [...list, data] : [data])
    
    return {
        type: 'ADD_TO_BASKET',
        payload: offer
    };
}

export const addQty = (data) => {
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
    return {
        type: 'REMOVE_QTY',
        payload: offer
    };
}

const checkOffer = (product, list ) => {
    if(list?.length === 0 ) {
        return
    }
    switch(product.offerId) {
      case 1: {
        
        const cartData = list?.find((item)=> item?.id === product?.id)
        if(cartData?.qty === 1) {
            return updateValue(list, product, 0)
        }
        if(cartData?.qty % 2 === 0) {
            return updateValue(list, product, product?.price * (cartData?.qty/2))
        } else {        
            return updateValue(list, product, product?.price * ((cartData?.qty - 1)/2))
        }
      }
      case 2: {
        const hasItem = list?.some((item) => Number(item?.id) === Number(product?.prodcutRefIId))
          if(hasItem) {
            return updateValue(list, product, (product?.price / 2) * Math.floor(product?.qty))
          }
        return  updateValue(list, product, 0)
      }
      case 3: {
        return  updateValue(list, product, (product?.price / 3) * Math.floor(product?.qty))
      }
      default: {
        return updateValue(list, product, 0)
      }
    }
  };

  const updateValue = (list, data, saving) => {
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
        uploadToFirebase(newList)
        return newList
    }
    
    const uploadToFirebase = async (newList) => {
        try{
        const docRef = doc(db, "cart", '01');
        const sucess = await updateDoc(docRef, {cartItem: newList})
        console.log("success", sucess);

    }catch(e){
        console.log("erro ", e);
    }
  }