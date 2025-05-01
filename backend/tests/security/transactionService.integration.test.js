import { pool } from "../../libs/database.js";
import {
  createTransaction,
  getUserTransactions,
  getUserSummary,
  deleteTransaction,
} from "../../services/transactionService.js";

describe("Integration: Transaction Service", () => {
  const testUserId = "482788ec-d438-4b67-8feb-3ddc1be64adb";

  afterEach(async () => {
    await pool.query("DELETE FROM transactions WHERE user_id = $1", [
      testUserId,
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  test("should create a transaction", async () => {
    const transaction = await createTransaction(
      testUserId,
      100,
      "income",
      "salary",
      "Salary for April"
    );

    expect(transaction).toHaveProperty("id");
    expect(transaction.user_id).toBe(testUserId);
    expect(transaction.type).toBe("income");
  });

  test("should get user transactions with and without filters", async () => {
    await createTransaction(testUserId, 100, "income", "salary", "May");
    await createTransaction(testUserId, 50, "expense", "food", "Lunch");
    await createTransaction(testUserId, 200, "income", "bonus", "Bonus");

    const incomeOnly = await getUserTransactions(testUserId, "income", null);
    expect(incomeOnly.every((tx) => tx.type === "income")).toBe(true);

    const salaryOnly = await getUserTransactions(testUserId, null, "salary");
    expect(salaryOnly.every((tx) => tx.category === "salary")).toBe(true);

    const all = await getUserTransactions(testUserId, null, null);
    expect(all.length).toBeGreaterThanOrEqual(3);
  });

  test("should get user summary", async () => {
    await createTransaction(testUserId, 100, "income", "salary", "June");
    await createTransaction(testUserId, 50, "expense", "food", "Lunch");

    const summary = await getUserSummary(testUserId);

    expect(parseFloat(summary.total_income)).toBe(100);
    expect(parseFloat(summary.total_expense)).toBe(50);
  });

  test("should delete a transaction", async () => {
    const tx = await createTransaction(
      testUserId,
      100,
      "income",
      "salary",
      "Sept"
    );
    const result = await deleteTransaction(testUserId, tx.id);
    expect(result).toBe(true);

    const remaining = await getUserTransactions(testUserId, "income", "salary");
    expect(remaining).toHaveLength(0);
  });
});
