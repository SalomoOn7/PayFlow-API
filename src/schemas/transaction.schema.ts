import { z } from "zod";

export const createTransactionSchema = z.object({
    amount: z.number().positive("Amount must be greater than 0"),
    paymentMethod: z.enum(["bank_transfer", "gopay"], {
        error: () => ({ message: "Payment method must be bank_transfer or gopay" }),
    }),
    bank: z.enum(["bca", "bni", "bri", "permata"]).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;