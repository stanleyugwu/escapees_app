import React from 'react';
import {View,Text, FlatList} from 'react-native';
import StationView from '../components/CustomCalloutView';
import styled from 'styled-components';

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
                style={{width:'100%',textAlign:'center',paddingTop:10,padding:5}}
            />
        </Wrapper>
    )
}

const Wrapper = styled.View`
    background:#3597e2;
    width:100%;
    height:100%;
    justify-content:center;
    align-items:center;
`;

export default StationsListView