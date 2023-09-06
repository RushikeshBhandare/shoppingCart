const INITIAL_STATE = {
    cart: []
}

const cartReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'ADD_TO_BASKET': 
            return {...state, cart: action.payload}
        case 'ADD_QTY': 
            return {...state, cart: action.payload}
        case 'REMOVE_QTY': 
            return {...state, cart: action.payload}
         default: return state;

    }

};

export default cartReducer