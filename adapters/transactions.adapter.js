// const req = require('follows-redirect').http
const TOKEN_ENDPOINT = 'https://cportal.mdshosted.com/api/1.0/mobile/getCustomerTransactions';

const getTransactions = async (accessToken) => {

    var requestOptions = {
        method: 'GET',
        headers: {
            "Authorization":`Bearer ${accessToken}`
        },
        redirect: 'follow'
    };

    var result = null;//transactions

    await fetch(TOKEN_ENDPOINT, requestOptions)
    .then(res => {
        if(res.ok) return res.json()
        else throw Error('error')
    })
    .then(transactions => {
        if(transactions && transactions instanceof Array) result = transactions
        else throw Error('error')
    })
    .catch(error => {
        if(error.message == 'error') result = false//request error
        else result = null//network error
    });

    return result
}

export default getTransactions