const axios = require('axios');
const TronWeb = require('tronweb');

const TRON_NODE = "https://api.trongrid.io/"; //https://api.nileex.io https://api.trongrid.io/
const PRIVATE_KEY = "YOUR_PRIVATE_KEY";

const tronWeb =  new TronWeb(
    new TronWeb.providers.HttpProvider( TRON_NODE ),
    new TronWeb.providers.HttpProvider( TRON_NODE ),
    TRON_NODE,
    PRIVATE_KEY //this should match origin address
);

const API_SERVER = "https://api.tronenergy.market";
const SERVER_ADDRESS = "TEMkRxLtCCdL4BCwbPXbbNWe4a9gtJ7kq7"
const MARKET = 'Open';
const ORIGIN = tronWeb.defaultAddress.base58;
const TARGET = "TAtPNH8sNWHJXFaZPAQJu9fMasGZMTnbnj";
const RESOURCE = 0; //0 energy, 1 bandwidth
const PRICE = 50; //suns per day, whatever price you want
const AMOUNT = 20000; //energy amount points, min 100000
const DURATION = 259200; //3 days (it's only allowed 3 days right now)
const PAYMENT = parseInt(((PRICE * AMOUNT * DURATION) / 86400).toFixed(0));
const PARTFILL = true; //true for allowing several address to fill your order. if false it will force to only be allowed from 1 address
const BULK = false; //true for creating several orders at once with the same energy, for this working target must be an array of address and payment must be the total of the orders.

const signed_ms = undefined;//not used right now, only for credits

async function BuyTest()
{
    //we sign the tx
    const raw_tx  = await tronWeb.transactionBuilder.sendTrx(SERVER_ADDRESS, PAYMENT , ORIGIN);
    const signed_tx = await tronWeb.trx.sign( raw_tx );

    //we send the order
    let params = 
    {
        market: MARKET,
        address: ORIGIN,
        target: TARGET,
        payment: PAYMENT,
        resource: RESOURCE,
        duration: DURATION,
        price: PRICE,
        partfill: PARTFILL,
        bulk: BULK,
        signed_ms: signed_ms,
        signed_tx: JSON.stringify(signed_tx)
    }

    const POST_URL = `${API_SERVER}/order/new`;
    axios.post(POST_URL, params,)
    .then((res)=>
    {
        console.log("all ok, order created");
        console.log(res.data); //order created response in res.data { order: 1644 }
    })
    .catch((error) =>
    {
        console.error("woops, something wrong happened!");
        console.error(error);
    });
}

BuyTest();