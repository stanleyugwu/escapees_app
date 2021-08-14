import {createSlice, configureStore} from '@reduxjs/toolkit';

const appSlice = createSlice({
    name:'eskp_store',
    initialState:{
        //currently showing station type (1 = diesel, 2 = gas)
        stationsInView:2,
        //currently showing stations display type (1 = MapView, 2 = ListView )
        stationsDisplayType:1,
        //resource data (null = 'loading', [data] = 'loaded', false = 'encountered error')
        stationsData:null,
        preferences: {
            "fuelPrice": "midgrade",
            "fuelType": "gasAndDiesel",
            "fuelUnit": "pricePerGallon",
        },
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
        updateStationsInView: (state, stationNum) => {
            state.stationsInView = stationNum.payload;
        },
        updateStationsData: (state, data) => {
            state.stationsData = data.payload;
        },
        updatePreferences: (state, preferenceObj) => {
            state.preferences = {...state.preferences,...preferenceObj.payload};
        },
        updateSortingParameter: (state, sortParameter) => {
            state.sortingParameter = sortParameter.payload;
        },
        updateUserPosition: (state, pos) => {
            state.userPosition = pos.payload;
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
        },
        signOutUser: (state) => {
            state.userAuthenticated = false
        }
    }
});

export const {
    incrementCount, 
    decrementCount,
    updateStationsInView,
    updateStationsData,
    updatePreferences,
    updateSortingParameter,
    updateUserPosition,
    updateAuthTokens, 
    updateUserLoginDetails, 
    updateUserStatus,
    signInUser,
    signOutUser
} = appSlice.actions;

const store = configureStore({
    reducer:appSlice.reducer
});

export default store