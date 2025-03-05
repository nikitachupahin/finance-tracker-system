export const signupSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 2 },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 3 },
  },
  required: ["name", "email", "password"],
};

export const signinSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 3 },
  },
  required: ["email", "password"],
};
