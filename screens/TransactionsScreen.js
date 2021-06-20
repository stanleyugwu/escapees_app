import React, { useState, useEffect, useRef } from 'react';
import { Root, Container, Content, Footer, Icon, Grid, Col, Row, View, Text, Button, Title } from 'native-base';
import { Alert, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';

//components import
import AppHeader from '../components/AppHeader';
import FetchLoader from '../components/FetchLoader';

//local storage utils
import { storeData, retrieveData } from '../utils/localDataAdapters';

//dummy transactions
import data from '../dummy-api-data-models/transactions-response.json';

//Table components
import { Table, Row as TableRow, Rows, TableWrapper } from 'react-native-table-component';

const TransactionsScreen = (props) => {

    const storeKey = 'eskp_pv_transactions';

    //transactions data mock
    const [transactions, setTransactions] = useState(null);

    //fetch transactions data with refresh token
    const fetchAndStoreTransactions = async () => {
        let tokenStoreKey = 'eskp_pv_data';

        let storedData = await retrieveData(tokenStoreKey, true);
        if (storedData) {
            let token = storedData['token']['refresh_token'];
            console.log(token)
            getAccessTokenWithRefresh(token)
            .then(res => {
                return res.json()
                // else console.log(res.text())
            })
            .then(data => {
                //token gotten
                console.log(data)
            })
            .catch(error => {
                if(error.message == false) console.log('failed')//props.navigation.navigate('Login');//server error
                else console.log(error)//dataLoaded != false && setDataLoaded(false);//network error
            })
        } else return //props.navigation.navigate('Login')
    }

    const getAccessTokenWithRefresh = (refreshToken) => {

        const TOKEN_ENDPOINT = 'https://auth.mdshosted.com/auth/realms/mds/protocol/openid-connect/token';

        //request headers
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        // myHeaders.append("Cookie", "Cookie_1=value; UTGv2=D-h41e35427b78482eaa143250e359c0aa0066; SPSI=90bb31727e73e3579080cb102cb444d7; SPSE=JQv6Qw0yaH4pkWNQ8uASreUpHyTouXgYlSkWiC5nrDQxwUlh+NBAc6zDdWJIRiWSWl0qaoG5gB4/QOvAdgt5kg==");

        //un-encoded fetch body details
        var details = {
            'client_id': 'admin-ui',
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken,
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

    retrieveData(storeKey, false)
    .then(data => {
        if (data == null) return fetchAndStoreTransactions()
        else if (data instanceof Array) setTransactions(data);
        else throw Error('native read error')
    })
    .catch(e => props.navigation.navigate('Login'))//any other case re-authenticate)

    //table head fields
    const tableHead = ['Date', 'Station', 'Qty', 'Savings', 'Total', 'Status'];

    //generate 2D array from transaction history for Table package consumption
    const tableData = transactions && transactions.map((transaction) => {
        let { transactionDate, programDescription, amount, status } = transaction
        return [
            new Date(transactionDate).toLocaleDateString(),
            programDescription,
            amount,
            2.50,
            52.12,
            status
        ]
    });

    //transactions table
    const TransactionsTable = () => (
        <View style={styles.Container}>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                <TableRow
                    data={tableHead}
                    style={styles.head}
                    textStyle={styles.text}
                    widthArr={widthArr}
                />
            </Table>

            <ScrollView>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                    {
                        tableData.map((rowData, idx) => (
                            <TableRow
                                key={idx}
                                data={rowData}
                                widthArr={widthArr}
                                style={[styles.row, idx % 2 && { backgroundColor: '#f1faff' }]}
                                textStyle={styles.text}
                            />
                        ))
                    }
                </Table>
            </ScrollView>
        </View>
    )

    //table cells width array
    const widthArr = [85, 120, 80, 80, 80, 90];

    return (
        <Root>
            <Container>
                <AppHeader showViewStatusBar={false} />
                <Content contentContainerStyle={{ flex: 1,alignItems:'center',justifyContent:'center' }} padder>
                    <TouchableOpacity
                        style={{
                            alignSelf:'flex-start',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: '#3597e2',
                            width: 100
                        }}
                        onPress={() => props.navigation.navigate('Home')}
                    >
                        <Icon name="chevron-left" type="Feather" style={{ color: '#3597e2', fontSize: 30 }} />
                        <Text style={{ color: '#3597e2', fontWeight: '700' }}>BACK</Text>
                    </TouchableOpacity>

                    <ScrollView horizontal={true} scrollEnabled={true}>
                        {
                            transactions == null ? (
                                <FetchLoader loadingText={"Loading Transactions..."} />
                            ) : (transactions == []) ? (
                                <Title>
                                    NO TRANSACTIONS
                                </Title>
                            ) : (TransactionsTable())
                        }
                    </ScrollView>
                </Content>
                <Footer style={styles.Footer}>
                    <Text style={styles.FooterText}>Further details in customer portal</Text>
                </Footer>
            </Container>
        </Root>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#fff'
    },
    head: {
        height: 40,
        backgroundColor: '#b3c8da'
    },
    row: {
        height: 40,
        backgroundColor: '#fff'
    },
    text: {
        textAlign: 'center',
        fontWeight: '100',
        fontFamily: 'Roboto_medium',
        color: '#222'
    },
    Footer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#777',
    },
    FooterText: {
        fontFamily: 'Roboto_medium',
        color: '#777'
    }
})

export default TransactionsScreen