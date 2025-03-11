import Ajv from "ajv";
import addFormats from "ajv-formats";
import { transactionSchema } from "../schemas/transactionSchema.js";

const ajv = new Ajv();
addFormats(ajv);

export const validateSchema = (schema, data) => {
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    throw new Error(`Validation error: ${JSON.stringify(validate.errors)}`);
  }
};

export const validateTransaction = (req, res, next) => {
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

