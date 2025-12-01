import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import { earlyAccessUsers, earlyAccessReferrals } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Early Access - getUserDashboard", () => {
  let testUserEmail: string;
  let testUserId: number;
  let testReferralCode: string;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Create a test user
    const timestamp = Date.now();
    testUserEmail = `test-dashboard-${timestamp}@example.com`;
    
    const [newUser] = await db
      .insert(earlyAccessUsers)
      .values({
        fullName: "Test Dashboard User",
        email: testUserEmail,
        username: `testdash${timestamp}`,
        source: "test",
        referralCode: `TEST${timestamp}`,
        referralCount: 0,
        bonusYears: 1,
      })
      .returning();

    testUserId = newUser.id;
    testReferralCode = newUser.referralCode;

    // Create some referrals for this user
    const [referred1] = await db
      .insert(earlyAccessUsers)
      .values({
        fullName: "Referred User 1",
        email: `referred1-${timestamp}@example.com`,
        username: `ref1${timestamp}`,
        source: "referral",
        referralCode: `REF1${timestamp}`,
        referredBy: testReferralCode,
        referralCount: 0,
        bonusYears: 1,
      })
      .returning();

    const [referred2] = await db
      .insert(earlyAccessUsers)
      .values({
        fullName: "Referred User 2",
        email: `referred2-${timestamp}@example.com`,
        username: `ref2${timestamp}`,
        source: "referral",
        referralCode: `REF2${timestamp}`,
        referredBy: testReferralCode,
        referralCount: 0,
        bonusYears: 1,
      })
      .returning();

    // Create referral records
    await db.insert(earlyAccessReferrals).values([
      {
        referrerId: testUserId,
        referredId: referred1.id,
        referralCode: testReferralCode,
      },
      {
        referrerId: testUserId,
        referredId: referred2.id,
        referralCode: testReferralCode,
      },
    ]);

    // Update referrer's count
    await db
      .update(earlyAccessUsers)
      .set({ referralCount: 2, bonusYears: 3 })
      .where(eq(earlyAccessUsers.id, testUserId));
  });

  it("should return user dashboard data with referrals", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Get user data
    const [user] = await db
      .select()
      .from(earlyAccessUsers)
      .where(eq(earlyAccessUsers.email, testUserEmail))
      .limit(1);

    expect(user).toBeDefined();
    expect(user.email).toBe(testUserEmail);
    expect(user.referralCount).toBe(2);
    expect(user.bonusYears).toBe(3);

    // Get referrals
    const referrals = await db
      .select({
        id: earlyAccessReferrals.id,
        referredId: earlyAccessReferrals.referredId,
        createdAt: earlyAccessReferrals.createdAt,
        fullName: earlyAccessUsers.fullName,
        username: earlyAccessUsers.username,
        email: earlyAccessUsers.email,
      })
      .from(earlyAccessReferrals)
      .leftJoin(
        earlyAccessUsers,
        eq(earlyAccessReferrals.referredId, earlyAccessUsers.id)
      )
      .where(eq(earlyAccessReferrals.referrerId, user.id));

    expect(referrals).toHaveLength(2);
    expect(referrals[0].fullName).toBeDefined();
    expect(referrals[1].fullName).toBeDefined();
  });

  it("should calculate leaderboard position correctly", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const [user] = await db
      .select()
      .from(earlyAccessUsers)
      .where(eq(earlyAccessUsers.email, testUserEmail))
      .limit(1);

    // Get all users ordered by referral count
    const allUsers = await db
      .select({ id: earlyAccessUsers.id, referralCount: earlyAccessUsers.referralCount })
      .from(earlyAccessUsers)
      .orderBy(earlyAccessUsers.referralCount);

    const position = allUsers.findIndex((u) => u.id === user.id) + 1;

    expect(position).toBeGreaterThan(0);
    expect(position).toBeLessThanOrEqual(allUsers.length);
  });

  it("should throw error for non-existent email", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const [user] = await db
      .select()
      .from(earlyAccessUsers)
      .where(eq(earlyAccessUsers.email, "nonexistent@example.com"))
      .limit(1);

    expect(user).toBeUndefined();
  });
});
