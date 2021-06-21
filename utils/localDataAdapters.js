//storage helper packages
import AsyncStorage from '@react-native-async-storage/async-storage';
import {encrypt, decrypt} from '../utils/cryptor';

//data retriever
async function retrieveData(storeKey, decryptData = true) {
    try {   
        const data = await AsyncStorage.getItem(storeKey);
        
        if(data == null) return null
        let decrypted = JSON.parse(decryptData ? decrypt(data) : data);
        return decrypted

    } catch (error) {
        // There was an error on the native side
        return false
    }
}

//data persistor
async function storeData(storeKey, data, encryptData = true) {
    try {
        await AsyncStorage.setItem(
            storeKey,
            encryptData ? encrypt(JSON.stringify(data)) : JSON.stringify(data)
        );
        //data stored
        return true
    } catch (error) {
        // There was an error on the native side
        return false
        // Alert.alert(
        //     "Couldn't save stations data",
        //     error.message
        // )
    }
}

export {storeData,retrieveData}