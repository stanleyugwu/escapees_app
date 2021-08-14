import React from "react";
import { View, Col, Grid, Row, Icon } from "native-base";
import { StyleSheet } from "react-native";
import styled from "styled-components";
// import GeographicLib from 'geographiclib';

//util function to calculate distance from latLng
import distanceFromCoords from "../../../utils/distanceFromCoords";

// var geod = GeographicLib.Geodesic.WGS84, r;

const StationPane = (props) => {
  //shorthand
  const { stationData: s = {} } = props;
  const { distanceFromUser } = s;
  console.log(distanceFromUser)

  //stations latLng
  const { latitude: slat, longitude: slon } = s;

  // if(props.userPosition && props.userPosition instanceof Object){

  //     const {latitude:ulat, longitude:ulon} = props.userPosition; //users latLng
  //     // r = geod.Inverse(40.734, -81.3648, 40.734, -81.3649).s12.toFixed();
  //     // console.log(r);
  //     var distance = distanceFromCoords(ulat,slat,ulon,slon);

  //     // console.log(distanceFromCoords(53.32055555555556,53.31861111111111,-1.7297222222222221,-1.6997222222222223))
  // }

  //seperate cents change (to be superscripted) from whole retail price
  let regularPrice = s.regularPrice.toString();
  let regularPriceWhole = regularPrice;
  let regularPriceChange = "";

  //if regularPrice has cents change seperate it
  if (regularPrice.includes(".") && regularPrice.length > 4) {
    regularPriceWhole = regularPrice.substring(0, regularPrice.length - 1);
    regularPriceChange = regularPrice[regularPrice.length - 1];
  }

  //seperate cents change (to be superscripted) from whole member price
  let memberPrice = s.memberPrice.toString();
  let memberPriceWhole = memberPrice;
  let memberPriceChange = "";

  //if memberPrice has cents change seperate it
  if (memberPrice.includes(".") && memberPrice.length > 4) {
    memberPriceWhole = memberPrice.substring(0, memberPrice.length - 1);
    memberPriceChange = memberPrice[memberPrice.length - 1];
  }

  //Member Savings from price
  let saving = (+s.regularPrice - +s.memberPrice).toPrecision(3);
  let savingDollarWhole = saving;
  let savingChange = "";

  // if saving has cents change seperate it
  if (saving.includes(".") && saving.length > 4) {
    savingDollarWhole = saving.substring(0, saving.length - 1);
    savingChange = +saving[saving.length - 1] || ""; //remove trailing zero from cent change if any
  }

  return (
    <Grid style={styles.PaneWrapper}>
      <Row>
        <Col size={7} style={styles.FirstCol}>
          <Row style={styles.LogoWrapper}>
            <Col size={1}>
              <Text>{s.logo || <Icon name="bus" />}</Text>
            </Col>

            <Col size={6} style={{ justifyContent: "center" }}>
              <Text size={17} color="#444" style={{ fontStyle: "italic" }}>
                {s.name + ", " + s.state}
              </Text>
            </Col>
          </Row>
          {/* Logo and Station Name */}

          <Row style={{ paddingTop: 5 }}>
            <Col>
              <Row>
                <View>
                  <Text weight={600}>Highway:</Text>
                  <Text>{s.address1}</Text>
                </View>
              </Row>

              <Row>
                <View>
                  <Text weight={600}>Address:</Text>
                  <Text>{s.address2}</Text>
                  <Text>{s.city + ", " + s.state + " " + s.zipCode}</Text>
                </View>
              </Row>
            </Col>
            {/* Address Details */}

            <Col style={{ justifyContent: "center", paddingLeft: 10 }}>
              <Text color="#888" size={13}>
                RV LANE
              </Text>
              <Text color="#888" size={13}>
                DUMP STATION
              </Text>
              <Text color="#888" size={13}>
                BIG RIG FRIENDLY
              </Text>
              <Text color="#888" size={13}>
                PROPANE
              </Text>
              <Text color="#888" size={13}>
                TRUCK WASH
              </Text>
            </Col>
            {/* Services */}
          </Row>
          {/* More Details */}
        </Col>
        {/* Details Column */}

        <Col size={2} style={{ paddingLeft: 10 }}>
          <Row>
            <Center>
              <Text weight={600} size={12}>
                Retail Price
              </Text>
              <Row>
                <Text style={styles.Money} weight={500}>
                  ${regularPriceWhole}
                </Text>
                {regularPriceChange ? <Sup>{regularPriceChange}</Sup> : null}
              </Row>
            </Center>
          </Row>
          {/* Retail Price */}

          <Row>
            <Center style={{ ...styles.YourPrice, marginVertical: 5 }}>
              <Row>
                <Text weight={500} color="#fff" size={12}>
                  Your Price
                </Text>
              </Row>
              <Row>
                <Text color="#fff" style={styles.Money}>
                  ${memberPriceWhole}
                </Text>
                {memberPriceChange ? (
                  <Sup color="#fff">{memberPriceChange}</Sup>
                ) : null}
              </Row>
            </Center>
          </Row>
          {/* Member Price */}

          <Row>
            <Center>
              <Text weight={700} size={12} color="#777">
                You Save
              </Text>
              <Row>
                <Text>${savingDollarWhole}</Text>
                {savingChange ? <Sup>{savingChange}</Sup> : null}
                <Text>/Gal</Text>
              </Row>
            </Center>
          </Row>
          {/* You Save */}
        </Col>
        {/* Price Column */}
      </Row>

      <Row style={{ marginTop: 7 }}>
        {distanceFromUser ? (
          <Col size={2} style={{ justifyContent: "center" }}>
            <Row>
              <Icon name="navigate" style={{ fontSize: 18, color: "#555" }} />
              <Text
                style={{ textAlignVertical: "center", paddingLeft: 5 }}
                size={13}
              >
                {distanceFromUser}
              </Text>
            </Row>
          </Col>
        ) : null}
        {/* Distance (shows if user's position is known)*/}

        <Col size={2} style={{ justifyContent: "center" }}>
          <Row>
            <Icon
              name="phone"
              style={{ fontSize: 16, color: "#555" }}
              type="FontAwesome5"
            />
            <Text
              style={{ textAlignVertical: "center", paddingLeft: 5 }}
              size={13}
            >
              {s.contact || "469-941-3150"}
            </Text>
          </Row>
        </Col>
        {/* Contact */}

        <Col size={1}>
          <View style={styles.TriangleCorner}></View>
          <Icon
            name="star"
            style={{
              fontSize: 20,
              color: "white",
              position: "absolute",
              bottom: -3,
              right: -3,
            }}
          />
        </Col>
        {/* Favourite */}
      </Row>
      {/* DISTANCE & CONTACT & FAV*/}
    </Grid>
  );
};

const Center = styled.View`
  align-items: center;
  width: 100%;
  justify-content: center;
  ${(props) => ({ ...props.style })}
`;

const Text = styled.Text`
  ${(props) => ({
    fontWeight: props.weight || "bold",
    color: props.color || "#555",
    fontSize: props.size || 12,
  })}
`;

const Sup = styled.Text`
  font-size: 11px;
  font-weight: bold;
  text-align-vertical: top;
  ${(props) => ({
    color: props.color || "#555",
    ...props.style,
  })}
`;

const styles = StyleSheet.create({
  PaneWrapper: { backgroundColor: "white", marginTop: 10, padding: 5 },
  FirstCol: { paddingRight: 10, borderRightWidth: 1, borderRightColor: "#aaa" },
  LogoWrapper: { borderBottomWidth: 1, borderBottomColor: "#aaa" },
  YourPrice: {
    backgroundColor: "#090",
    borderRadius: 10,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  Money: {
    fontSize: 17,
  },
  TriangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 43,
    position: "absolute",
    right: -5, //container padding unit
    bottom: -5, //container padding unit
    borderTopWidth: 43,
    borderRightColor: "transparent",
    borderTopColor: "orange",
    transform: [{ rotate: "180deg" }],
  },
});

export default StationPane;
