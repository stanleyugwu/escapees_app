import React from 'react';
import {Dimensions, View} from 'react-native';
import styled from 'styled-components/native';
import {Grid, Col,Row} from 'react-native-easy-grid';
import {Icon} from 'native-base';

//This component is polymorphic, its used by Map and StationsListView Components
const CustomCalloutView = (props) => {

    //shorthand
    const s = props.stationData || {};

    //shorthand for viewType i.e where the callout is used (Map = 1, Second-Screen = 2)
    const viewType = props.viewType;

    //seperate cents change (to be superscripted) from whole retail price
    let regularPrice = s.regularPrice.toString();
    let regularPriceWhole = regularPrice;
    let regularPriceChange = '';

    //if regularPrice has cents change seperate it
    if(regularPrice.includes('.') && regularPrice.length > 4){
        regularPriceWhole = regularPrice.substring(0,regularPrice.length-1);
        regularPriceChange = regularPrice[regularPrice.length-1];
    }

    //seperate cents change (to be superscripted) from whole member price
    let memberPrice = s.memberPrice.toString();
    let memberPriceWhole = memberPrice;
    let memberPriceChange = '';

    //if memberPrice has cents change seperate it
    if(memberPrice.includes('.') && memberPrice.length > 4){
        memberPriceWhole = memberPrice.substring(0,memberPrice.length-1);
        memberPriceChange = memberPrice[memberPrice.length-1];
    }

    //Member Savings from price
    let saving = (+s.regularPrice - +s.memberPrice).toPrecision(3);
    let savingDollarWhole = saving;
    let savingChange = '';

    // if saving has cents change seperate it
    if(saving.includes('.') && saving.length > 4){
        savingDollarWhole = saving.substring(0,saving.length-1);
        savingChange = +saving[saving.length-1] || ''; //remove trailing zero from cent change if any
    }

    return (
        <CalloutWrapper>
            <Callout>                
                <Col1>
                    <StationName>
                        <Grid>
                            <Col size={1}>
                                <Icon name="bus"/>
                            </Col>
                            <Col size={6} style={{alignItems:'center',justifyContent:'center'}}>
                                <Text
                                    fontStyle={"italic"} 
                                    fontWeight="bold" 
                                    fontSize={16} 
                                    color="#555"
                                    style={{textAlignVertical:'center'}}
                                >
                                    {s.name + ", " + s.state}
                                </Text>
                            </Col>
                        </Grid>
                    </StationName>

                    <MoreInfo>
                        <AddressWrapper>
                            <HighWay>
                                <Text color="#aaa">Highway:</Text>
                                <Text fontWeight="bold" fontSize={12} numberOfLines={2}>{s.address1}</Text>
                            </HighWay>

                            <Address>
                                <Text color="#aaa">Address:</Text>
                                <Text numberOfLines={2}>
                                    <Grid>
                                        {
                                            //split address into multi-lines to avoid overflow
                                            s.address2.match(/.{1,15}/g).map((chunk, idx) => {
                                                return (
                                                    <Row key={idx}>
                                                        <Text fontWeight="bold" fontSize={12}>{chunk}</Text>
                                                    </Row>
                                                )
                                            })
                                        }
                                    </Grid>
                                </Text>
                                <Text fontWeight="bold" fontSize={12}>{s.city + ", " + s.state + " " + s.zipCode}</Text>
                            </Address>
                        </AddressWrapper>

                        <Services>
                            <Text color="#999" fontWeight="700">RV LANES</Text>
                            <Text color="#999" fontWeight="700">BIG RIG FRIENDLY</Text>
                            <Text color="#999" fontWeight="700">DUMP STATION</Text>
                            <Text color="#999" fontWeight="700">PROPANE</Text>
                            <Text color="#999" fontWeight="700">TRUCK WASH</Text>
                        </Services>
                    </MoreInfo>
                </Col1>

                <Col2>
                    <RegularPrice>
                        <Text fontWeight="bold" color="#aaa">Retail Price</Text>
                        <View style={{flexDirection:'row'}}>
                            <View>
                                <Text fontWeight="bold" fontSize={15}>${regularPriceWhole}</Text>
                            </View>
                            {
                                regularPriceChange ? <Sup>{regularPriceChange}</Sup> : null
                            }
                        </View>
                    </RegularPrice>
                    <MemberPrice>
                        <Text color="#ddd" fontSize={10} fontWeight="bold">Your Price</Text>
                        <View style={{flexDirection:'row'}}>
                            <View>
                                <Text fontWeight="bold" color="#fff" fontSize={15}>${memberPriceWhole}</Text>
                            </View>
                            {
                                memberPriceChange ? <Sup color="#fff">{memberPriceChange}</Sup> : null
                            }
                        </View>
                    </MemberPrice>
                    <MoneySaved>
                        <Text fontWeight="bold" color="#aaa">You Save</Text>
                        <View style={{flexDirection:'row'}}>
                            <View>
                                <Text fontWeight="bold" >${savingDollarWhole}</Text>
                            </View>
                            <View>
                                {
                                    savingChange ? <Sup>{savingChange}</Sup> : null
                                }
                            </View>
                            <View>
                                <Text fontWeight="bold">/Gal</Text>
                            </View>
                            
                        </View>
                        
                    </MoneySaved>
                </Col2>
            </Callout>
            {
                //show only on Map view
                viewType == 1 ? <Arrow/> : null
            }
        </CalloutWrapper>
    )
}

