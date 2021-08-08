import {createSlice, configureStore} from '@reduxjs/toolkit';

const appSlice = createSlice({
    name:'eskp_store',
    initialState:{
        count:0,
        //currently showing station type (1 = diesel, 2 = gas)
        stationsInView:1,
        //currently showing stations display type (1 = MapView, 2 = ListView )
        stationsDisplayType:1,
        //resource data (null = 'loading', [data] = 'loaded', false = 'encountered error')
        stationsData:null,
        //fuel display type preference (1 = diesel, 2 = gasoline, 3 = gasoline&diesel)
        fuelTypePreference:3,
        //sorting prameter (1 = Price, 2 = Distance)
        sortingParameter:1,
        //user current latLng position
        userPosition:null,
        tokens:null,
        loginDetails:null
    },
    reducers:{
        incrementCount: (state) => {
            state.count++
        },
        decrementCount: (state) => {
            state.count--
        },
        updateTokens: (state, tokens) => {
            state.tokens = tokens.payload
        },
        updateLoginCreds: (state, creds) => {
            state.loginDetails = creds.payload
        }
    }
});

export const {incrementCount, decrementCount, updateTokens, updateLoginCreds} = appSlice.actions;

const store = configureStore({
    reducer:appSlice.reducer
});

export default store