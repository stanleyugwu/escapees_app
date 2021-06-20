import React, { useState, useEffect, useRef } from 'react';
import { Root, Container, Content, Footer, Icon, Grid, Col, Row, View, Text} from 'native-base';
import { Alert,StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';

//components import
import AppHeader from '../components/AppHeader';

const TransactionsScreen = (props) => {

    return (
        <Root>
            <Container>
                <AppHeader showViewStatusBar={false}/>
                
                <Content contentContainerStyle={{flex:1,}}>
                <TouchableOpacity>
                    <Icon name="chevron-left" type="Feather"/> <Text>Back</Text>
                </TouchableOpacity>
                    <Text>Transactions</Text>
                </Content>
            </Container>
        </Root>
    )
}

export default TransactionsScreen