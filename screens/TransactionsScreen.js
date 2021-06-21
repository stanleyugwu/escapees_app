import React, { useState, useEffect, useRef } from 'react';
import { Root, Container, Content, Footer, Icon, Grid, Col, Row, View, Text, Button, Title } from 'native-base';
import { Alert, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, RefreshControl } from 'react-native';

//components import
import AppHeader from '../components/AppHeader';
import FetchLoader from '../components/FetchLoader';

//local storage utils and adapters
import { storeData, retrieveData } from '../utils/localDataAdapters';
import getToken from '../adapters/get-token.adapter';
import getTransactions from '../adapters/transactions.adapter';

//Table components
import { Table, Row as TableRow, } from 'react-native-table-component';

const TransactionsScreen = (props) => {

    //transactions data mock
    const [transactions, setTransactions] = useState(null);

    //data refresh state
    const [refreshing, setRefreshing] = useState(false);

    const storeKey = 'eskp_pv_transactions';//transactions store key


    //fetch transactions data with refresh token
    const fetchAndStoreTransactions = async () => {

        setRefreshing(true);//table refreshing data

        let dataStoreKey = 'eskp_pv_data';

        let storedData = await retrieveData(dataStoreKey, true);
        if (storedData && typeof storedData == 'object' && 'login' in storedData) {

            let {usernameOrEmail, password} = storedData['login'];//stored login details

            getToken(usernameOrEmail,password)
            .then(res => {
                if(res.ok) return res.json()
                else throw Error('Error')
            })
            .then(tokens => {
                if(tokens && "access_token" in tokens){
                    return tokens['access_token'];
                } else throw Error('Error')
            })
            .then(accessToken => {
                /**
                 * ERROR BELOW
                 */
                //fetch transactions
                getTransactions(accessToken)
                .then(res => {
                    console.log(res.ok);//this is false
                })
                .catch(e => {
                    console.log('error',e)
                })

                // if(result instanceof Array){
                //     //load transactions
                //     setTransactions(result);
                //     setRefreshing(false);

                //     //store data
                //     let stored = storeData(storeKey,result,false);
                //     if(!stored) alert('error storing transactions data')
                // }
                // else if (result == false) throw Error('Error');//request error
                // else throw Error();//network error

            })
            .catch(error => {
                setRefreshing(false);//stop refresh
                //handle network error
                if(error.message == 'Error') props.navigation.navigate('Login');//should show error instead
                else alert('Network Error')
               
            });
           
        } else {
            setRefreshing(false);
            return //props.navigation.navigate('Login')
        }
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

            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchAndStoreTransactions}
                />
            }>
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