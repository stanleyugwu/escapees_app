import React from "react";
import {
  Root,
  Container,
  Content,
  Spinner,
  Text
} from "native-base";
import { Grid, Row, Col } from "react-native-easy-grid";
import { Dimensions, ImageBackground, StyleSheet } from "react-native";

//images
import bg from "../assets/images/bg.jpg";//background image

const SplashScreen = () => {

  return (
    <Root>
      <Container>
        <Content contentContainerStyle={styles.Content}>
          <ImageBackground
            source={bg}
            resizeMode="stretch"
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
              flex: 1,
            }}
          >
            <Grid style={styles.Center}>
              <Row style={styles.Center}>
                <Col style={styles.Center}>
                  <Spinner color="#090" size={60} />
                  <Text style={{fontWeight:'bold',fontSize:19,color:'#656'}}>Loading...</Text>
                </Col>
              </Row>
            </Grid>
          </ImageBackground>
        </Content>
      </Container>
    </Root>
  );
};

const styles = StyleSheet.create({
  Content: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  Center: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SplashScreen;
