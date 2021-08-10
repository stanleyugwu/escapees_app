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
        userStatus:'guest',
        userAuthenticated:false,
        genericLoginDetails:{
            email:'stanleyugwu2018@gmail.com',
            password:'66413705'
        },
        userLoginDetails:null,
        authTokens:null,
    },
    reducers:{
        incrementCount: (state) => {
            state.count++
        },
        decrementCount: (state) => {
            state.count--
        },
        updateAuthTokens: (state, tokens) => {
            state.authTokens = tokens.payload
        },
        updateUserLoginDetails: (state, creds) => {
            state.userLoginDetails = creds.payload;
        },
        updateUserStatus:(state, status) => {
            var status = status.payload;
            state.userStatus = (status == 'member' || status == 'guest') ? status : state.userStatus
        },
        signInUser: (state) => {
            state.userAuthenticated = true
        }
    }
});

export const {
    incrementCount, 
    decrementCount, 
    updateAuthTokens, 
    updateUserLoginDetails, 
    updateUserStatus,
    signInUser
} = appSlice.actions;

const store = configureStore({
    reducer:appSlice.reducer
});

export default store