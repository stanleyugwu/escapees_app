import React from "react";
import { Thumbnail } from "native-base";
import styled from "styled-components/native";

const CustomMarkerView = (props) => {
  //remove cents change from price
  let memberPriceFormatted = props.memberPrice.toString();
  memberPriceFormatted =
    memberPriceFormatted.includes(".") && memberPriceFormatted.length > 4
      ? memberPriceFormatted.substring(0, memberPriceFormatted.length - 1)
      : memberPriceFormatted;

  return (
    <MarkerWrapper>
      <Marker>
        <PriceWrapper>
          <Price>${memberPriceFormatted}</Price>
        </PriceWrapper>
        <LogoWrapper>
          <Thumbnail
            square
            small
            loadingIndicatorSource={require("../../../assets/images/station_default.png")}
            source={{
              uri: props.logoUrl || "https://cdn.mdshosted.com/app/default.png",
            }}
            resizeMode="center"
            style={{ width: 23, height: 23, borderWidth: 1 }}
          />
        </LogoWrapper>
      </Marker>
      <Arrow />
    </MarkerWrapper>
  );
};

//shared border radius
const sharedRadius = 5;

const MarkerWrapper = styled.View`
  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Marker = styled.View`
  background: white;
  border-radius: ${sharedRadius}px;
  border: 1px solid #aaa;
`;

const PriceWrapper = styled.View`
  background: #0a0;
  border-top-right-radius: ${sharedRadius}px;
  border-top-left-radius: ${sharedRadius}px;
  padding: 0 2px;
`;
const Price = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: white;
  text-align: center;
`;

const LogoWrapper = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 5px 2px;
`;

const Arrow = styled.View`
  width: 0;
  height: 0;
  z-index: 999;
  border-left-width: 7px;
  border-right-width: 7px;
  border-top-width: 12px;
  border-style: solid;
  background-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: #888;
  elevation: 20;
`;

export default CustomMarkerView;
