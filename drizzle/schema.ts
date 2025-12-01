import {
  boolean,
  timestamp,
  integer,
  serial,
  json,
  pgEnum,
  pgTable,
  text,
  numeric,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
// Enum definitions
export const backingTypeEnum = pgEnum("backingType", ["support", "negotiation_deposit"]);
export const commissionStatusEnum = pgEnum("commissionStatus", ["pending", "approved", "paid"]);
export const commissionTypeEnum = pgEnum("commissionType", ["bithrah_basic", "bithrah_plus", "marketer"]);
export const depositStatusEnum = pgEnum("depositStatus", ["pending", "paid", "refunded"]);
export const evaluationStatusEnum = pgEnum("evaluationStatus", ["pending", "processing", "completed", "failed"]);
export const linkTypeEnum = pgEnum("linkType", ["website", "twitter", "linkedin", "instagram", "facebook", "other"]);
export const mediaTypeEnum = pgEnum("mediaType", ["image", "video", "pdf", "document"]);
export const messageTypeEnum = pgEnum("messageType", ["text", "file", "offer", "counter_offer"]);
export const negotiationCommissionTypeEnum = pgEnum("negotiationCommissionType", ["basic", "plus"]);
export const negotiationStatusEnum = pgEnum("negotiationStatus", ["open", "in_progress", "closed_success", "closed_failed", "cancelled"]);
export const packageTypeEnum = pgEnum("packageType", ["support", "negotiation_deposit"]);
export const paymentStatusEnum = pgEnum("paymentStatus", ["pending", "processing", "completed", "failed", "refunded"]);
export const paymentTypeEnum = pgEnum("paymentType", ["deposit", "commission", "refund", "subscription"]);
export const postTypeEnum = pgEnum("postType", ["text", "image", "video", "link", "poll"]);
export const projectStatusEnum = pgEnum("projectStatus", ["draft", "under_review", "published", "funded", "suspended", "completed"]);
export const reactionTypeEnum = pgEnum("reactionType", ["like", "love", "celebrate", "support", "insightful"]);
export const reportReasonEnum = pgEnum("reportReason", ["spam", "harassment", "inappropriate", "misleading", "other"]);
export const reportStatusEnum = pgEnum("reportStatus", ["pending", "reviewed", "action_taken", "dismissed"]);
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const settingTypeEnum = pgEnum("settingType", ["text", "boolean", "number", "json"]);

// System Settings Table
export const systemSettings = pgTable("systemSettings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  type: settingTypeEnum("type").default("text").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});
export const snapshotTypeEnum = pgEnum("snapshotType", ["daily", "weekly", "monthly", "all_time"]);
export const subscriptionTierEnum = pgEnum("subscriptionTier", ["free", "silver", "gold", "platinum"]);
export const transactionTypeEnum = pgEnum("transactionType", ["credit", "debit", "commission", "withdrawal"]);
export const visibilityEnum = pgEnum("visibility", ["public", "private", "unlisted"]);


// ═══════════════════════════════════════════════════════════════════════════════
// USERS & AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════════

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    openId: text("openId").notNull().unique(),
    email: text("email"),
    username: text("username"),
    name: text("name"),
    passwordHash: text("passwordHash"),
    loginMethod: text("loginMethod"),

    // Profile Information
    bio: text("bio"),
    avatarUrl: text("avatarUrl"),
    coverImageUrl: text("coverImageUrl"),
    city: text("city"),
    country: text("country").default("Saudi Arabia"),
    phone: text("phone"),

    // User Type & Status
    role: roleEnum("role").default("user").notNull(),
    isVerified: boolean("isVerified").default(false).notNull(),
    isEarlyAccess: boolean("isEarlyAccess").default(false).notNull(),
    batch: text("batch"), // early_access, beta, public
    isActive: boolean("isActive").default(true).notNull(),

    // Subscription
    subscriptionTier: subscriptionTierEnum("subscriptionTier").default("free").notNull(),
    subscriptionExpiresAt: timestamp("subscriptionExpiresAt"),

    // Social Links
    websiteUrl: text("websiteUrl"),
    twitterUrl: text("twitterUrl"),
    linkedinUrl: text("linkedinUrl"),
    instagramUrl: text("instagramUrl"),

    // Settings
    emailNotifications: boolean("emailNotifications").default(true).notNull(),
    marketingEmails: boolean("marketingEmails").default(false).notNull(),
    language: text("language").default("ar").notNull(),
    timezone: text("timezone").default("Asia/Riyadh").notNull(),

    // Timestamps
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    lastSignedIn: timestamp("lastSignedIn").notNull(),
    deletedAt: timestamp("deletedAt"),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    usernameIdx: uniqueIndex("username_idx").on(table.username),
  })
);

