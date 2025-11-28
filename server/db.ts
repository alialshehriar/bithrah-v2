import { and, desc, eq, gte, isNotNull, like, lt, lte, or, sql } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  InsertUser,
  users,
  ideas,
  projects,
  projectPackages,
  projectBackings,
  negotiations,
  negotiationMessages,
  referrals,
  commissions,
  communityPosts,
  communityComments,
  communityReactions,
  follows,
  notifications,
  userWallets,
  walletTransactions,
  projectTeamMembers,
  projectMedia,
  projectLinks,
  projectUpdates,
  projectComments,
  type Idea,
  type Project,
  type CommunityPost,
  type Negotiation,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  const dbUrl = ENV.databaseUrl || process.env.DATABASE_URL;
  if (!_db && dbUrl) {
    try {
      const sql = neon(dbUrl);
      _db = drizzle(sql);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ═══════════════════════════════════════════════════════════════════════════════
// USER HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const now = new Date();
    const values: InsertUser = {
      openId: user.openId,
      email: user.email || "",
      createdAt: now,
      updatedAt: now,
      lastSignedIn: user.lastSignedIn || now,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    updateSet.updatedAt = now;

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = now;
      updateSet.updatedAt = now;
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUser(userId: number, updates: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return getUserById(userId);
}

// ═══════════════════════════════════════════════════════════════════════════════
// IDEA HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function createIdea(idea: typeof ideas.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const [result] = await db.insert(ideas).values({
    ...idea,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return getIdeaById(Number(result.id));
}

export async function getIdeaById(ideaId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(ideas).where(eq(ideas.id, ideaId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getIdeasByUser(userId: number, includeDemo: boolean = false) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(ideas.userId, userId)];
  if (!includeDemo) {
    conditions.push(eq(ideas.isDemo, false));
  }

  return db
    .select()
    .from(ideas)
    .where(and(...conditions))
    .orderBy(desc(ideas.createdAt));
}

export async function updateIdea(ideaId: number, updates: Partial<typeof ideas.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(ideas)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(ideas.id, ideaId));

  return getIdeaById(ideaId);
}

export async function deleteIdea(ideaId: number) {
  const db = await getDb();
  if (!db) return false;

  await db.update(ideas).set({ deletedAt: new Date() }).where(eq(ideas.id, ideaId));
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function createProject(project: typeof projects.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const [result] = await db.insert(projects).values({
    ...project,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return getProjectById(Number(result.id));
}

export async function getProjectById(projectId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProjectBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProjects(filters: {
  status?: string;
  userId?: number;
  includeDemo?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters.status) {
    conditions.push(eq(projects.status, filters.status as any));
  }
  if (filters.userId) {
    conditions.push(eq(projects.userId, filters.userId));
  }
  if (!filters.includeDemo) {
    conditions.push(eq(projects.isDemo, false));
  }

  let query = db
    .select()
    .from(projects)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(projects.createdAt));

  if (filters.limit) {
    query = query.limit(filters.limit) as any;
  }
  if (filters.offset) {
    query = query.offset(filters.offset) as any;
  }

  return query;
}

export async function updateProject(projectId: number, updates: Partial<typeof projects.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(projects)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(projects.id, projectId));

  return getProjectById(projectId);
}

export async function deleteProject(projectId: number) {
  const db = await getDb();
  if (!db) return false;

  await db.update(projects).set({ deletedAt: new Date() }).where(eq(projects.id, projectId));
  return true;
}

export async function getProjectPackages(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(projectPackages)
    .where(eq(projectPackages.projectId, projectId))
    .orderBy(projectPackages.displayOrder);
}

export async function getProjectTeamMembers(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(projectTeamMembers)
    .where(eq(projectTeamMembers.projectId, projectId))
    .orderBy(projectTeamMembers.displayOrder);
}

export async function getProjectMedia(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(projectMedia)
    .where(eq(projectMedia.projectId, projectId))
    .orderBy(projectMedia.displayOrder);
}

export async function getProjectLinks(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(projectLinks).where(eq(projectLinks.projectId, projectId));
}

export async function getProjectUpdates(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(projectUpdates)
    .where(eq(projectUpdates.projectId, projectId))
    .orderBy(desc(projectUpdates.createdAt));
}

export async function getProjectComments(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(projectComments)
    .where(and(eq(projectComments.projectId, projectId), eq(projectComments.isDeleted, false)))
    .orderBy(desc(projectComments.createdAt));
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEGOTIATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function createNegotiation(negotiation: typeof negotiations.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const [result] = await db.insert(negotiations).values({
    ...negotiation,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return getNegotiationById(Number(result.id));
}

export async function getNegotiationById(negotiationId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(negotiations)
    .where(eq(negotiations.id, negotiationId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getNegotiationsByProject(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(negotiations)
    .where(eq(negotiations.projectId, projectId))
    .orderBy(desc(negotiations.createdAt));
}

export async function getNegotiationsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(negotiations)
    .where(or(eq(negotiations.investorId, userId), eq(negotiations.projectOwnerId, userId)))
    .orderBy(desc(negotiations.createdAt));
}

export async function updateNegotiation(
  negotiationId: number,
  updates: Partial<typeof negotiations.$inferInsert>
) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(negotiations)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(negotiations.id, negotiationId));

  return getNegotiationById(negotiationId);
}

export async function getNegotiationMessages(negotiationId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(negotiationMessages)
    .where(eq(negotiationMessages.negotiationId, negotiationId))
    .orderBy(negotiationMessages.createdAt);
}

export async function createNegotiationMessage(message: typeof negotiationMessages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const [result] = await db.insert(negotiationMessages).values({
    ...message,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return result.id;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REFERRAL & COMMISSION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function createReferral(referral: typeof referrals.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const [result] = await db.insert(referrals).values({
    ...referral,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return result.id;
}

export async function getReferralByCode(referralCode: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referralCode, referralCode))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getReferralsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerUserId, userId))
    .orderBy(desc(referrals.createdAt));
}

export async function updateReferral(referralId: number, updates: Partial<typeof referrals.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(referrals)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(referrals.id, referralId));
}

export async function createCommission(commission: typeof commissions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const [result] = await db.insert(commissions).values({
    ...commission,
    createdAt: now,
  }).returning();

  return result.id;
}

export async function getCommissionsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(commissions)
    .where(eq(commissions.userId, userId))
    .orderBy(desc(commissions.createdAt));
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMUNITY HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function createCommunityPost(post: typeof communityPosts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const [result] = await db.insert(communityPosts).values({
    ...post,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return getCommunityPostById(Number(result.id));
}

export async function getCommunityPostById(postId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(communityPosts)
    .where(eq(communityPosts.id, postId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCommunityPosts(filters: {
  userId?: number;
  includeDemo?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(communityPosts.isDeleted, false), eq(communityPosts.isHidden, false)];

  if (filters.userId) {
    conditions.push(eq(communityPosts.userId, filters.userId));
  }
  if (!filters.includeDemo) {
    conditions.push(eq(communityPosts.isDemo, false));
  }

  let query = db
    .select()
    .from(communityPosts)
    .where(and(...conditions))
    .orderBy(desc(communityPosts.createdAt));

  if (filters.limit) {
    query = query.limit(filters.limit) as any;
  }
  if (filters.offset) {
    query = query.offset(filters.offset) as any;
  }

  return query;
}

export async function updateCommunityPost(
  postId: number,
  updates: Partial<typeof communityPosts.$inferInsert>
) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(communityPosts)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(communityPosts.id, postId));

  return getCommunityPostById(postId);
}

export async function deleteCommunityPost(postId: number) {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(communityPosts)
    .set({ isDeleted: true, deletedAt: new Date() })
    .where(eq(communityPosts.id, postId));
  return true;
}

export async function getPostComments(postId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(communityComments)
    .where(and(eq(communityComments.postId, postId), eq(communityComments.isDeleted, false)))
    .orderBy(communityComments.createdAt);
}

export async function createComment(comment: typeof communityComments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const [result] = await db.insert(communityComments).values({
    ...comment,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return result.id;
}

export async function toggleReaction(reaction: typeof communityReactions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if reaction exists
  const conditions = [eq(communityReactions.userId, reaction.userId)];
  if (reaction.postId) {
    conditions.push(eq(communityReactions.postId, reaction.postId));
  }
  if (reaction.commentId) {
    conditions.push(eq(communityReactions.commentId, reaction.commentId));
  }

  const existing = await db
    .select()
    .from(communityReactions)
    .where(and(...conditions))
    .limit(1);

  if (existing.length > 0) {
    // Remove reaction
    await db.delete(communityReactions).where(eq(communityReactions.id, existing[0].id));
    return { action: "removed" };
  } else {
    // Add reaction
    const now = new Date();
    await db.insert(communityReactions).values({
      ...reaction,
      createdAt: now,
    });
    return { action: "added" };
  }
}

export async function followUser(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  await db.insert(follows).values({
    followerId,
    followingId,
    createdAt: now,
  });
}

export async function unfollowUser(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) return false;

  await db
    .delete(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
  return true;
}

export async function isFollowing(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
    .limit(1);

  return result.length > 0;
}

export async function getFollowers(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(follows).where(eq(follows.followingId, userId));
}

export async function getFollowing(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(follows).where(eq(follows.followerId, userId));
}

// ═══════════════════════════════════════════════════════════════════════════════
// WALLET HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getUserWallet(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userWallets).where(eq(userWallets.userId, userId)).limit(1);

  if (result.length > 0) {
    return result[0];
  }

  // Create wallet if doesn't exist
  const now = new Date();
  await db.insert(userWallets).values({
    userId,
    createdAt: now,
    updatedAt: now,
  });

  return getUserWallet(userId);
}

export async function getWalletTransactions(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(walletTransactions)
    .where(eq(walletTransactions.userId, userId))
    .orderBy(desc(walletTransactions.createdAt))
    .limit(limit);
}

export async function createWalletTransaction(transaction: typeof walletTransactions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const [result] = await db.insert(walletTransactions).values({
    ...transaction,
    createdAt: now,
  }).returning();

  return result.id;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function createNotification(notification: typeof notifications.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const [result] = await db.insert(notifications).values({
    ...notification,
    createdAt: now,
  }).returning();

  return result.id;
}

export async function getUserNotifications(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(notifications.id, notificationId));
  return true;
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATISTICS HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getStatistics() {
  const db = await getDb();
  if (!db) return null;

  const [totalUsers] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.isActive, true));

  const [totalProjects] = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .where(and(eq(projects.status, "published"), eq(projects.isDemo, false)));

  const [totalIdeas] = await db
    .select({ count: sql<number>`count(*)` })
    .from(ideas)
    .where(eq(ideas.isDemo, false));

  const [openNegotiations] = await db
    .select({ count: sql<number>`count(*)` })
    .from(negotiations)
    .where(or(eq(negotiations.status, "open"), eq(negotiations.status, "in_progress")));

  return {
    totalUsers: totalUsers?.count || 0,
    totalProjects: totalProjects?.count || 0,
    totalIdeas: totalIdeas?.count || 0,
    openNegotiations: openNegotiations?.count || 0,
  };
}


// ============================================================================
// Investor Dashboard Helpers
// ============================================================================

export async function getEvaluatedIdeas(filters: {
  sectors?: string[];
  scoreMin?: number;
  scoreMax?: number;
  stages?: string[];
  budgetMin?: number;
  budgetMax?: number;
  search?: string;
  sortBy: "newest" | "highest_score" | "lowest_budget";
  limit: number;
  offset: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Build WHERE conditions
  const conditions = [
    eq(ideas.evaluationStatus, "completed"),
    isNotNull(ideas.overallScore),
  ];

  // Sector filter
  if (filters.sectors && filters.sectors.length > 0) {
    conditions.push(
      or(...filters.sectors.map((sector) => eq(ideas.sector, sector)))!
    );
  }

  // Score range filter
  if (filters.scoreMin !== undefined) {
    conditions.push(gte(ideas.overallScore, filters.scoreMin.toString()));
  }
  if (filters.scoreMax !== undefined) {
    conditions.push(lte(ideas.overallScore, filters.scoreMax.toString()));
  }

  // Stage filter
  if (filters.stages && filters.stages.length > 0) {
    conditions.push(
      or(...filters.stages.map((stage) => eq(ideas.stage, stage)))!
    );
  }

  // Budget range filter (search in financialNeeds text field)
  if (filters.budgetMin !== undefined || filters.budgetMax !== undefined) {
    // This is a simplified approach - in production, consider adding a dedicated numeric budget field
    // For now, we'll skip budget filtering on text field
  }

  // Search filter (name + description)
  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      or(
        like(ideas.ideaName, searchTerm),
        like(ideas.ideaDescription, searchTerm)
      )!
    );
  }

  // Build ORDER BY
  let orderByClause;
  switch (filters.sortBy) {
    case "highest_score":
      orderByClause = desc(ideas.overallScore);
      break;
    case "lowest_budget":
      // For now, sort by createdAt as budget is text field
      orderByClause = desc(ideas.createdAt);
      break;
    case "newest":
    default:
      orderByClause = desc(ideas.createdAt);
      break;
  }

  const result = await db
    .select()
    .from(ideas)
    .where(and(...conditions))
    .orderBy(orderByClause)
    .limit(filters.limit)
    .offset(filters.offset);

  return result;
}

export async function countEvaluatedIdeas(filters: {
  sectors?: string[];
  scoreMin?: number;
  scoreMax?: number;
  stages?: string[];
  budgetMin?: number;
  budgetMax?: number;
  search?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Build WHERE conditions (same as getEvaluatedIdeas)
  const conditions = [
    eq(ideas.evaluationStatus, "completed"),
    isNotNull(ideas.overallScore),
  ];

  if (filters.sectors && filters.sectors.length > 0) {
    conditions.push(
      or(...filters.sectors.map((sector) => eq(ideas.sector, sector)))!
    );
  }

  if (filters.scoreMin !== undefined) {
    conditions.push(gte(ideas.overallScore, filters.scoreMin.toString()));
  }
  if (filters.scoreMax !== undefined) {
    conditions.push(lte(ideas.overallScore, filters.scoreMax.toString()));
  }

  if (filters.stages && filters.stages.length > 0) {
    conditions.push(
      or(...filters.stages.map((stage) => eq(ideas.stage, stage)))!
    );
  }

  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      or(
        like(ideas.ideaName, searchTerm),
        like(ideas.ideaDescription, searchTerm)
      )!
    );
  }

  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(ideas)
    .where(and(...conditions));

  return result?.count || 0;
}

export async function getEvaluationStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Total evaluated ideas
  const [totalEvaluated] = await db
    .select({ count: sql<number>`count(*)` })
    .from(ideas)
    .where(
      and(
        eq(ideas.evaluationStatus, "completed"),
        isNotNull(ideas.overallScore)
      )
    );

  // Excellent ideas (score >= 80)
  const [excellentIdeas] = await db
    .select({ count: sql<number>`count(*)` })
    .from(ideas)
    .where(
      and(
        eq(ideas.evaluationStatus, "completed"),
        gte(ideas.overallScore, "80")
      )
    );

  // Good ideas (score 60-79)
  const [goodIdeas] = await db
    .select({ count: sql<number>`count(*)` })
    .from(ideas)
    .where(
      and(
        eq(ideas.evaluationStatus, "completed"),
        gte(ideas.overallScore, "60"),
        lt(ideas.overallScore, "80")
      )
    );

  // Average score
  const [avgScore] = await db
    .select({ avg: sql<number>`avg(CAST(${ideas.overallScore} AS DECIMAL))` })
    .from(ideas)
    .where(
      and(
        eq(ideas.evaluationStatus, "completed"),
        isNotNull(ideas.overallScore)
      )
    );

  return {
    totalIdeas: totalEvaluated?.count || 0,
    excellentIdeas: excellentIdeas?.count || 0,
    goodIdeas: goodIdeas?.count || 0,
    averageScore: avgScore?.avg ? parseFloat(avgScore.avg.toFixed(1)) : 0,
  };
}


// Get user stats (ideas, projects, followers, points)
export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not initialized");

  // Count ideas
  const ideasResult = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(ideas)
    .where(eq(ideas.userId, userId));
  const ideasCount = ideasResult[0]?.count || 0;

  // Count projects
  const projectsResult = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(projects)
    .where(eq(projects.userId, userId));
  const projectsCount = projectsResult[0]?.count || 0;

  // Count followers (assuming you have a followers table)
  // For now, return 0
  const followersCount = 0;

  // Get points from user_wallets
  const wallet = await db
    .select()
    .from(userWallets)
    .where(eq(userWallets.userId, userId))
    .limit(1);
  const points = parseFloat(wallet[0]?.availableBalance || '0');

  return {
    ideasCount,
    projectsCount,
    followersCount,
    points,
  };
}
