import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

export const validateSchema = (schema, data) => {
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    throw new Error(`Validation error: ${JSON.stringify(validate.errors)}`);
  }
};
