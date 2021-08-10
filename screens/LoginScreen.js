import React, {useEffect, useState} from 'react';
import {Root, Container, Button, Content, Thumbnail, Title,Form, Item, Input, Icon, Card, Spinner,Col} from 'native-base';
import styled from 'styled-components';
import {Grid, Row,} from 'react-native-easy-grid';
import store, { updateAuthTokens, updateUserLoginDetails, updateUserStatus } from '../redux/store';

//app logo
import logo from '../assets/images/logo.png';
import bg from "../assets/images/bg.jpg";//background image


//RN imports
import { StyleSheet, TouchableOpacity } from 'react-native';

//token request adapter
import getToken from '../adapters/get-token.adapter';

const LoginScreen = (props) => {

    //track when log in in progress
    const [loggingIn, setLoggingIn] = useState(false);

    //login details state
    const [loginDetails, setLoginDetails] = useState({
        usernameEmail:'',
        password:''
    });

    //error Text report
    const [errorText, setErrorText] = useState('');

    //login details updater
    const updateDetails = (field, text) => {
        setErrorText('');
        setLoginDetails({...loginDetails,[field]:text});
    }

    //form submission handler
    const handleSubmit = async () => {

        // destructure details
        const {usernameEmail, password} = loginDetails;

        //show error if no details was supplied
        if(usernameEmail.trim() && password){
            setLoggingIn(true) ?? setErrorText('');
        }else {
            setErrorText('You Supplied Empty Fields..');
            return 
        }

        //if valid inputs were entered get token
        let result = await getToken(usernameEmail,password);
        if(result.error){
            setLoggingIn(false);
            setErrorText(result.message);
            return
        }else{
            let tokens = result;
            let creds = {usernameOrEmail:usernameEmail,password}
            store.dispatch(updateUserStatus('member'));
            store.dispatch(updateAuthTokens(tokens));
            store.dispatch(updateUserLoginDetails(creds));
            return props.navigation.navigate('Home',{passedToken:tokens['access_token'],login:creds})
        }
    }

    return (
        <Root>
            <Container>
                <Content contentContainerStyle={{height:'100%'}}>
                <Thumbnail
                    source={bg} 
                    style={{width:'100%',height:'100%',position:'absolute',top:0,bottom:0,opacity:0.4}}
                    resizeMode="stretch"
                />
                    <Grid style={{padding:10}}>
                        <Row size={2} style={{paddingHorizontal:10}}>   
                            <Thumbnail square source={logo} style={{width:'100%',height:'100%'}} resizeMode="contain"/>
                        </Row>
                        <Row size={1}>
                            <Col style={{alignItems:'center'}}>
                                <Title style={{color:'#444',fontWeight:'bold',}}>Login</Title>
                                <Line color="#090" w="40%" h={3} style={{marginTop:10}}/>
                            </Col>
                        </Row>
                        <Row size={5}>
                            <Form style={{width:'100%'}}>
                                <Card style={{padding:20,paddingTop:40,}}>
                                    <Item underline success>
                                        <Icon name="mail" />
                                        <Input
                                            placeholder="Email Address"
                                            textContentType="emailAddress"
                                            placeholderTextColor="#aaa"
                                            autoFocus
                                            onChangeText={text => updateDetails('usernameEmail',text)}
                                            style={{fontWeight:'bold',color:'#444'}}/>
                                    </Item>
                                    <Space size={10} />
                                    <Item underline success>
                                        <Icon name="key"/>
                                        <Input
                                            textContentType="password"
                                            placeholder="Password"
                                            placeholderTextColor="#aaa"
                                            secureTextEntry={true}
                                            onChangeText={text => updateDetails('password',text)}
                                            style={{fontWeight:'bold',color:'#444'}}
                                        />
                                    </Item>
                                    {
                                        errorText ? (
                                            <Item last underline={false} style={{borderBottomWidth:0}}>
                                                <Row style={{...styles.Center,paddingVertical:10}}>
                                                    <Text color="#444" align="center" color="red">{errorText}</Text>
                                                </Row>
                                            </Item>
                                        ) : null
                                    }
                                    <Space size={15} />
                                    <Button block full style={{backgroundColor:'#090'}} onPress={handleSubmit} disabled={loggingIn}>
                                        {
                                            loggingIn ? (
                                                <Spinner size={25} color='white'/>
                                            ) : (
                                                <Text bold>LOGIN</Text>
                                            )
                                        }
                                    </Button>
                                    <TouchableOpacity >
                                        <Text bold size={16} color="#090" center pd={[15,0,5]}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </Card>
                            </Form>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        </Root>
    )
};

const styles=StyleSheet.create({
    Center:{
        alignItems:'center',
        justifyContent:'center'
    }
});

const Line = styled.View`
    ${props => ({
        width:props.w || '100%',
        height:props.h || 5,
        backgroundColor:props.color || '#090',
        ...props.style
    })}
`;

const Text = styled.Text`
    ${props => ({
        fontWeight:props.bold ? 'bold' : '600',
        color:props.color || '#fff',
        fontSize:props.size || 16,
        textAlign:props.align || 'center',
        paddingTop:props.pd ? props.pd[0] || 0 : 0,
        paddingRight:props.pd ? props.pd[1] || 0 : 0,
        paddingBottom:props.pd ? props.pd[2] || props.pd[0] || 0 : 0,
        paddingLeft:props.pd ? props.pd[3] || props.pd[1] || 0 : 0,
        ...props.style
    })}
`;

const Space = styled.View`
    ${props => ({
        padding:props.size || 15,
    })}
`;

// const Title = styled.Text`
//     color:green;
// `;


export default LoginScreen