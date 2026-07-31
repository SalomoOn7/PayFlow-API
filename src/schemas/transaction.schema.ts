import { z } from "zod";

export const createTransactionSchema =
    z.object({
        amount: z.number().positive("Amount must be greater than 0"),
        paymentMethod: z.enum(["bank_transfer", "gopay"], {
            error: "Payment method must be bank_transfer or gopay",
        }),
        bank: z.enum(["bca", "bni", "bri", "permata"]).optional(),
    })
        .refine(
            (data) => data.paymentMethod !== "bank_transfer" || !!data.bank,
            {
                message: "Bank is required when payment method is bank_transfer",
                path: ["bank"],
            }
        );

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;