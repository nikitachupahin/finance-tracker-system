export const transactionSchema = {
  type: "object",
  properties: {
    amount: { type: "number", minimum: 0.01 },
    type: { type: "string", enum: ["income", "expense"] },
    category: { type: "string", minLength: 2 },
    description: { type: "string", minLength: 2, maxLength: 255 },
  },
  required: ["amount", "type", "category"],
};