export const emailVerificationTokens = pgTable("emailVerificationTokens", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  usedAt: timestamp("usedAt"),
});

export const passwordResetTokens = pgTable("passwordResetTokens", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  usedAt: timestamp("usedAt"),
});

// ═══════════════════════════════════════════════════════════════════════════════
// IDEAS & EVALUATION
// ═══════════════════════════════════════════════════════════════════════════════

export const ideas = pgTable(
  "ideas",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

    // Idea Information
    ideaName: text("ideaName").notNull(),
    ideaDescription: text("ideaDescription").notNull(),
    sector: text("sector"),
    category: text("category"),
    stage: text("stage"),
    technicalNeeds: text("technicalNeeds"),
    financialNeeds: text("financialNeeds"),
    targetMarket: text("targetMarket"),
    competitiveAdvantage: text("competitiveAdvantage"),

    // AI Evaluation Results
    evaluationStatus: evaluationStatusEnum("evaluationStatus").default("pending").notNull(),
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
    overallScore: numeric("overallScore", { precision: 3, scale: 2 }),

    // Conversion to Project
    convertedToProject: boolean("convertedToProject").default(false).notNull(),
    projectId: integer("projectId"),

    // Demo Flag
    isDemo: boolean("isDemo").default(false).notNull(),

    // Timestamps
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    evaluatedAt: timestamp("evaluatedAt"),
    deletedAt: timestamp("deletedAt"),
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

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    ideaId: integer("ideaId").references(() => ideas.id, { onDelete: "set null" }),

    // Basic Information
    projectName: text("projectName").notNull(),
    slug: text("slug").notNull().unique(),
    tagline: text("tagline"),
    description: text("description").notNull(),
    sector: text("sector"),
    category: text("category"),

    // Location
    city: text("city"),
    country: text("country").default("Saudi Arabia"),

    // Financial Goals
    fundingGoal: numeric("fundingGoal", { precision: 15, scale: 2 }).notNull(),
    currentFunding: numeric("currentFunding", { precision: 15, scale: 2 }).default("0.00").notNull(),
    currency: text("currency").default("SAR").notNull(),
    deadline: timestamp("deadline"),

    // Media
    coverImageUrl: text("coverImageUrl"),
    videoUrl: text("videoUrl"),

    // Required Sections
    risksDescription: text("risksDescription"),
    fundUsageDescription: text("fundUsageDescription"),

    // Status & Workflow
    status: projectStatusEnum("projectStatus").default("draft").notNull(),
    visibility: visibilityEnum("visibility").default("public").notNull(),

    // Demo Flag
    isDemo: boolean("isDemo").default(false).notNull(),

    // Timestamps
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    publishedAt: timestamp("publishedAt"),
    fundedAt: timestamp("fundedAt"),
    deletedAt: timestamp("deletedAt"),
  },
  (table) => ({
    userIdIdx: index("projects_user_id_idx").on(table.userId),
    slugIdx: uniqueIndex("projects_slug_idx").on(table.slug),
    statusIdx: index("projects_status_idx").on(table.status),
    isDemoIdx: index("projects_is_demo_idx").on(table.isDemo),
  })
);

