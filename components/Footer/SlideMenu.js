import React from 'react';
import { Grid, Row, Col } from 'react-native-easy-grid';
import {Icon, Text} from 'native-base';
import { TouchableOpacity, StyleSheet } from 'react-native';

const SlideMenu = (props) => {
    let {menuVisible, setMenuVisible, navigate} = props;
    return (
        <Grid
            style={{
              backgroundColor: "white",
              width: "100%",
              display: menuVisible ? "flex" : "none",
              maxHeight:'40%'
            }}
          >
            <Row style={{ maxHeight: 30 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#606060",
                  width: "100%",
                  ...styles.Center,
                }}
                onPress={() => setMenuVisible(false)}
              >
                <Icon
                  name="chevron-thin-down"
                  type="Entypo"
                  style={{ color: "white", fontWeight: "700" }}
                />
              </TouchableOpacity>
            </Row>
            {/* Close button */}

            <Row style={styles.RowStyle}>
              <TouchableOpacity
                style={styles.MenuItemTouchable}
                onPress={() => navigate("Preferences")}
              >
                <Col size={33} style={styles.MenuItemIconWrapper}>
                  <Icon name="star-sharp" type="Ionicons" />
                </Col>
                <Col size={67} style={styles.MenuItemTextWrapper}>
                  <Text style={styles.MenuItemText}>Preferences</Text>
                </Col>
              </TouchableOpacity>
            </Row>
            {/* menu items (preferences)*/}

            <Row style={styles.RowStyle}>
              <TouchableOpacity
                style={styles.MenuItemTouchable}
                onPress={() => navigate("Transactions")}
              >
                <Col size={33} style={styles.MenuItemIconWrapper}>
                  <Icon name="receipt" type="MaterialCommunityIcons" />
                </Col>
                <Col size={67} style={styles.MenuItemTextWrapper}>
                  <Text style={styles.MenuItemText}>Transaction History</Text>
                </Col>
              </TouchableOpacity>
            </Row>
            {/* menu items (transaction history)*/}

            <Row style={styles.RowStyle}>
              <TouchableOpacity style={styles.MenuItemTouchable}>
                <Col size={33} style={styles.MenuItemIconWrapper}>
                  <Icon name="account-circle" type="MaterialIcons" />
                </Col>
                <Col size={67} style={styles.MenuItemTextWrapper}>
                  <Text style={styles.MenuItemText}>Account Info</Text>
                </Col>
              </TouchableOpacity>
            </Row>
            {/* menu items (Account Info)*/}

            <Row style={styles.RowStyle}>
              <TouchableOpacity style={styles.MenuItemTouchable}>
                <Col size={33} style={styles.MenuItemIconWrapper}>
                  <Icon name="help" type="MaterialIcons" />
                </Col>
                <Col size={67} style={styles.MenuItemTextWrapper}>
                  <Text style={styles.MenuItemText}>Help and Instructions</Text>
                </Col>
              </TouchableOpacity>
            </Row>
            {/* menu items (Help and Instruction)*/}
        </Grid>
    )
}

const styles = StyleSheet.create({
    Center: {
        alignItems: "center",
        justifyContent: "center",
    },
    RowStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#999",
    },
    MenuItemTouchable: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    MenuItemIconWrapper: {
        alignItems: "flex-end",
        marginRight: 20,
    },
    MenuItemTextWrapper: {
        alignItems: "flex-start",
    },
    MenuItemText: {
        color: "#323232",
        fontFamily: "Roboto_medium",
    },
})

export default SlideMenu