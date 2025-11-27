import {
  boolean,
  datetime,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
  decimal,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

// ═══════════════════════════════════════════════════════════════════════════════
// USERS & AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════════

export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    email: varchar("email", { length: 320 }),
    username: varchar("username", { length: 100 }),
    name: text("name"),
    passwordHash: varchar("passwordHash", { length: 255 }),
    loginMethod: varchar("loginMethod", { length: 64 }),

    // Profile Information
    bio: text("bio"),
    avatarUrl: varchar("avatarUrl", { length: 500 }),
    coverImageUrl: varchar("coverImageUrl", { length: 500 }),
    city: varchar("city", { length: 100 }),
    country: varchar("country", { length: 100 }).default("Saudi Arabia"),
    phone: varchar("phone", { length: 50 }),

    // User Type & Status
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    isVerified: boolean("isVerified").default(false).notNull(),
    isEarlyAccess: boolean("isEarlyAccess").default(false).notNull(),
    batch: varchar("batch", { length: 50 }), // early_access, beta, public
    isActive: boolean("isActive").default(true).notNull(),

    // Subscription
    subscriptionTier: mysqlEnum("subscriptionTier", ["free", "silver", "gold", "platinum"]).default("free").notNull(),
    subscriptionExpiresAt: datetime("subscriptionExpiresAt"),

    // Social Links
    websiteUrl: varchar("websiteUrl", { length: 500 }),
    twitterUrl: varchar("twitterUrl", { length: 500 }),
    linkedinUrl: varchar("linkedinUrl", { length: 500 }),
    instagramUrl: varchar("instagramUrl", { length: 500 }),

    // Settings
    emailNotifications: boolean("emailNotifications").default(true).notNull(),
    marketingEmails: boolean("marketingEmails").default(false).notNull(),
    language: varchar("language", { length: 10 }).default("ar").notNull(),
    timezone: varchar("timezone", { length: 50 }).default("Asia/Riyadh").notNull(),

    // Timestamps
    createdAt: datetime("createdAt").notNull(),
    updatedAt: datetime("updatedAt").notNull(),
    lastSignedIn: datetime("lastSignedIn").notNull(),
    deletedAt: datetime("deletedAt"),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    usernameIdx: uniqueIndex("username_idx").on(table.username),
  })
);

export const emailVerificationTokens = mysqlTable("emailVerificationTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: datetime("expiresAt").notNull(),
  createdAt: datetime("createdAt").notNull(),
  usedAt: datetime("usedAt"),
});

export const passwordResetTokens = mysqlTable("passwordResetTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: datetime("expiresAt").notNull(),
  createdAt: datetime("createdAt").notNull(),
  usedAt: datetime("usedAt"),
});

// ═══════════════════════════════════════════════════════════════════════════════
// IDEAS & EVALUATION
// ═══════════════════════════════════════════════════════════════════════════════

export const ideas = mysqlTable(
  "ideas",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

    // Idea Information
    ideaName: varchar("ideaName", { length: 255 }).notNull(),
    ideaDescription: text("ideaDescription").notNull(),
    sector: varchar("sector", { length: 100 }),
    category: varchar("category", { length: 100 }),
    stage: varchar("stage", { length: 100 }),
    technicalNeeds: text("technicalNeeds"),
    financialNeeds: text("financialNeeds"),

    // AI Evaluation Results
    evaluationStatus: mysqlEnum("evaluationStatus", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
    evaluationSummary: text("evaluationSummary"),
    strengths: text("strengths"),
    weaknesses: text("weaknesses"),
    risks: text("risks"),
    feasibilityOpinion: text("feasibilityOpinion"),
    strategicAnalysis: text("strategicAnalysis"),
    financialAnalysis: text("financialAnalysis"),
    marketAnalysis: text("marketAnalysis"),
    executionAnalysis: text("executionAnalysis"),
    growthStrategy: text("growthStrategy"),
    overallScore: decimal("overallScore", { precision: 3, scale: 2 }),

    // Conversion to Project
    convertedToProject: boolean("convertedToProject").default(false).notNull(),
    projectId: int("projectId"),

    // Demo Flag
    isDemo: boolean("isDemo").default(false).notNull(),

    // Timestamps
    createdAt: datetime("createdAt").notNull(),
    updatedAt: datetime("updatedAt").notNull(),
    evaluatedAt: datetime("evaluatedAt"),
    deletedAt: datetime("deletedAt"),
  },
  (table) => ({
    userIdIdx: index("ideas_user_id_idx").on(table.userId),
    statusIdx: index("ideas_status_idx").on(table.evaluationStatus),
    isDemoIdx: index("ideas_is_demo_idx").on(table.isDemo),
  })
);

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════════════════════════

