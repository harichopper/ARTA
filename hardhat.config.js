require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    fuji: {
      url: process.env.FUJI_RPC,
      chainId: 43113, // Fuji Testnet Chain ID
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
