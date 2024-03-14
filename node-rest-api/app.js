const express = require("express");
const Moralis = require("moralis").default;
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;
const MoralisAPIKey = process.env.MORALIS_API_KEY;
const walletAddress = process.env.WALLET_ADDRESS;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

// app.get("/status", (request, response) => {
//   const status = {
//     Status: "Running",
//   };

//   response.send(status);
// });

async function getNativeBalance() {
  try {
    await Moralis.start({
      apiKey: MoralisAPIKey,
    });

    const response = await Moralis.EvmApi.balance.getNativeBalance({
      chain: "0xa4b1",
      address: walletAddress,
    });

    console.log(response.raw);
  } catch (e) {
    console.error(e);
  }
}