export const projects = mysqlTable(
  "projects",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    ideaId: int("ideaId").references(() => ideas.id, { onDelete: "set null" }),

    // Basic Information
    projectName: varchar("projectName", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    tagline: varchar("tagline", { length: 500 }),
    description: text("description").notNull(),
    sector: varchar("sector", { length: 100 }),
    category: varchar("category", { length: 100 }),

    // Location
    city: varchar("city", { length: 100 }),
    country: varchar("country", { length: 100 }).default("Saudi Arabia"),

    // Financial Goals
    fundingGoal: decimal("fundingGoal", { precision: 15, scale: 2 }).notNull(),
    currentFunding: decimal("currentFunding", { precision: 15, scale: 2 }).default("0.00").notNull(),
    currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
    deadline: datetime("deadline"),

    // Media
    coverImageUrl: varchar("coverImageUrl", { length: 500 }),
    videoUrl: varchar("videoUrl", { length: 500 }),

    // Required Sections
    risksDescription: text("risksDescription"),
    fundUsageDescription: text("fundUsageDescription"),

    // Status & Workflow
    status: mysqlEnum("status", ["draft", "under_review", "published", "funded", "suspended", "completed"]).default("draft").notNull(),
    visibility: mysqlEnum("visibility", ["public", "private", "unlisted"]).default("public").notNull(),

    // Demo Flag
    isDemo: boolean("isDemo").default(false).notNull(),

    // Timestamps
    createdAt: datetime("createdAt").notNull(),
    updatedAt: datetime("updatedAt").notNull(),
    publishedAt: datetime("publishedAt"),
    fundedAt: datetime("fundedAt"),
    deletedAt: datetime("deletedAt"),
  },
  (table) => ({
    userIdIdx: index("projects_user_id_idx").on(table.userId),
    slugIdx: uniqueIndex("projects_slug_idx").on(table.slug),
    statusIdx: index("projects_status_idx").on(table.status),
    isDemoIdx: index("projects_is_demo_idx").on(table.isDemo),
  })
);

