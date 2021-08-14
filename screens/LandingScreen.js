import React from 'react';
import { Button, Container, Content, Header, Root, Text, Thumbnail, View } from 'native-base';
import { Dimensions, ImageBackground, StyleSheet } from 'react-native';
import bg from "../assets/images/bg.jpg";//background image
import logo from '../assets/images/logo.png';
import { Col, Grid, Row } from 'react-native-easy-grid';
import store, { updateUserStatus, signInUser } from '../redux/store';

const LandingScreen = (props) => {

    let navigate = props.navigation.navigate;

    const _handleLogin = () => {
        navigate('Login');
    }

    const _handleCheckPrices = () => {
        store.dispatch(signInUser());
    }

    return (
        <Root>
            <Container>
                <Content scrollEnabled={false} contentContainerStyle={{height:'100%'}}>
                    <Thumbnail
                        source={bg} 
                        style={{width:'100%',height:'100%',position:'absolute',top:0,bottom:0,opacity:0.3}}
                        resizeMode="stretch"
                    />
                    <Grid style={{padding:10}}>
                        <Row size={1}>
                            <Thumbnail square source={logo} style={{width:'100%',height:'100%'}} resizeMode="contain"/>
                        </Row>
                        <Row size={3}>
                            <Grid style={{height:'60%'}}>
                                <Row size={2} style={{alignItems:'flex-end'}}>
                                    <Col>
                                        <Button block style={styles.Buttons} onPress={_handleLogin}>
                                            <Text>Login</Text>
                                        </Button>
                                    </Col>
                                </Row>
                                <Row size={1}>
                                    <Col style={styles.Line} size={2}></Col>
                                    <Col style={styles.Center} size={1}><Text>or</Text></Col>
                                    <Col style={styles.Line} size={2}></Col>
                                </Row>
                                <Row size={2} style={{alignItems:'flex-start'}}>
                                    <Col>
                                        <Button block style={styles.Buttons} onPress={_handleCheckPrices}>
                                            <Text>Check Prices</Text>
                                        </Button>
                                    </Col>
                                </Row>
                            </Grid>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        </Root>
    )
}

const styles = StyleSheet.create({
    Center:{
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center'
    },
    Buttons:{
        backgroundColor:'#090',
        paddingVertical:10
    },
    Line:{
        height:2,
        backgroundColor:'#aaa',
        width:100,
        alignSelf:'center'
    }
})

export default LandingScreen