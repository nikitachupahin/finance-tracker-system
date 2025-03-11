import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

const transactionSchema = {
  type: "object",
  properties: {
    amount: { type: "number", minimum: 0.01 },
    type: { type: "string", enum: ["income", "expense"] },
    category: { type: "string", minLength: 2 },
    description: { type: "string", minLength: 2, maxLength: 255 },
  },
  required: ["amount", "type", "category"],
};

const validateTransaction = (req, res, next) => {
  const validate = ajv.compile(transactionSchema);
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).json({
      message: "Invalid transaction data",
      errors: validate.errors,
    });
  }
  next();
};

export default validateTransaction;
