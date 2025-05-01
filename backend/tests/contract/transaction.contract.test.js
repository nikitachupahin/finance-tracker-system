// tests/contract/transaction.contract.test.js

import { createTransaction } from "../../services/transactionService.js";
import { registerUser } from "../../services/authService.js";
import { pool } from "../../libs/database.js";

describe("Contract: Create Transaction", () => {
  let userId;

  beforeAll(async () => {
    const user = await registerUser(
      "TransactionContractUser",
      "contract.transaction@test.com",
      "SecurePass456!"
    );
    userId = user.id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM transactions WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    await pool.end();
  });

  test("created transaction matches contract", async () => {
    const transaction = await createTransaction(
      userId,
      75.5,
      "expense",
      "groceries",
      "Weekly supermarket trip"
    );

    expect(transaction).toMatchObject({
      id: expect.any(String),
      user_id: userId,
      amount: "75.50",
      type: "expense",
      category: "groceries",
      description: "Weekly supermarket trip",
      transaction_date: expect.anything(),
    });

    expect(new Date(transaction.transaction_date).toString()).not.toBe(
      "Invalid Date"
    );
  });
});
