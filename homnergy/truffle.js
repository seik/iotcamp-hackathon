// Allows us to use ES6 in our migrations and tests.
require("babel-register");
require('dotenv').config()

const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4600000,
      gasPrice: 4e9,
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(privateKey, "https://rinkeby.infura.io/" + process.env.INFURA_TOKEN,)
      },
      network_id: 4,
      gas: 4600000,
      gasPrice: 1e9,
    }  
  }
};
