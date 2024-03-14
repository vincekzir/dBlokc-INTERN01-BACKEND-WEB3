require("dotenv").config();

const Moralis = require("moralis").default;
const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3000;
// const MoralisAPIKey = process.env.MORALIS_API_KEY;
// const walletAddress = process.env.WALLET_ADDRESS;
const MoralisAPIKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjdmNjgwYWVhLWE2OGItNDJhYi05ZDUyLTUyMTIyMjRhZDViZCIsIm9yZ0lkIjoiMzgyNzY5IiwidXNlcklkIjoiMzkzMzAxIiwidHlwZUlkIjoiOWRmNjRlODgtYWVmOS00ODQ2LThiYjEtYTc0YjA3YWVkMTk4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTA0MTc3ODAsImV4cCI6NDg2NjE3Nzc4MH0.R0QKKvWYZdotV5CBZOcoSvOFkhILDAapuPBCAHujV_w";
const walletAddress = "0xf56a40f8f80e114e82c3568f42a596aa96468c05";

async function serverStart() {
  try {
    console.log("Initializing Moralis...");
    await Moralis.start({
      apiKey: MoralisAPIKey,
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

serverStart();

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

app.get("/getNativeBalance/:walletAddress", async (request, response) => {
  try {
    const walletAddress = request.params.walletAddress;
    const balance = await getBalance(walletAddress);
    response.json({ walletAddress, balance });
  } catch (error) {
    response.status(500).json({ error: "Failed to retrieve native balance" });
  }
});
