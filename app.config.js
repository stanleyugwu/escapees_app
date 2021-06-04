import 'dotenv/config';

module.exports = ({config}) => {
    return {
      ...config,
      android: {
        allowBackup: false,
        package: "com.escapees.fuelapp",
        config: {
          googleMaps: {
            apiKey: process.env && process.env.googleMapApiKey ? process.env.googleMapApiKey : 'none'
          },
        },
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#FFFFFF"
        }
      },
      extra:{
        token_endpoint:'https://auth.mdshosted.com/auth/realms/mds/protocol/openid-connect/token',
        storeKey: 'eskp_pv_data',
        stations_data_endpoint:'https://cportal.mdshosted.com/api/1.0/mobile/getAllStationLocations'
      }
    }
}