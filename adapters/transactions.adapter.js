// const req = require('follows-redirect').http
const TOKEN_ENDPOINT = 'http://cportal.mdshosted.com/api/1.0/mobile/getCustomerTransactions';




const getTransactions = (accessToken) => {

    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", `Bearer ${accessToken}`);
    // myHeaders.append("Cookie", "SPSI=c96969f66c4ed968db460cea89cadff4; SPSE=ZP9Bvi6SvS4EPzGi3bbkyvUyzrJpVudk4b9wIzbmDc8HbovoO/+VsFk9ubNF/m2xz4cuh6wM6OZ3+scsJb+rDg==");

    var requestOptions = {
        method: 'GET',
        headers: {
            'Authorization':'Bearer '+accessToken,
            'mode':'cors'
        },
        redirect: 'follow'
    };

    var result = null;

    return fetch(TOKEN_ENDPOINT, requestOptions)
    // .then(res => {
    //     console.log(res.ok)
    //     // if(res.ok) return res.json()
    //     // else throw Error('error')
    // })
    // .then(transactions => {
    //     console.log(transactions)
    //     // if(transactions && transactions instanceof Array) result = transactions
    //     // else throw Error('error')
    // })
    // .catch(error => {
    //     console.log('error',error)
    //     // if(error.message == 'error') result = false//request error
    //     // else result = null//network error
    // });

    // return result
}

export default getTransactions