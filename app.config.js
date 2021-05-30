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
          foregroundImage: "./assets/images/logo.png",
          backgroundColor: "#FFFFFF"
        }
      },
      extra:{
        token_endpoint:'https://auth.mdshosted.com/auth/realms/mds/protocol/openid-connect/token'
      }
    }
}