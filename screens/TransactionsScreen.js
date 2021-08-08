import React, { useState } from "react";
import {
  Root,
  Container,
  Content,
  Footer,
  Icon,
  View,
  Text,
  Grid,
  Row,
} from "native-base";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";

//components import
import AppHeader from "../components/AppHeader";
import FetchLoader from "../components/FetchLoader";

//local storage utils and adapters
import { storeData, retrieveData } from "../utils/localDataAdapters";
import getToken from "../adapters/get-token.adapter";
import getTransactions from "../adapters/transactions.adapter";

//Table components
import { Table, Row as TableRow } from "react-native-table-component";

const TransactionsScreen = (props) => {
  //transactions data mock
  const [transactions, setTransactions] = useState(null);

  const storeKey = "eskp_pv_transactions"; //transactions store key

  //fetch transactions data with refresh token
  const fetchAndStoreTransactions = async () => {
    console.log("loading transact");
    // setRefreshing(true);//table refreshing data

    let dataStoreKey = "eskp_pv_data";

    let storedData = await retrieveData(dataStoreKey, true);
    if (storedData && typeof storedData == "object" && "login" in storedData) {
      let { usernameOrEmail, password } = storedData["login"]; //stored login details

      getToken(usernameOrEmail, password)
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("Error");
        })
        .then((tokens) => {
          if (tokens && "access_token" in tokens) {
            return tokens["access_token"];
          } else throw Error("Error");
        })
        .then(async (accessToken) => {
          //fetch transactions
          let result = await getTransactions(accessToken);

          if (result instanceof Array) {
            //load transactions
            setTransactions(result);

            //store data
            let stored = storeData(storeKey, result, false);
            if (!stored) alert("error storing transactions data");
          } else if (result == false) throw Error("Error");
          //request error
          else throw Error(); //network internet error
        })
        .catch((error) => {
          //show error only when theres no data already rendered
          if (transactions == null) {
            if (error.message == "Error")
              setTransactions(`Couldn't Fetch Data, please try again`);
            //server error
            else
              setTransactions(
                `Failed, Check Your Internet Connection And Try Again`
              ); //internet error
          } else {
            //theres data alert
            Alert.alert(
              "Error!!",
              error.message == "Error"
                ? `Couldn't Fetch Data, please try again`
                : `Failed, Check Your Internet Connection And Try Again`
            );
          }
        });
    } else {
      return props.navigation.navigate("Login");
    }
  };

  //try get stored transactions
  retrieveData(storeKey, false)
    .then((data) => {
      if (data == null) return fetchAndStoreTransactions();
      else if (data instanceof Array) setTransactions(data);
      else throw Error("native read error");
    })
    .catch((e) => props.navigation.navigate("Login")); //any other case re-authenticate)

  //table head fields
  const tableHead = ["Date", "Station", "Qty", "Savings", "Total", "Status"];

  //generate 2D array from transaction history for Table package consumption
  const tableData =
    transactions instanceof Array &&
    transactions.map((transaction) => {
      let { transactionDate, programDescription, amount, status } = transaction;
      return [
        new Date(transactionDate).toLocaleDateString(),
        programDescription,
        amount,
        2.5,
        52.12,
        status,
      ];
    });

  //Error Warning Text
  const ErrorText = (text) => (
    <Text style={styles.ErrorWrapper}>
      <Grid style={styles.ErrorInner}>
        <Row>
          <Text style={styles.RefreshText}>{text}</Text>
        </Row>
        <Row>
          <Text style={styles.RefreshText}>Pull to refresh...</Text>
        </Row>
      </Grid>
    </Text>
  );

  //transactions table
  const TransactionsTable = () => (
    <View style={styles.Container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
        <TableRow
          data={tableHead}
          style={styles.head}
          textStyle={styles.text}
          widthArr={widthArr}
        />
      </Table>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={transactions == null ? true : false}
            onRefresh={fetchAndStoreTransactions}
          />
        }
      >
        <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
          {
            transactions == null /*loading*/ ? (
              <Text>Loading...</Text>
            ) : // <FetchLoader loadingText="Loading Transactions..."/>
            transactions instanceof Array &&
              transactions.length /*Filled Data */ ? (
              tableData.map((rowData, idx) => (
                <TableRow
                  key={idx}
                  data={rowData}
                  widthArr={widthArr}
                  style={[
                    styles.row,
                    idx % 2 && { backgroundColor: "#f1faff" },
                  ]}
                  textStyle={styles.text}
                />
              ))
            ) : transactions instanceof Array && !transactions.length ? (
              ErrorText("No Transactions Yet") //empty data
            ) : (
              ErrorText(transactions)
            ) /*Fetch Error */
          }
        </Table>
      </ScrollView>
    </View>
  );

  //table cells width array
  const widthArr = [85, 120, 80, 80, 80, 90];

  return (
    <Root>
      <Container>
        <AppHeader showViewStatusBar={false} />
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          padder
        >
          <TouchableOpacity
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#3597e2",
              width: 100,
            }}
            onPress={() => props.navigation.navigate("Home")}
          >
            <Icon
              name="chevron-left"
              type="Feather"
              style={{ color: "#3597e2", fontSize: 30 }}
            />
            <Text style={{ color: "#3597e2", fontWeight: "700" }}>BACK</Text>
          </TouchableOpacity>

          <ScrollView horizontal={true} scrollEnabled={true}>
            {TransactionsTable()}
          </ScrollView>
        </Content>
        <Footer style={styles.Footer}>
          <Text style={styles.FooterText}>
            Further details in customer portal
          </Text>
        </Footer>
      </Container>
    </Root>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  head: {
    height: 40,
    backgroundColor: "#b3c8da",
  },
  row: {
    height: 40,
    backgroundColor: "#fff",
  },
  text: {
    textAlign: "center",
    fontWeight: "100",
    fontFamily: "Roboto_medium",
    color: "#222",
  },
  ErrorWrapper: {
    height: 200,
    textAlignVertical: "center",
    textAlign: "center",
  },
  ErrorInner: {
    borderColor: "red",
    alignItems: "center",
    alignSelf: "center",
  },
  RefreshText: {
    fontFamily: "Roboto_medium",
  },
  Footer: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#777",
  },
  FooterText: {
    fontFamily: "Roboto_medium",
    color: "#777",
  },
});

export default TransactionsScreen;
