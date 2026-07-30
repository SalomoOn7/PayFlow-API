import midtransClient from "midtrans-client";
import config from "./environment";

export const coreApi = new midtransClient.CoreApi({
    isProduction: config.midtransIsProduction,
    serverKey: config.midtransServerKey,
    clientKey: config.midtransClientKey,
});