export const projectTeamMembers = mysqlTable("projectTeamMembers", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  memberName: varchar("memberName", { length: 255 }).notNull(),
  memberRole: varchar("memberRole", { length: 255 }).notNull(),
  memberBio: text("memberBio"),
  memberImageUrl: varchar("memberImageUrl", { length: 500 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: datetime("createdAt").notNull(),
});

export const projectMedia = mysqlTable("projectMedia", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  mediaType: mysqlEnum("mediaType", ["image", "video", "pdf", "document"]).notNull(),
  mediaUrl: varchar("mediaUrl", { length: 500 }).notNull(),
  mediaTitle: varchar("mediaTitle", { length: 255 }),
  mediaDescription: text("mediaDescription"),
  fileSize: int("fileSize"),
  mimeType: varchar("mimeType", { length: 100 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: datetime("createdAt").notNull(),
});

export const projectLinks = mysqlTable("projectLinks", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  linkType: mysqlEnum("linkType", ["website", "twitter", "linkedin", "instagram", "facebook", "other"]).notNull(),
  linkUrl: varchar("linkUrl", { length: 500 }).notNull(),
  linkTitle: varchar("linkTitle", { length: 255 }),
  createdAt: datetime("createdAt").notNull(),
});

export const projectUpdates = mysqlTable("projectUpdates", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  updateTitle: varchar("updateTitle", { length: 255 }).notNull(),
  updateContent: text("updateContent").notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

export const projectComments = mysqlTable("projectComments", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  parentCommentId: int("parentCommentId"),
  commentText: text("commentText").notNull(),
  isDeleted: boolean("isDeleted").default(false).notNull(),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT PACKAGES (REWARDS/TIERS)
// ═══════════════════════════════════════════════════════════════════════════════

export const projectPackages = mysqlTable("projectPackages", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),

  // Package Information
  packageName: varchar("packageName", { length: 255 }).notNull(),
  packageType: mysqlEnum("packageType", ["support", "negotiation_deposit"]).default("support").notNull(),
  packageAmount: decimal("packageAmount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  packageDescription: text("packageDescription"),

  // Limits
  isLimited: boolean("isLimited").default(false).notNull(),
  totalQuantity: int("totalQuantity"),
  claimedQuantity: int("claimedQuantity").default(0).notNull(),

  // Features/Benefits
  features: json("features").$type<string[]>(),

  // Display
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUPPORT & BACKING
// ═══════════════════════════════════════════════════════════════════════════════

export const projectBackings = mysqlTable("projectBackings", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  packageId: int("packageId").references(() => projectPackages.id, { onDelete: "set null" }),

  // Backing Details
  backingAmount: decimal("backingAmount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  backingType: mysqlEnum("backingType", ["support", "negotiation_deposit"]).default("support").notNull(),

  // Payment Status
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "processing", "completed", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentReference: varchar("paymentReference", { length: 255 }),

  // Referral
  referralCode: varchar("referralCode", { length: 100 }),
  referredByUserId: int("referredByUserId").references(() => users.id, { onDelete: "set null" }),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
  completedAt: datetime("completedAt"),
  refundedAt: datetime("refundedAt"),
});

// ═══════════════════════════════════════════════════════════════════════════════
// NEGOTIATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const negotiations = mysqlTable("negotiations", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  investorId: int("investorId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectOwnerId: int("projectOwnerId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Negotiation Details
  depositAmount: decimal("depositAmount", { precision: 15, scale: 2 }),
  depositStatus: mysqlEnum("depositStatus", ["pending", "paid", "refunded"]).default("pending").notNull(),

  // Status
  status: mysqlEnum("status", ["open", "in_progress", "closed_success", "closed_failed", "cancelled"]).default("open").notNull(),

  // Deal Details (if closed successfully)
  dealAmount: decimal("dealAmount", { precision: 15, scale: 2 }),
  dealTerms: text("dealTerms"),
  commissionType: mysqlEnum("commissionType", ["basic", "plus"]),
  bithrahCommission: decimal("bithrahCommission", { precision: 15, scale: 2 }),
  marketerCommission: decimal("marketerCommission", { precision: 15, scale: 2 }),

  // NDA
  ndaSigned: boolean("ndaSigned").default(false).notNull(),
  ndaSignedAt: datetime("ndaSignedAt"),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
  closedAt: datetime("closedAt"),
});

export const negotiationMessages = mysqlTable("negotiationMessages", {
  id: int("id").autoincrement().primaryKey(),
  negotiationId: int("negotiationId").notNull().references(() => negotiations.id, { onDelete: "cascade" }),
  senderId: int("senderId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Message Content
  messageText: text("messageText").notNull(),
  messageType: mysqlEnum("messageType", ["text", "file", "offer", "counter_offer"]).default("text").notNull(),

  // Attachments
  attachmentUrl: varchar("attachmentUrl", { length: 500 }),
  attachmentType: varchar("attachmentType", { length: 50 }),

  // Status
  isRead: boolean("isRead").default(false).notNull(),
  readAt: datetime("readAt"),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// REFERRALS & COMMISSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerUserId: int("referrerUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),

  // Referral Code
  referralCode: varchar("referralCode", { length: 100 }).notNull().unique(),

  // Tracking
  clicksCount: int("clicksCount").default(0).notNull(),
  conversionsCount: int("conversionsCount").default(0).notNull(),
  totalCommission: decimal("totalCommission", { precision: 15, scale: 2 }).default("0.00").notNull(),

  // Status
  isActive: boolean("isActive").default(true).notNull(),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

export const referralClicks = mysqlTable("referralClicks", {
  id: int("id").autoincrement().primaryKey(),
  referralId: int("referralId").notNull().references(() => referrals.id, { onDelete: "cascade" }),
  ipAddress: varchar("ipAddress", { length: 50 }),
  userAgent: text("userAgent"),
  clickedAt: datetime("clickedAt").notNull(),
});

export const commissions = mysqlTable("commissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  negotiationId: int("negotiationId").references(() => negotiations.id, { onDelete: "set null" }),
  referralId: int("referralId").references(() => referrals.id, { onDelete: "set null" }),

  // Commission Details
  commissionType: mysqlEnum("commissionType", ["bithrah_basic", "bithrah_plus", "marketer"]).notNull(),
  commissionAmount: decimal("commissionAmount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),

  // Deal Reference
  dealAmount: decimal("dealAmount", { precision: 15, scale: 2 }),
  commissionPercentage: decimal("commissionPercentage", { precision: 5, scale: 2 }),

  // Status
  status: mysqlEnum("status", ["pending", "approved", "paid"]).default("pending").notNull(),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
  approvedAt: datetime("approvedAt"),
  paidAt: datetime("paidAt"),
});

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENTS & WALLET
// ═══════════════════════════════════════════════════════════════════════════════

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Payment Details
  paymentType: mysqlEnum("paymentType", ["deposit", "commission", "refund", "subscription"]).notNull(),
  paymentAmount: decimal("paymentAmount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),

  // Payment Gateway
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentGateway: varchar("paymentGateway", { length: 50 }),
  gatewayTransactionId: varchar("gatewayTransactionId", { length: 255 }),
  gatewayResponse: text("gatewayResponse"),

  // Related Entities
  projectId: int("projectId").references(() => projects.id, { onDelete: "set null" }),
  negotiationId: int("negotiationId").references(() => negotiations.id, { onDelete: "set null" }),
  backingId: int("backingId").references(() => projectBackings.id, { onDelete: "set null" }),

  // Status
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed", "refunded"]).default("pending").notNull(),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
  completedAt: datetime("completedAt"),
  failedAt: datetime("failedAt"),
  refundedAt: datetime("refundedAt"),
});

export const userWallets = mysqlTable("userWallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),

  // Balance
  availableBalance: decimal("availableBalance", { precision: 15, scale: 2 }).default("0.00").notNull(),
  pendingBalance: decimal("pendingBalance", { precision: 15, scale: 2 }).default("0.00").notNull(),
  totalEarned: decimal("totalEarned", { precision: 15, scale: 2 }).default("0.00").notNull(),
  totalWithdrawn: decimal("totalWithdrawn", { precision: 15, scale: 2 }).default("0.00").notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

export const walletTransactions = mysqlTable("walletTransactions", {
  id: int("id").autoincrement().primaryKey(),
  walletId: int("walletId").notNull().references(() => userWallets.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Transaction Details
  transactionType: mysqlEnum("transactionType", ["credit", "debit", "commission", "withdrawal"]).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  description: text("description"),

  // Related Entities
  commissionId: int("commissionId").references(() => commissions.id, { onDelete: "set null" }),
  paymentId: int("paymentId").references(() => payments.id, { onDelete: "set null" }),

  // Balance After Transaction
  balanceAfter: decimal("balanceAfter", { precision: 15, scale: 2 }),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMMUNITY
// ═══════════════════════════════════════════════════════════════════════════════

export const communityPosts = mysqlTable(
  "communityPosts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

    // Post Content
    postText: text("postText"),
    postType: mysqlEnum("postType", ["text", "image", "video", "link", "poll"]).default("text").notNull(),

    // Media
    mediaUrl: varchar("mediaUrl", { length: 500 }),
    mediaType: varchar("mediaType", { length: 50 }),
    linkUrl: varchar("linkUrl", { length: 500 }),
    linkTitle: varchar("linkTitle", { length: 255 }),
    linkDescription: text("linkDescription"),
    linkImageUrl: varchar("linkImageUrl", { length: 500 }),

    // Engagement
    likesCount: int("likesCount").default(0).notNull(),
    commentsCount: int("commentsCount").default(0).notNull(),
    sharesCount: int("sharesCount").default(0).notNull(),
    viewsCount: int("viewsCount").default(0).notNull(),

    // Hashtags & Mentions
    hashtags: json("hashtags").$type<string[]>(),
    mentions: json("mentions").$type<number[]>(),

    // Moderation
    isReported: boolean("isReported").default(false).notNull(),
    isHidden: boolean("isHidden").default(false).notNull(),
    isDeleted: boolean("isDeleted").default(false).notNull(),

    // Demo Flag
    isDemo: boolean("isDemo").default(false).notNull(),

    // Timestamps
    createdAt: datetime("createdAt").notNull(),
    updatedAt: datetime("updatedAt").notNull(),
    deletedAt: datetime("deletedAt"),
  },
  (table) => ({
    userIdIdx: index("community_posts_user_id_idx").on(table.userId),
    isDemoIdx: index("community_posts_is_demo_idx").on(table.isDemo),
  })
);

export const communityComments = mysqlTable("communityComments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull().references(() => communityPosts.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  parentCommentId: int("parentCommentId"),

  // Comment Content
  commentText: text("commentText").notNull(),

  // Engagement
  likesCount: int("likesCount").default(0).notNull(),

  // Moderation
  isReported: boolean("isReported").default(false).notNull(),
  isHidden: boolean("isHidden").default(false).notNull(),
  isDeleted: boolean("isDeleted").default(false).notNull(),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
  deletedAt: datetime("deletedAt"),
});

export const communityReactions = mysqlTable("communityReactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Target (Post or Comment)
  postId: int("postId").references(() => communityPosts.id, { onDelete: "cascade" }),
  commentId: int("commentId").references(() => communityComments.id, { onDelete: "cascade" }),

  // Reaction Type
  reactionType: mysqlEnum("reactionType", ["like", "love", "celebrate", "support", "insightful"]).default("like").notNull(),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
});

export const follows = mysqlTable("follows", {
  id: int("id").autoincrement().primaryKey(),
  followerId: int("followerId").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: int("followingId").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: datetime("createdAt").notNull(),
});

export const contentReports = mysqlTable("contentReports", {
  id: int("id").autoincrement().primaryKey(),
  reporterId: int("reporterId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Reported Content
  postId: int("postId").references(() => communityPosts.id, { onDelete: "cascade" }),
  commentId: int("commentId").references(() => communityComments.id, { onDelete: "cascade" }),

  // Report Details
  reportReason: mysqlEnum("reportReason", ["spam", "harassment", "inappropriate", "misleading", "other"]).notNull(),
  reportDescription: text("reportDescription"),

  // Status
  status: mysqlEnum("status", ["pending", "reviewed", "action_taken", "dismissed"]).default("pending").notNull(),
  reviewedByAdminId: int("reviewedByAdminId").references(() => users.id, { onDelete: "set null" }),
  adminNotes: text("adminNotes"),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
  reviewedAt: datetime("reviewedAt"),
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEADERBOARD & ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const leaderboardSnapshots = mysqlTable("leaderboardSnapshots", {
  id: int("id").autoincrement().primaryKey(),
  snapshotDate: datetime("snapshotDate").notNull(),
  snapshotType: mysqlEnum("snapshotType", ["daily", "weekly", "monthly", "all_time"]).notNull(),

  // Top Projects
  topProjectsByFunding: json("topProjectsByFunding"),
  topProjectsByBackers: json("topProjectsByBackers"),

  // Top Users
  topBackers: json("topBackers"),
  topProjectOwners: json("topProjectOwners"),
  topCommunityMembers: json("topCommunityMembers"),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
});

export const userAchievements = mysqlTable("userAchievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Achievement Details
  achievementType: varchar("achievementType", { length: 100 }).notNull(),
  achievementName: varchar("achievementName", { length: 255 }).notNull(),
  achievementDescription: text("achievementDescription"),
  achievementIconUrl: varchar("achievementIconUrl", { length: 500 }),

  // Progress
  currentProgress: int("currentProgress").default(0).notNull(),
  targetProgress: int("targetProgress"),
  isCompleted: boolean("isCompleted").default(false).notNull(),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
  completedAt: datetime("completedAt"),
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN & ROLES
// ═══════════════════════════════════════════════════════════════════════════════

export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  roleName: varchar("roleName", { length: 100 }).notNull().unique(),
  roleDescription: text("roleDescription"),
  permissions: json("permissions"),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

export const userRoles = mysqlTable("userRoles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: int("roleId").notNull().references(() => roles.id, { onDelete: "cascade" }),
  assignedAt: datetime("assignedAt").notNull(),
  assignedByUserId: int("assignedByUserId").references(() => users.id, { onDelete: "set null" }),
});

export const adminActivityLogs = mysqlTable("adminActivityLogs", {
  id: int("id").autoincrement().primaryKey(),
  adminUserId: int("adminUserId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Activity Details
  actionType: varchar("actionType", { length: 100 }).notNull(),
  actionDescription: text("actionDescription"),

  // Target Entity
  targetType: varchar("targetType", { length: 50 }),
  targetId: int("targetId"),

  // Changes
  changesMade: json("changesMade"),

  // Timestamps
  createdAt: datetime("createdAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC CONTENT & SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

export const staticPages = mysqlTable("staticPages", {
  id: int("id").autoincrement().primaryKey(),
  pageSlug: varchar("pageSlug", { length: 100 }).notNull().unique(),
  pageTitle: varchar("pageTitle", { length: 255 }).notNull(),
  pageContent: text("pageContent").notNull(),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

export const siteSettings = mysqlTable("siteSettings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue"),
  settingType: mysqlEnum("settingType", ["text", "boolean", "number", "json"]).default("text").notNull(),
  settingDescription: text("settingDescription"),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

    // Notification Details
    notificationType: varchar("notificationType", { length: 100 }).notNull(),
    notificationTitle: varchar("notificationTitle", { length: 255 }).notNull(),
    notificationText: text("notificationText"),
    notificationIconUrl: varchar("notificationIconUrl", { length: 500 }),

    // Related Entity
    relatedEntityType: varchar("relatedEntityType", { length: 50 }),
    relatedEntityId: int("relatedEntityId"),

    // Action URL
    actionUrl: varchar("actionUrl", { length: 500 }),

    // Status
    isRead: boolean("isRead").default(false).notNull(),
    readAt: datetime("readAt"),

    // Timestamps
    createdAt: datetime("createdAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("notifications_user_id_idx").on(table.userId),
    isReadIdx: index("notifications_is_read_idx").on(table.isRead),
  })
);

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Idea = typeof ideas.$inferSelect;
export type InsertIdea = typeof ideas.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = typeof communityPosts.$inferInsert;

export type Negotiation = typeof negotiations.$inferSelect;
export type InsertNegotiation = typeof negotiations.$inferInsert;
