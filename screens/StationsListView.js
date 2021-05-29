import React from 'react';
import {View, FlatList} from 'react-native';
import StationView from '../components/CustomCalloutView';
import styled from 'styled-components';

import {Container, Root, Button, Text, Switch} from 'native-base';


const StationsListView = (props) => {

    const stationsData = props.stationsData;

    //renderer
    const renderStation = ({item}) => {
        return (
            <View style={{alignSelf:'center'}}>
                <StationView stationData={item} viewType={2} />
            </View>
        )
    }

    //seperator component
    const Seperator = () => (
        <View style={{padding:10}}>
            {/* BLANK SPACE */}
        </View>
    )

    return(
        <Wrapper>
            <FlatList
                data={stationsData && stationsData}
                renderItem={renderStation}
                keyExtractor={s => s.locationId.toString()}
                ItemSeparatorComponent={() => <Seperator/>}
                style={{width:'100%',textAlign:'center',paddingTop:10,padding:5,backgroundColor:'yellow'}}
            />
        </Wrapper>
    )
}

// class StationsListView extends React.Component{
//     constructor(props){
//         super(props);
//         this.textRef = null;
//     }

//     async componentDidMount(){
//         await Font.loadAsync({
//             Roboto:require('native-base/Fonts/Roboto.ttf'),
//             Roboto_medium:require('native-base/Fonts/Roboto_medium.ttf'),
//             ...Ionicons.font,
//         })
//     }

//     render(){
//         return(
//             <Root> 
//                 <Container>
//                     <Text ref={c => this.textRef = c}>Hello</Text>
//                     <Button dark>
//                         <Text>Clickie</Text>
//                     </Button>
//                 </Container>
//             </Root>
//         )
//     }
// } 

const Wrapper = styled.View`
    background:#3597e2;
    width:100%;
    height:100%;
    justify-content:center;
    align-items:center;
`;

export default StationsListView