const Text = styled.Text`
    width:100%;
    text-align-vertical:bottom;
    ${props => ({
        fontStyle:props.fontStyle,
        fontWeight:props.fontWeight || '500',
        fontSize:props.fontSize || 12,
        color:props.color || '#555',
        textAlign:props.align || 'left',
        ...props.style
    })}
`;

const Sup = styled.Text`
    font-size:9px;
    font-weight:bold;
    text-align-vertical:top;
    ${props => ({
        color:props.color || '#555',
        ...props.style
    })}
`;

const CalloutWrapper = styled.View`
    width:100%;
`;

const Callout = styled.View`
    display:flex;
    width:100%;
    background:white;
    padding:6px;
    flex-direction:row;
    overflow:scroll;
    align-items:center;
    border-width:1px;
    border-color:#999;
    justify-content:space-between;
    border-radius:10px;
`;

const Arrow = styled.View`
    width:0;
    height:0;
    z-index:999;
    display:flex;
    align-items:center;
    justify-content:center;
    align-self:center;
    border-left-width:7px;
    border-right-width:7px;
    border-top-width:12px;
    border-style:solid;
    background-color:transparent;
    border-left-color:transparent;
    border-right-color:transparent;
    border-top-color:#888;
`;

// ====== Col1
var Col1 = styled.View`
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding-right:5px;
    flex-direction:column;
    border-right-width:1px;
    border-right-color:#bbb;
`;

// ====== Station Name
const StationName = styled.View`
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
    border-bottom-width:1px;
    border-bottom-color:#bbb;
`;

// ====== StationName


// ====== MoreInfo
const MoreInfo = styled.View`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    margin-top:3px;
`;

// ====== AddressWrapper
const AddressWrapper = styled.View`
    padding-right:5px;
`;
const HighWay = styled.View`

`;
const Address = styled.View`
`;
// ====== AddressWrapper


const Services = styled.View`
    padding-left:5px;
    display:flex;
    align-items:center;
    justify-content:flex-end;
`;
// ======= MoreInfo
// ====== Col1


const Col2 = styled.View`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    padding-left:5px;
`;
const RegularPrice = styled.View`
    display:flex;
    flex-direction:column;
    justify-content:space-around;
    align-items:center;
`;

const MemberPrice = styled.View`
    display:flex;
    justify-content:space-around;
    align-items:center;
    background:#0a0;
    border-radius:8px;
    padding:4px;
    margin:4px 0px;
`;
const MoneySaved = styled.View`
    display:flex;
    flex-direction:column;
    justify-content:space-around;
    align-items:center;
`;


export default CustomCalloutView