require("dotenv").config();
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

const Moralis = require("moralis").default;
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;

async function serverStart() {
  try {
    console.log("Initializing Moralis...");
    await Moralis.start({
      apiKey: MORALIS_API_KEY,
    });
    console.log("Moralis Initialized");

    console.log("Starting Express server...");
    app.listen(PORT, () => {
      console.log("Server Listening on PORT:", PORT);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

async function getBalance(walletAddress) {
  try {
    const response = await Moralis.EvmApi.balance.getNativeBalance({
      chain: "0xa4b1",
      address: walletAddress,
    });

    const balance = response.raw.balance;
    return balance;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

serverStart();

app.get("/balance/:walletAddress", async (request, response) => {
  try {
    const walletAddress = request.params.walletAddress;
    const balance = await getBalance(walletAddress);
    response.json({ walletAddress, balance });
  } catch (error) {
    response.status(500).json({ error: "Failed to retrieve native balance" });
  }
});

async function getNFTs(walletAddress) {
  try {
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: "0xa4b1",
      format: "decimal",
      mediaItems: true,
      address: walletAddress,
    });
    return response.result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

app.get("/nft/:walletAddress", async (request, response) => {
  try {
    const walletAddress = request.params.walletAddress;
    const nfts = await getNFTs(walletAddress);
    response.json({ walletAddress, nfts });
  } catch (error) {
    response.status(500).json({ error: "Failed to retrieve NFTs" });
  }
});
