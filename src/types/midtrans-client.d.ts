declare module "midtrans-client" {
    interface MidtransClientConfig {
        isProduction: boolean;
        clientKey: string;
        serverKey: string;
    }

    interface ChargeTransactionDetails {
        order_id: string;
        gross_amount: number;
    }

    interface ChargeParameter {
        payment_type: string;
        transaction_details: ChargeTransactionDetails;
        [key: string]: unknown;
    }

    interface ChargeResponse {
        status_code: string;
        status_message: string;
        transaction_id: string;
        order_id: string;
        gross_amount: string;
        payment_type: string;
        transaction_time: string;
        transaction_status: string;
        [key: string]: unknown;
    }

    class CoreApi {
        constructor(config: MidtransClientConfig);
        charge(parameter: ChargeParameter): Promise<ChargeResponse>;
        transaction: {
            status(orderId: string): Promise<ChargeResponse>;
            notification(payload: unknown): Promise<ChargeResponse>;
        };
    }

    class Snap {
        constructor(config: MidtransClientConfig);
        createTransaction(parameter: ChargeParameter): Promise<{
            token: string;
            redirect_url: string;
        }>;
    }

    const midtransClient: {
        CoreApi: typeof CoreApi;
        Snap: typeof Snap;
    };

    export default midtransClient;
}