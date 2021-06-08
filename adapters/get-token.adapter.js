import Constants from 'expo-constants';

const TOKEN_ENDPOINT = Constants.manifest.extra.token_endpoint;

const getToken = (username, password) => {
    if(!TOKEN_ENDPOINT) return 'no endpoint';

    //request headers
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Cookie", "Cookie_1=value; UTGv2=D-h41e35427b78482eaa143250e359c0aa0066; SPSI=90bb31727e73e3579080cb102cb444d7; SPSE=JQv6Qw0yaH4pkWNQ8uASreUpHyTouXgYlSkWiC5nrDQxwUlh+NBAc6zDdWJIRiWSWl0qaoG5gB4/QOvAdgt5kg==");

    //un-encoded fetch body details
    var details = {
        'client_id': 'admin-ui',
        'grant_type': 'password',
        'scope': 'openid',
        'username': username,
        'password': password
    };

    //encoded body
    var formBody = [];

    //populate formData with encoded data
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    //join
    formBody = formBody.join("&");

    //request options
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formBody,
        redirect: 'follow'
    };

    return fetch(TOKEN_ENDPOINT, requestOptions)
    
}

export default getToken