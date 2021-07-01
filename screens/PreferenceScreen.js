import React, { useState, useEffect } from "react";
import {
  Root,
  Container,
  Content,
  Icon,
  Grid,
  Col,
  Row,
  Text,
  Badge,
} from "native-base";
import { Alert, StyleSheet, TouchableOpacity, BackHandler } from "react-native";

//components import
import AppHeader from "../components/AppHeader";
import RadioButton from "../components/RadioButton";

//data storage helpers
import { storeData, retrieveData } from "../utils/localDataAdapters";

const PreferencesScreen = (props) => {
  //fuel type display preference (1 = diesel, 2 = gasoline, 3 = both)
  const [fuelTypePreference, setFuelTypePreference] = useState("gasAndDiesel");
  //fuel price display preference
  const [fuelPricePreference, setFuelPricePreference] = useState("midgrade");
  //fuel unit preference
  const [fuelUnitPreference, setFuelUnitPreference] =
    useState("pricePerGallon");

  const [preferenceChanged, setPreferenceChanged] = useState(false); //changed preference state

  const storeKey = "eskp_pv_preferences"; //preferences store key

  //load preferences from local storage
  const _loadPreferences = async () => {
    let preferences = await retrieveData(storeKey, false);
    if (preferences) {
      let {
        fuelType = "gasAndDiesel",
        fuelPrice = "midgrade",
        fuelUnit = "pricePerGallon",
      } = preferences;

      if (!props.navigation.isFocused()) return; //break function if not on screen not focused

      //populate state with loaded preferences
      fuelType != fuelTypePreference && setFuelTypePreference(fuelType);
      fuelPrice != fuelPricePreference && setFuelPricePreference(fuelPrice);
      fuelUnit != fuelUnitPreference && setFuelUnitPreference(fuelUnit);
    }
  };

  //function to save all preferences when user about to leave screen
  const _savePreferences = async () => {
    let stored = await storeData(
      storeKey,
      {
        fuelType: fuelTypePreference,
        fuelPrice: fuelPricePreference,
        fuelUnit: fuelUnitPreference,
      },
      false
    );
    return stored;
  };

  //exit screen
  const _exitScreen = async () => {
    let saved = await _savePreferences();
    if (!saved)
      Alert.alert(
        "Preferences Not Saved",
        `Your preferences couldn't be stored`
      );

    props.navigation.isFocused() &&
      props.navigation.navigate("Home", {
        hasNewPreference: preferenceChanged,
      }); //exit to home
  };

  //back press handler
  const _handleBackButtonPress = () => {
    if (!props.navigation.isFocused()) return false; //not focused dont go back
    return true; //prevent going back
  };

  //load preferences on mount
  useEffect(() => {
    //run exit screen on back button press
    BackHandler.addEventListener("hardwareBackPress", _handleBackButtonPress);

    const load = async () => {
      await _loadPreferences();
    };
    props.navigation.isFocused() && load();
  }, []);

  //track preference change
  useEffect(() => {
    setPreferenceChanged(true);
  }, [fuelTypePreference, fuelPricePreference, fuelUnitPreference]);

  return (
    <Root>
      <Container>
        <AppHeader showViewStatusBar={false} />

        <Content contentContainerStyle={{ flex: 1 }}>
          <Grid>
            <Row
              style={{
                backgroundColor: "#efefef",
                borderBottomWidth: 2,
                borderBottomColor: "#bbb",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              size={0.5}
            >
              <Col
                size={80}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <Icon name="star" />
                <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
                  Preferences
                </Text>
              </Col>

              <Col size={20}>
                <TouchableOpacity onPress={_exitScreen}>
                  <Text style={{ textDecorationLine: "underline" }}>Close</Text>
                </TouchableOpacity>
              </Col>
            </Row>
            {/* Screen Header */}

            <Row size={2} style={styles.preferenceSection}>
              <Grid>
                <Row size={0.5}>
                  <Text style={styles.preferenceTitle}>Fuel Type Display</Text>
                </Row>
                {/* Preference title */}

                <Row size={2}>
                  <Col style={styles.center}>
                    <Row>
                      <Text style={styles.optionText}>Gasoline Only</Text>
                    </Row>
                    <Row>
                      <Badge danger style={styles.badge}>
                        <Text style={styles.badgeText}>Gas</Text>
                      </Badge>
                    </Row>
                    <Row>
                      <TouchableOpacity
                        onPress={() => setFuelTypePreference("gasoline")}
                      >
                        <RadioButton
                          checked={fuelTypePreference == "gasoline"}
                        />
                      </TouchableOpacity>
                    </Row>
                  </Col>
                  {/* Gasoline only */}

                  <Col style={styles.center}>
                    <Row>
                      <Text style={styles.optionText}>Diesel Only</Text>
                    </Row>
                    <Row>
                      <Badge success style={styles.badge}>
                        <Text style={styles.badgeText}>Diesel</Text>
                      </Badge>
                    </Row>
                    <Row>
                      <TouchableOpacity
                        onPress={() => setFuelTypePreference("diesel")}
                      >
                        <RadioButton checked={fuelTypePreference == "diesel"} />
                      </TouchableOpacity>
                    </Row>
                  </Col>
                  {/* Diesel only */}

                  <Col style={styles.center}>
                    <Row>
                      <Text style={styles.optionText}>Gas/Diesel toggle</Text>
                    </Row>
                    <Row style={{ alignSelf: "flex-start" }}>
                      <Badge
                        style={[
                          styles.badge,
                          {
                            backgroundColor: "#aaa",
                            paddingRight: 20,
                            height: 22,
                            marginTop: 2,
                          },
                        ]}
                      >
                        <Text style={[styles.badgeText, { fontWeight: "200" }]}>
                          Gas
                        </Text>
                      </Badge>
                      <Badge
                        success
                        style={[
                          styles.badge,
                          {
                            position: "absolute",
                            left: 36,
                          },
                        ]}
                      >
                        <Text style={styles.badgeText}>Diesel</Text>
                      </Badge>
                    </Row>
                    <Row>
                      <TouchableOpacity
                        onPress={() => setFuelTypePreference("gasAndDiesel")}
                      >
                        <RadioButton
                          checked={fuelTypePreference == "gasAndDiesel"}
                        />
                      </TouchableOpacity>
                    </Row>
                  </Col>
                  {/* Gas/Diesel */}
                </Row>
              </Grid>
            </Row>
            {/* Fuel Type */}

            <Row size={2} style={styles.preferenceSection}>
              <Grid>
                <Row size={1} style={{ flexDirection: "column" }}>
                  <Text style={styles.preferenceTitle}>Fuel Price Display</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontStyle: "italic",
                    }}
                  >
                    The price displayed in the app will be based on your fuel
                    preference below.
                  </Text>
                </Row>

                <Row size={2}>
                  <Col style={styles.center}>
                    <Row style={{ alignItems: "flex-end" }}>
                      <Text style={styles.optionText}>Regular</Text>
                    </Row>
                    <Row>
                      <Text style={styles.octaneText}>85-87 Octane</Text>
                    </Row>
                    <Row>
                      <TouchableOpacity
                        onPress={() => setFuelPricePreference("regular")}
                      >
                        <RadioButton
                          checked={fuelPricePreference == "regular"}
                        />
                      </TouchableOpacity>
                    </Row>
                  </Col>
                  {/* Regular */}

                  <Col style={styles.center}>
                    <Row
                      style={{
                        alignItems: "flex-end",
                        flexDirection: "column",
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          { fontStyle: "italic", fontWeight: "bold" },
                        ]}
                      >
                        Gasoline
                      </Text>
                      <Text style={styles.optionText}>Midgrade</Text>
                    </Row>
                    <Row>
                      <Text style={styles.octaneText}>88-90 Octane</Text>
                    </Row>
                    <Row>
                      <TouchableOpacity
                        onPress={() => setFuelPricePreference("midgrade")}
                      >
                        <RadioButton
                          checked={fuelPricePreference == "midgrade"}
                        />
                      </TouchableOpacity>
                    </Row>
                  </Col>
                  {/* midgrade */}

                  <Col style={styles.center}>
                    <Row style={{ alignItems: "flex-end" }}>
                      <Text style={styles.optionText}>Premium</Text>
                    </Row>
                    <Row>
                      <Text style={styles.octaneText}>91+ Octane</Text>
                    </Row>
                    <Row>
                      <TouchableOpacity
                        onPress={() => setFuelPricePreference("premium")}
                      >
                        <RadioButton
                          checked={fuelPricePreference == "premium"}
                        />
                      </TouchableOpacity>
                    </Row>
                  </Col>
                  {/* Premium */}
                </Row>
              </Grid>
              {/* Preference title */}
            </Row>
            {/* Fuel Price */}

            <Row size={2} style={styles.preferenceSection}>
              <Grid>
                <Row size={1}>
                  <Text style={styles.preferenceTitle}>Fuel Unit Price</Text>
                </Row>

                <Row size={2}>
                  <Col style={styles.center}>
                    <Row>
                      <Text style={styles.optionText}>Price Per Gallon</Text>
                    </Row>
                    <Row>
                      <TouchableOpacity
                        onPress={() => setFuelUnitPreference("pricePerGallon")}
                      >
                        <RadioButton
                          checked={fuelUnitPreference == "pricePerGallon"}
                        />
                      </TouchableOpacity>
                    </Row>
                  </Col>
                  {/* Price per gallon */}

                  <Col style={styles.center}>
                    <Row>
                      <Text style={styles.optionText}>Price Per Liter</Text>
                    </Row>
                    <Row>
                      <TouchableOpacity
                        onPress={() => setFuelUnitPreference("pricePerLiter")}
                      >
                        <RadioButton
                          checked={fuelUnitPreference == "pricePerLiter"}
                        />
                      </TouchableOpacity>
                    </Row>
                  </Col>
                  {/* Price per liter */}
                </Row>
              </Grid>
            </Row>
            {/* Fuel Unit */}
          </Grid>
        </Content>
      </Container>
    </Root>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontFamily: "Roboto_medium",
    textAlign: "center",
    color: "#333",
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontWeight: "700",
  },
  octaneText: {
    fontWeight: "100",
    fontFamily: "Roboto",
    paddingTop: 5,
  },
  preferenceSection: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  preferenceTitle: {
    fontWeight: "bold",
    fontStyle: "italic",
  },
});

export default PreferencesScreen;