export const projectTeamMembers = pgTable("projectTeamMembers", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  memberName: text("memberName").notNull(),
  memberRole: text("memberRole").notNull(),
  memberBio: text("memberBio"),
  memberImageUrl: text("memberImageUrl"),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export const projectMedia = pgTable("projectMedia", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  mediaType: mediaTypeEnum("mediaType").notNull(),
  mediaUrl: text("mediaUrl").notNull(),
  mediaTitle: text("mediaTitle"),
  mediaDescription: text("mediaDescription"),
  fileSize: integer("fileSize"),
  mimeType: text("mimeType"),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export const projectLinks = pgTable("projectLinks", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  linkType: linkTypeEnum("linkType").notNull(),
  linkUrl: text("linkUrl").notNull(),
  linkTitle: text("linkTitle"),
  createdAt: timestamp("createdAt").notNull(),
});

export const projectUpdates = pgTable("projectUpdates", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  updateTitle: text("updateTitle").notNull(),
  updateContent: text("updateContent").notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const projectComments = pgTable("projectComments", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  parentCommentId: integer("parentCommentId"),
  commentText: text("commentText").notNull(),
  isDeleted: boolean("isDeleted").default(false).notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT PACKAGES (REWARDS/TIERS)
// ═══════════════════════════════════════════════════════════════════════════════

export const projectPackages = pgTable("projectPackages", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),

  // Package Information
  packageName: text("packageName").notNull(),
  packageType: packageTypeEnum("packageType").default("support").notNull(),
  packageAmount: numeric("packageAmount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").default("SAR").notNull(),
  packageDescription: text("packageDescription"),

  // Limits
  isLimited: boolean("isLimited").default(false).notNull(),
  totalQuantity: integer("totalQuantity"),
  claimedQuantity: integer("claimedQuantity").default(0).notNull(),

  // Features/Benefits
  features: json("features").$type<string[]>(),

  // Display
  displayOrder: integer("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUPPORT & BACKING
// ═══════════════════════════════════════════════════════════════════════════════

export const projectBackings = pgTable("projectBackings", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  packageId: integer("packageId").references(() => projectPackages.id, { onDelete: "set null" }),

  // Backing Details
  backingAmount: numeric("backingAmount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").default("SAR").notNull(),
  backingType: backingTypeEnum("backingType").default("support").notNull(),

  // Payment Status
  paymentStatus: paymentStatusEnum("paymentStatus").default("pending").notNull(),
  paymentMethod: text("paymentMethod"),
  paymentReference: text("paymentReference"),

  // Referral
  referralCode: text("referralCode"),
  referredByUserId: integer("referredByUserId").references(() => users.id, { onDelete: "set null" }),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
  completedAt: timestamp("completedAt"),
  refundedAt: timestamp("refundedAt"),
});

// ═══════════════════════════════════════════════════════════════════════════════
// NEGOTIATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const negotiations = pgTable("negotiations", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  investorId: integer("investorId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectOwnerId: integer("projectOwnerId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Negotiation Details
  depositAmount: numeric("depositAmount", { precision: 15, scale: 2 }),
  depositStatus: depositStatusEnum("depositStatus").default("pending").notNull(),

  // Status
  status: negotiationStatusEnum("negotiationStatus").default("open").notNull(),

  // Deal Details (if closed successfully)
  dealAmount: numeric("dealAmount", { precision: 15, scale: 2 }),
  dealTerms: text("dealTerms"),
  commissionType: negotiationCommissionTypeEnum("negotiationCommissionType"),
  bithrahCommission: numeric("bithrahCommission", { precision: 15, scale: 2 }),
  marketerCommission: numeric("marketerCommission", { precision: 15, scale: 2 }),

  // NDA
  ndaSigned: boolean("ndaSigned").default(false).notNull(),
  ndaSignedAt: timestamp("ndaSignedAt"),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  closedAt: timestamp("closedAt"),
});

export const negotiationMessages = pgTable("negotiationMessages", {
  id: serial("id").primaryKey(),
  negotiationId: integer("negotiationId").notNull().references(() => negotiations.id, { onDelete: "cascade" }),
  senderId: integer("senderId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Message Content
  messageText: text("messageText").notNull(),
  messageType: messageTypeEnum("messageType").default("text").notNull(),

  // Attachments
  attachmentUrl: text("attachmentUrl"),
  attachmentType: text("attachmentType"),

  // Status
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// REFERRALS & COMMISSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const projectReferrals = pgTable("projectReferrals", {
  id: serial("id").primaryKey(),
  referrerUserId: integer("referrerUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),

  // Referral Code
  referralCode: text("referralCode").notNull().unique(),

  // Tracking
  clicksCount: integer("clicksCount").default(0).notNull(),
  conversionsCount: integer("conversionsCount").default(0).notNull(),
  totalCommission: numeric("totalCommission", { precision: 15, scale: 2 }).default("0.00").notNull(),

  // Status
  isActive: boolean("isActive").default(true).notNull(),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const referralClicks = pgTable("referralClicks", {
  id: serial("id").primaryKey(),
  referralId: integer("referralId").notNull().references(() => projectReferrals.id, { onDelete: "cascade" }),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  clickedAt: timestamp("clickedAt").notNull(),
});

export const commissions = pgTable("commissions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  negotiationId: integer("negotiationId").references(() => negotiations.id, { onDelete: "set null" }),
  referralId: integer("referralId").references(() => projectReferrals.id, { onDelete: "set null" }),

  // Commission Details
  commissionType: commissionTypeEnum("commissionType").notNull(),
  commissionAmount: numeric("commissionAmount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").default("SAR").notNull(),

  // Deal Reference
  dealAmount: numeric("dealAmount", { precision: 15, scale: 2 }),
  commissionPercentage: numeric("commissionPercentage", { precision: 5, scale: 2 }),

  // Status
  status: commissionStatusEnum("commissionStatus").default("pending").notNull(),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
  approvedAt: timestamp("approvedAt"),
  paidAt: timestamp("paidAt"),
});

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENTS & WALLET
// ═══════════════════════════════════════════════════════════════════════════════

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Payment Details
  paymentType: paymentTypeEnum("paymentType").notNull(),
  paymentAmount: numeric("paymentAmount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").default("SAR").notNull(),

  // Payment Gateway
  paymentMethod: text("paymentMethod"),
  paymentGateway: text("paymentGateway"),
  gatewayTransactionId: text("gatewayTransactionId"),
  gatewayResponse: text("gatewayResponse"),

  // Related Entities
  projectId: integer("projectId").references(() => projects.id, { onDelete: "set null" }),
  negotiationId: integer("negotiationId").references(() => negotiations.id, { onDelete: "set null" }),
  backingId: integer("backingId").references(() => projectBackings.id, { onDelete: "set null" }),

  // Status
  status: paymentStatusEnum("paymentStatus").default("pending").notNull(),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
  completedAt: timestamp("completedAt"),
  failedAt: timestamp("failedAt"),
  refundedAt: timestamp("refundedAt"),
});

export const userWallets = pgTable("userWallets", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),

  // Balance
  availableBalance: numeric("availableBalance", { precision: 15, scale: 2 }).default("0.00").notNull(),
  pendingBalance: numeric("pendingBalance", { precision: 15, scale: 2 }).default("0.00").notNull(),
  totalEarned: numeric("totalEarned", { precision: 15, scale: 2 }).default("0.00").notNull(),
  totalWithdrawn: numeric("totalWithdrawn", { precision: 15, scale: 2 }).default("0.00").notNull(),
  currency: text("currency").default("SAR").notNull(),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const walletTransactions = pgTable("walletTransactions", {
  id: serial("id").primaryKey(),
  walletId: integer("walletId").notNull().references(() => userWallets.id, { onDelete: "cascade" }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Transaction Details
  transactionType: transactionTypeEnum("transactionType").notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").default("SAR").notNull(),
  description: text("description"),

  // Related Entities
  commissionId: integer("commissionId").references(() => commissions.id, { onDelete: "set null" }),
  paymentId: integer("paymentId").references(() => payments.id, { onDelete: "set null" }),

  // Balance After Transaction
  balanceAfter: numeric("balanceAfter", { precision: 15, scale: 2 }),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMMUNITY
// ═══════════════════════════════════════════════════════════════════════════════

export const communityPosts = pgTable(
  "communityPosts",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

    // Post Content
    postText: text("postText"),
    postType: postTypeEnum("postType").default("text").notNull(),

    // Media
    mediaUrl: text("mediaUrl"),
    mediaType: text("mediaType"),
    linkUrl: text("linkUrl"),
    linkTitle: text("linkTitle"),
    linkDescription: text("linkDescription"),
    linkImageUrl: text("linkImageUrl"),

    // Engagement
    likesCount: integer("likesCount").default(0).notNull(),
    commentsCount: integer("commentsCount").default(0).notNull(),
    sharesCount: integer("sharesCount").default(0).notNull(),
    viewsCount: integer("viewsCount").default(0).notNull(),

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
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    deletedAt: timestamp("deletedAt"),
  },
  (table) => ({
    userIdIdx: index("community_posts_user_id_idx").on(table.userId),
    isDemoIdx: index("community_posts_is_demo_idx").on(table.isDemo),
  })
);

export const communityComments = pgTable("communityComments", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull().references(() => communityPosts.id, { onDelete: "cascade" }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  parentCommentId: integer("parentCommentId"),

  // Comment Content
  commentText: text("commentText").notNull(),

  // Engagement
  likesCount: integer("likesCount").default(0).notNull(),

  // Moderation
  isReported: boolean("isReported").default(false).notNull(),
  isHidden: boolean("isHidden").default(false).notNull(),
  isDeleted: boolean("isDeleted").default(false).notNull(),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  deletedAt: timestamp("deletedAt"),
});

export const communityReactions = pgTable("communityReactions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Target (Post or Comment)
  postId: integer("postId").references(() => communityPosts.id, { onDelete: "cascade" }),
  commentId: integer("commentId").references(() => communityComments.id, { onDelete: "cascade" }),

  // Reaction Type
  reactionType: reactionTypeEnum("reactionType").default("like").notNull(),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("followerId").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: integer("followingId").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull(),
});

export const contentReports = pgTable("contentReports", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporterId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Reported Content
  postId: integer("postId").references(() => communityPosts.id, { onDelete: "cascade" }),
  commentId: integer("commentId").references(() => communityComments.id, { onDelete: "cascade" }),

  // Report Details
  reportReason: reportReasonEnum("reportReason").notNull(),
  reportDescription: text("reportDescription"),

  // Status
  status: reportStatusEnum("reportStatus").default("pending").notNull(),
  reviewedByAdminId: integer("reviewedByAdminId").references(() => users.id, { onDelete: "set null" }),
  adminNotes: text("adminNotes"),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEADERBOARD & ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const leaderboardSnapshots = pgTable("leaderboardSnapshots", {
  id: serial("id").primaryKey(),
  snapshotDate: timestamp("snapshotDate").notNull(),
  snapshotType: snapshotTypeEnum("snapshotType").notNull(),

  // Top Projects
  topProjectsByFunding: json("topProjectsByFunding"),
  topProjectsByBackers: json("topProjectsByBackers"),

  // Top Users
  topBackers: json("topBackers"),
  topProjectOwners: json("topProjectOwners"),
  topCommunityMembers: json("topCommunityMembers"),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
});

export const userAchievements = pgTable("userAchievements", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Achievement Details
  achievementType: text("achievementType").notNull(),
  achievementName: text("achievementName").notNull(),
  achievementDescription: text("achievementDescription"),
  achievementIconUrl: text("achievementIconUrl"),

  // Progress
  currentProgress: integer("currentProgress").default(0).notNull(),
  targetProgress: integer("targetProgress"),
  isCompleted: boolean("isCompleted").default(false).notNull(),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
  completedAt: timestamp("completedAt"),
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN & ROLES
// ═══════════════════════════════════════════════════════════════════════════════

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  roleName: text("roleName").notNull().unique(),
  roleDescription: text("roleDescription"),
  permissions: json("permissions"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const userRoles = pgTable("userRoles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: integer("roleId").notNull().references(() => roles.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assignedAt").notNull(),
  assignedByUserId: integer("assignedByUserId").references(() => users.id, { onDelete: "set null" }),
});

export const adminActivityLogs = pgTable("adminActivityLogs", {
  id: serial("id").primaryKey(),
  adminUserId: integer("adminUserId").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Activity Details
  actionType: text("actionType").notNull(),
  actionDescription: text("actionDescription"),

  // Target Entity
  targetType: text("targetType"),
  targetId: integer("targetId"),

  // Changes
  changesMade: json("changesMade"),

  // Timestamps
  createdAt: timestamp("createdAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC CONTENT & SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

export const staticPages = pgTable("staticPages", {
  id: serial("id").primaryKey(),
  pageSlug: text("pageSlug").notNull().unique(),
  pageTitle: text("pageTitle").notNull(),
  pageContent: text("pageContent").notNull(),
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const siteSettings = pgTable("siteSettings", {
  id: serial("id").primaryKey(),
  settingKey: text("settingKey").notNull().unique(),
  settingValue: text("settingValue"),
  settingType: settingTypeEnum("settingType").default("text").notNull(),
  settingDescription: text("settingDescription"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),

    // Notification Details
    notificationType: text("notificationType").notNull(),
    notificationTitle: text("notificationTitle").notNull(),
    notificationText: text("notificationText"),
    notificationIconUrl: text("notificationIconUrl"),

    // Related Entity
    relatedEntityType: text("relatedEntityType"),
    relatedEntityId: integer("relatedEntityId"),

    // Action URL
    actionUrl: text("actionUrl"),

    // Status
    isRead: boolean("isRead").default(false).notNull(),
    readAt: timestamp("readAt"),

    // Timestamps
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("notifications_user_id_idx").on(table.userId),
    isReadIdx: index("notifications_is_read_idx").on(table.isRead),
  })
);

// ═══════════════════════════════════════════════════════════════════════════════
// EARLY ACCESS & REFERRALS
// ═══════════════════════════════════════════════════════════════════════════════

export const earlyAccessUsers = pgTable(
  "early_access_users",
  {
    id: serial("id").primaryKey(),
    fullName: text("fullName").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    username: text("username").notNull().unique(),
    source: text("source").notNull(), // من أين عرف عن بذره
    referralCode: text("referralCode").notNull().unique(), // كود الإحالة الخاص به
    referredBy: text("referredBy"), // كود الإحالة الذي استخدمه للتسجيل
    referralCount: integer("referralCount").default(0).notNull(), // عدد الإحالات الناجحة
    bonusYears: integer("bonusYears").default(1).notNull(), // سنوات الاشتراك المجاني (1 + عدد الإحالات)
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("early_access_email_idx").on(table.email),
    usernameIdx: uniqueIndex("early_access_username_idx").on(table.username),
    referralCodeIdx: uniqueIndex("early_access_referral_code_idx").on(table.referralCode),
    referredByIdx: index("early_access_referred_by_idx").on(table.referredBy),
  })
);

export const earlyAccessReferrals = pgTable(
  "early_access_referrals",
  {
    id: serial("id").primaryKey(),
    referrerId: integer("referrerId").notNull().references(() => earlyAccessUsers.id, { onDelete: "cascade" }),
    referredId: integer("referredId").notNull().references(() => earlyAccessUsers.id, { onDelete: "cascade" }),
    referralCode: text("referralCode").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    referrerIdIdx: index("early_access_referrals_referrer_id_idx").on(table.referrerId),
    referredIdIdx: index("early_access_referrals_referred_id_idx").on(table.referredId),
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

export type EarlyAccessUser = typeof earlyAccessUsers.$inferSelect;
export type InsertEarlyAccessUser = typeof earlyAccessUsers.$inferInsert;

export type EarlyAccessReferral = typeof earlyAccessReferrals.$inferSelect;
export type InsertEarlyAccessReferral = typeof earlyAccessReferrals.$inferInsert;
