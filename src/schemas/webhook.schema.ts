import { z } from "zod";


export const midtransNotificationSchema = z.object({
    order_id: z.string(),
    status_code: z.string(),
    gross_amount: z.string(),
    signature_key: z.string(),
    transaction_status: z.string(),
    fraud_status: z.string().optional(),
    payment_type: z.string(),
    transaction_id: z.string(),
})

export type MidtransNotification = z.infer<typeof midtransNotificationSchema>;