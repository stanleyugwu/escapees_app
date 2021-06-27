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
        if (!mountedRef.current) return null
        if(res.ok) return res.json()
        else throw Error('error')
    })
    .then(transactions => {
        if (!mountedRef.current) return null
        if(transactions && transactions instanceof Array) result = transactions
        else throw Error('error')
    })
    .catch(error => {
        if(error.message == 'error') result = false//request error
        else result = null//network error
    });

    useEffect(() => {
        if (immediate) {
          execute(funcParams)
        }
        return () => {
          mountedRef.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    return result
}

export default getTransactions