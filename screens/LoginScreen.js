import React, {useState} from 'react';
import {Root, Container, Button, Header, Content, Thumbnail, View, Title, H3, Separator, Form, Item, Input, Label, Icon, Card, CardItem, Spinner} from 'native-base';
import styled from 'styled-components';
import {Grid, Row, Col} from 'react-native-easy-grid';


//app logo
import logo from '../assets/images/logo.png';

//RN imports
import { StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';

//token request endpoint
const TOKEN_ENDPOINT = 'https://auth.mdshosted.com/auth/realms/mds/protocol/openid-connect/token';

const LoginScreen = (props) => {

    //prevent going back to splash screen
    props.navigation.addListener('beforeRemove', e => e.preventDefault());

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
        setLoginDetails({...loginDetails,[field]:text});
    }

    //dummy
    const user = 'stanleyugwu2018@gmail.com',
    pass = '123456'

    //form submission handler
    const handleSubmit = () => {
        //destructure details
        const {usernameEmail, password} = loginDetails;

        //show error if no details was supplied
        if(usernameEmail.trim() && password){
            setLoggingIn(true) ?? setErrorText('');
        }else {
            setErrorText('You Supplied Empty Fields..');
            return 
        }

        //if valid inputs were entered
        if(usernameEmail === user && password === pass){
           setTimeout(() => props.navigation.navigate('Home'), 2000);
        }else{
           setTimeout(() => {
            setErrorText('Wrong Username or Password');
            setLoggingIn(false);
           }, 2000)
        }

    }

    return (
        <Root>
            <Container>
                <Content padder contentContainerStyle={{height:'100%'}}>
                    <Grid style={{padding:10}}>
                        <Row size={2}>   
                            <Thumbnail square source={logo} style={{width:'100%',height:'100%'}} resizeMode="contain"/>
                        </Row>
                        <Row size={1}>
                            <Grid style={styles.Center}>
                                <Row>
                                    <Title style={{color:'#444',fontWeight:'bold'}}>User Login</Title>
                                </Row>
                                <Row>
                                    <Line color="#090" w="40%" h={3}/>
                                </Row>
                            </Grid>
                        </Row>
                        <Row size={5}>
                            <Form style={{width:'100%'}}>
                                <Card style={{padding:20,paddingTop:40}}>
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
                                    <Button block full last style={{backgroundColor:'#090'}} onPress={handleSubmit} disabled={loggingIn}>
                                        {
                                            loggingIn ? (
                                                <Spinner size={25} color='white'/>
                                            ) : (
                                                <Text bold>LOGIN</Text>
                                            )
                                        }
                                    </Button>
                                </Card>
                                <TouchableOpacity >
                                    <Text bold size={16} color="#090" center pd={[15]}>Forgot Password?</Text>
                                </TouchableOpacity>
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