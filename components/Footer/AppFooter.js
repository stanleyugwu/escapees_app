import React, { useState } from 'react';
import { Footer, Text, Icon } from 'native-base';
import { Grid,Row,Col } from 'react-native-easy-grid';
import { StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';

//viewingStations Switch and sort components
import StationSwitch from './StationSwitch';
import SortSwitch from "./SortSwitch";
//slide-up menu
import SlideMenu from './SlideMenu';

const AppFooter = (props) => {
    let {setStationsDisplayType,stationsDisplayType, stationsDataExists, navigate} = props;
    const [slideUpMenuVisible, setSlideUpMenuVisibile] = useState(false);

    return (
        <>
          <SlideMenu navigate={navigate} menuVisible={slideUpMenuVisible} setMenuVisible={setSlideUpMenuVisibile}/>
          <Footer style={{ height: 75, backgroundColor: "white", flexDirection:'column' }}>
            <Grid style={{ position: "relative", width: "100%" }}>
              <Row size={38}>
                {
                    stationsDataExists ? (
                      <TouchableHighlight
                          onPress={() =>
                          setStationsDisplayType(stationsDisplayType == 1 ? 2 : 1)
                          }
                          style={{
                          backgroundColor: "#3597e2",
                          width: "100%",
                          ...styles.Center,
                          }}
                      >
                          <Text style={{ color: "white", fontWeight: "700" }}>
                          {stationsDisplayType == 1 ? "List View" : "Map View"}
                          </Text>
                      </TouchableHighlight>
                    ) : null
                }
              </Row>
              {/* Views Toggler */}

              <Row size={62}>
                <Col style={styles.Center} size={35}>
                  {stationsDataExists ? (
                    <StationSwitch/>
                  ) : null}
                </Col>

                <Col size={35} style={styles.Center}>
                  {stationsDisplayType == 2 &&
                  stationsDataExists ? (
                    <SortSwitch/>
                  ) : null}
                </Col>

                <Col style={styles.Center} size={30}>
                  <Row>
                    <Col style={{ ...styles.Center, paddingLeft: 3 }}>
                      <TouchableOpacity>
                        <Icon name="filter" /*funnel*/ type="AntDesign" />
                      </TouchableOpacity>
                    </Col>
                    <Col
                      style={{
                        alignItems: "flex-start",
                        justifyContent: "space-around",
                        paddingLeft: 5,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          setSlideUpMenuVisibile(slideUpMenuVisible ? false : true)
                        }
                      >
                        <Icon
                          name="menu"
                          type="Entypo"
                          style={{ fontSize: 38, color: "#444" }}
                        />
                      </TouchableOpacity>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Grid>
          </Footer>
        </>
    )
}

const styles = StyleSheet.create({
    Center: {
        alignItems: "center",
        justifyContent: "center",
    },
})

export default AppFooter