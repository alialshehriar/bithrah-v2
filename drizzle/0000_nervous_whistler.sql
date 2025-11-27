CREATE TYPE "public"."backingType" AS ENUM('support', 'negotiation_deposit');--> statement-breakpoint
CREATE TYPE "public"."commissionStatus" AS ENUM('pending', 'approved', 'paid');--> statement-breakpoint
CREATE TYPE "public"."commissionType" AS ENUM('bithrah_basic', 'bithrah_plus', 'marketer');--> statement-breakpoint
CREATE TYPE "public"."depositStatus" AS ENUM('pending', 'paid', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."evaluationStatus" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."linkType" AS ENUM('website', 'twitter', 'linkedin', 'instagram', 'facebook', 'other');--> statement-breakpoint
CREATE TYPE "public"."mediaType" AS ENUM('image', 'video', 'pdf', 'document');--> statement-breakpoint
CREATE TYPE "public"."messageType" AS ENUM('text', 'file', 'offer', 'counter_offer');--> statement-breakpoint
CREATE TYPE "public"."negotiationCommissionType" AS ENUM('basic', 'plus');--> statement-breakpoint
CREATE TYPE "public"."negotiationStatus" AS ENUM('open', 'in_progress', 'closed_success', 'closed_failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."packageType" AS ENUM('support', 'negotiation_deposit');--> statement-breakpoint
CREATE TYPE "public"."paymentStatus" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."paymentType" AS ENUM('deposit', 'commission', 'refund', 'subscription');--> statement-breakpoint
CREATE TYPE "public"."postType" AS ENUM('text', 'image', 'video', 'link', 'poll');--> statement-breakpoint
CREATE TYPE "public"."projectStatus" AS ENUM('draft', 'under_review', 'published', 'funded', 'suspended', 'completed');--> statement-breakpoint
CREATE TYPE "public"."reactionType" AS ENUM('like', 'love', 'celebrate', 'support', 'insightful');--> statement-breakpoint
CREATE TYPE "public"."reportReason" AS ENUM('spam', 'harassment', 'inappropriate', 'misleading', 'other');--> statement-breakpoint
CREATE TYPE "public"."reportStatus" AS ENUM('pending', 'reviewed', 'action_taken', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."settingType" AS ENUM('text', 'boolean', 'number', 'json');--> statement-breakpoint
CREATE TYPE "public"."snapshotType" AS ENUM('daily', 'weekly', 'monthly', 'all_time');--> statement-breakpoint
CREATE TYPE "public"."subscriptionTier" AS ENUM('free', 'silver', 'gold', 'platinum');--> statement-breakpoint
CREATE TYPE "public"."transactionType" AS ENUM('credit', 'debit', 'commission', 'withdrawal');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'private', 'unlisted');--> statement-breakpoint
CREATE TABLE "adminActivityLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"adminUserId" integer NOT NULL,
	"actionType" text NOT NULL,
	"actionDescription" text,
	"targetType" text,
	"targetId" integer,
	"changesMade" json,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"negotiationId" integer,
	"referralId" integer,
	"commissionType" "commissionType" NOT NULL,
	"commissionAmount" numeric(15, 2) NOT NULL,
	"currency" text DEFAULT 'SAR' NOT NULL,
	"dealAmount" numeric(15, 2),
	"commissionPercentage" numeric(5, 2),
	"commissionStatus" "commissionStatus" DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp NOT NULL,
	"approvedAt" timestamp,
	"paidAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "communityComments" (
	"id" serial PRIMARY KEY NOT NULL,
	"postId" integer NOT NULL,
	"userId" integer NOT NULL,
	"parentCommentId" integer,
	"commentText" text NOT NULL,
	"likesCount" integer DEFAULT 0 NOT NULL,
	"isReported" boolean DEFAULT false NOT NULL,
	"isHidden" boolean DEFAULT false NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "communityPosts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"postText" text,
	"postType" "postType" DEFAULT 'text' NOT NULL,
	"mediaUrl" text,
	"mediaType" text,
	"linkUrl" text,
	"linkTitle" text,
	"linkDescription" text,
	"linkImageUrl" text,
	"likesCount" integer DEFAULT 0 NOT NULL,
	"commentsCount" integer DEFAULT 0 NOT NULL,
	"sharesCount" integer DEFAULT 0 NOT NULL,
	"viewsCount" integer DEFAULT 0 NOT NULL,
	"hashtags" json,
	"mentions" json,
	"isReported" boolean DEFAULT false NOT NULL,
	"isHidden" boolean DEFAULT false NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"isDemo" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "communityReactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"postId" integer,
	"commentId" integer,
	"reactionType" "reactionType" DEFAULT 'like' NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contentReports" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporterId" integer NOT NULL,
	"postId" integer,
	"commentId" integer,
	"reportReason" "reportReason" NOT NULL,
	"reportDescription" text,
	"reportStatus" "reportStatus" DEFAULT 'pending' NOT NULL,
	"reviewedByAdminId" integer,
	"adminNotes" text,
	"createdAt" timestamp NOT NULL,
	"reviewedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "emailVerificationTokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL,
	"usedAt" timestamp,
	CONSTRAINT "emailVerificationTokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"id" serial PRIMARY KEY NOT NULL,
	"followerId" integer NOT NULL,
	"followingId" integer NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ideas" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"ideaName" text NOT NULL,
	"ideaDescription" text NOT NULL,
	"sector" text,
	"category" text,
	"stage" text,
	"technicalNeeds" text,
	"financialNeeds" text,
	"evaluationStatus" "evaluationStatus" DEFAULT 'pending' NOT NULL,
	"evaluationSummary" text,
	"strengths" text,
	"weaknesses" text,
	"risks" text,
	"feasibilityOpinion" text,
	"strategicAnalysis" text,
	"financialAnalysis" text,
	"marketAnalysis" text,
	"executionAnalysis" text,
	"growthStrategy" text,
	"overallScore" numeric(3, 2),
	"convertedToProject" boolean DEFAULT false NOT NULL,
	"projectId" integer,
	"isDemo" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"evaluatedAt" timestamp,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "leaderboardSnapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"snapshotDate" timestamp NOT NULL,
	"snapshotType" "snapshotType" NOT NULL,
	"topProjectsByFunding" json,
	"topProjectsByBackers" json,
	"topBackers" json,
	"topProjectOwners" json,
	"topCommunityMembers" json,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "negotiationMessages" (
	"id" serial PRIMARY KEY NOT NULL,
	"negotiationId" integer NOT NULL,
	"senderId" integer NOT NULL,
	"messageText" text NOT NULL,
	"messageType" "messageType" DEFAULT 'text' NOT NULL,
	"attachmentUrl" text,
	"attachmentType" text,
	"isRead" boolean DEFAULT false NOT NULL,
	"readAt" timestamp,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "negotiations" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"investorId" integer NOT NULL,
	"projectOwnerId" integer NOT NULL,
	"depositAmount" numeric(15, 2),
	"depositStatus" "depositStatus" DEFAULT 'pending' NOT NULL,
	"negotiationStatus" "negotiationStatus" DEFAULT 'open' NOT NULL,
	"dealAmount" numeric(15, 2),
	"dealTerms" text,
	"negotiationCommissionType" "negotiationCommissionType",
	"bithrahCommission" numeric(15, 2),
	"marketerCommission" numeric(15, 2),
	"ndaSigned" boolean DEFAULT false NOT NULL,
	"ndaSignedAt" timestamp,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"closedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"notificationType" text NOT NULL,
	"notificationTitle" text NOT NULL,
	"notificationText" text,
	"notificationIconUrl" text,
	"relatedEntityType" text,
	"relatedEntityId" integer,
	"actionUrl" text,
	"isRead" boolean DEFAULT false NOT NULL,
	"readAt" timestamp,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passwordResetTokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL,
	"usedAt" timestamp,
	CONSTRAINT "passwordResetTokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"paymentType" "paymentType" NOT NULL,
	"paymentAmount" numeric(15, 2) NOT NULL,
	"currency" text DEFAULT 'SAR' NOT NULL,
	"paymentMethod" text,
	"paymentGateway" text,
	"gatewayTransactionId" text,
	"gatewayResponse" text,
	"projectId" integer,
	"negotiationId" integer,
	"backingId" integer,
	"paymentStatus" "paymentStatus" DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp NOT NULL,
	"completedAt" timestamp,
	"failedAt" timestamp,
	"refundedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "projectBackings" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"userId" integer NOT NULL,
	"packageId" integer,
	"backingAmount" numeric(15, 2) NOT NULL,
	"currency" text DEFAULT 'SAR' NOT NULL,
	"backingType" "backingType" DEFAULT 'support' NOT NULL,
	"paymentStatus" "paymentStatus" DEFAULT 'pending' NOT NULL,
	"paymentMethod" text,
	"paymentReference" text,
	"referralCode" text,
	"referredByUserId" integer,
	"createdAt" timestamp NOT NULL,
	"completedAt" timestamp,
	"refundedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "projectComments" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"userId" integer NOT NULL,
	"parentCommentId" integer,
	"commentText" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projectLinks" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"linkType" "linkType" NOT NULL,
	"linkUrl" text NOT NULL,
	"linkTitle" text,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projectMedia" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"mediaType" "mediaType" NOT NULL,
	"mediaUrl" text NOT NULL,
	"mediaTitle" text,
	"mediaDescription" text,
	"fileSize" integer,
	"mimeType" text,
	"displayOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projectPackages" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"packageName" text NOT NULL,
	"packageType" "packageType" DEFAULT 'support' NOT NULL,
	"packageAmount" numeric(15, 2) NOT NULL,
	"currency" text DEFAULT 'SAR' NOT NULL,
	"packageDescription" text,
	"isLimited" boolean DEFAULT false NOT NULL,
	"totalQuantity" integer,
	"claimedQuantity" integer DEFAULT 0 NOT NULL,
	"features" json,
	"displayOrder" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projectTeamMembers" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"memberName" text NOT NULL,
	"memberRole" text NOT NULL,
	"memberBio" text,
	"memberImageUrl" text,
	"displayOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projectUpdates" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"userId" integer NOT NULL,
	"updateTitle" text NOT NULL,
	"updateContent" text NOT NULL,
	"isPublic" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"ideaId" integer,
	"projectName" text NOT NULL,
	"slug" text NOT NULL,
	"tagline" text,
	"description" text NOT NULL,
	"sector" text,
	"category" text,
	"city" text,
	"country" text DEFAULT 'Saudi Arabia',
	"fundingGoal" numeric(15, 2) NOT NULL,
	"currentFunding" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"currency" text DEFAULT 'SAR' NOT NULL,
	"deadline" timestamp,
	"coverImageUrl" text,
	"videoUrl" text,
	"risksDescription" text,
	"fundUsageDescription" text,
	"projectStatus" "projectStatus" DEFAULT 'draft' NOT NULL,
	"visibility" "visibility" DEFAULT 'public' NOT NULL,
	"isDemo" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"publishedAt" timestamp,
	"fundedAt" timestamp,
	"deletedAt" timestamp,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "referralClicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"referralId" integer NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"clickedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"referrerUserId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"referralCode" text NOT NULL,
	"clicksCount" integer DEFAULT 0 NOT NULL,
	"conversionsCount" integer DEFAULT 0 NOT NULL,
	"totalCommission" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "referrals_referralCode_unique" UNIQUE("referralCode")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"roleName" text NOT NULL,
	"roleDescription" text,
	"permissions" json,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "roles_roleName_unique" UNIQUE("roleName")
);
--> statement-breakpoint
CREATE TABLE "siteSettings" (
	"id" serial PRIMARY KEY NOT NULL,
	"settingKey" text NOT NULL,
	"settingValue" text,
	"settingType" "settingType" DEFAULT 'text' NOT NULL,
	"settingDescription" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "siteSettings_settingKey_unique" UNIQUE("settingKey")
);
--> statement-breakpoint
CREATE TABLE "staticPages" (
	"id" serial PRIMARY KEY NOT NULL,
	"pageSlug" text NOT NULL,
	"pageTitle" text NOT NULL,
	"pageContent" text NOT NULL,
	"metaTitle" text,
	"metaDescription" text,
	"isPublished" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "staticPages_pageSlug_unique" UNIQUE("pageSlug")
);
--> statement-breakpoint
CREATE TABLE "userAchievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"achievementType" text NOT NULL,
	"achievementName" text NOT NULL,
	"achievementDescription" text,
	"achievementIconUrl" text,
	"currentProgress" integer DEFAULT 0 NOT NULL,
	"targetProgress" integer,
	"isCompleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp NOT NULL,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "userRoles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"roleId" integer NOT NULL,
	"assignedAt" timestamp NOT NULL,
	"assignedByUserId" integer
);
--> statement-breakpoint
CREATE TABLE "userWallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"availableBalance" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"pendingBalance" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"totalEarned" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"totalWithdrawn" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"currency" text DEFAULT 'SAR' NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "userWallets_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" text NOT NULL,
	"email" text,
	"username" text,
	"name" text,
	"passwordHash" text,
	"loginMethod" text,
	"bio" text,
	"avatarUrl" text,
	"coverImageUrl" text,
	"city" text,
	"country" text DEFAULT 'Saudi Arabia',
	"phone" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"isEarlyAccess" boolean DEFAULT false NOT NULL,
	"batch" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"subscriptionTier" "subscriptionTier" DEFAULT 'free' NOT NULL,
	"subscriptionExpiresAt" timestamp,
	"websiteUrl" text,
	"twitterUrl" text,
	"linkedinUrl" text,
	"instagramUrl" text,
	"emailNotifications" boolean DEFAULT true NOT NULL,
	"marketingEmails" boolean DEFAULT false NOT NULL,
	"language" text DEFAULT 'ar' NOT NULL,
	"timezone" text DEFAULT 'Asia/Riyadh' NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"lastSignedIn" timestamp NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "walletTransactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"walletId" integer NOT NULL,
	"userId" integer NOT NULL,
	"transactionType" "transactionType" NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"currency" text DEFAULT 'SAR' NOT NULL,
	"description" text,
	"commissionId" integer,
	"paymentId" integer,
	"balanceAfter" numeric(15, 2),
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "adminActivityLogs" ADD CONSTRAINT "adminActivityLogs_adminUserId_users_id_fk" FOREIGN KEY ("adminUserId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_negotiationId_negotiations_id_fk" FOREIGN KEY ("negotiationId") REFERENCES "public"."negotiations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_referralId_referrals_id_fk" FOREIGN KEY ("referralId") REFERENCES "public"."referrals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communityComments" ADD CONSTRAINT "communityComments_postId_communityPosts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."communityPosts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communityComments" ADD CONSTRAINT "communityComments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communityPosts" ADD CONSTRAINT "communityPosts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communityReactions" ADD CONSTRAINT "communityReactions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communityReactions" ADD CONSTRAINT "communityReactions_postId_communityPosts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."communityPosts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communityReactions" ADD CONSTRAINT "communityReactions_commentId_communityComments_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."communityComments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contentReports" ADD CONSTRAINT "contentReports_reporterId_users_id_fk" FOREIGN KEY ("reporterId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contentReports" ADD CONSTRAINT "contentReports_postId_communityPosts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."communityPosts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contentReports" ADD CONSTRAINT "contentReports_commentId_communityComments_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."communityComments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contentReports" ADD CONSTRAINT "contentReports_reviewedByAdminId_users_id_fk" FOREIGN KEY ("reviewedByAdminId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emailVerificationTokens" ADD CONSTRAINT "emailVerificationTokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_users_id_fk" FOREIGN KEY ("followerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_users_id_fk" FOREIGN KEY ("followingId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "negotiationMessages" ADD CONSTRAINT "negotiationMessages_negotiationId_negotiations_id_fk" FOREIGN KEY ("negotiationId") REFERENCES "public"."negotiations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "negotiationMessages" ADD CONSTRAINT "negotiationMessages_senderId_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "negotiations" ADD CONSTRAINT "negotiations_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "negotiations" ADD CONSTRAINT "negotiations_investorId_users_id_fk" FOREIGN KEY ("investorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "negotiations" ADD CONSTRAINT "negotiations_projectOwnerId_users_id_fk" FOREIGN KEY ("projectOwnerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passwordResetTokens" ADD CONSTRAINT "passwordResetTokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_negotiationId_negotiations_id_fk" FOREIGN KEY ("negotiationId") REFERENCES "public"."negotiations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_backingId_projectBackings_id_fk" FOREIGN KEY ("backingId") REFERENCES "public"."projectBackings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectBackings" ADD CONSTRAINT "projectBackings_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectBackings" ADD CONSTRAINT "projectBackings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectBackings" ADD CONSTRAINT "projectBackings_packageId_projectPackages_id_fk" FOREIGN KEY ("packageId") REFERENCES "public"."projectPackages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectBackings" ADD CONSTRAINT "projectBackings_referredByUserId_users_id_fk" FOREIGN KEY ("referredByUserId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectComments" ADD CONSTRAINT "projectComments_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectComments" ADD CONSTRAINT "projectComments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectLinks" ADD CONSTRAINT "projectLinks_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectMedia" ADD CONSTRAINT "projectMedia_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectPackages" ADD CONSTRAINT "projectPackages_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectTeamMembers" ADD CONSTRAINT "projectTeamMembers_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectUpdates" ADD CONSTRAINT "projectUpdates_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectUpdates" ADD CONSTRAINT "projectUpdates_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_ideaId_ideas_id_fk" FOREIGN KEY ("ideaId") REFERENCES "public"."ideas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referralClicks" ADD CONSTRAINT "referralClicks_referralId_referrals_id_fk" FOREIGN KEY ("referralId") REFERENCES "public"."referrals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrerUserId_users_id_fk" FOREIGN KEY ("referrerUserId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userAchievements" ADD CONSTRAINT "userAchievements_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userRoles" ADD CONSTRAINT "userRoles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userRoles" ADD CONSTRAINT "userRoles_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userRoles" ADD CONSTRAINT "userRoles_assignedByUserId_users_id_fk" FOREIGN KEY ("assignedByUserId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userWallets" ADD CONSTRAINT "userWallets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "walletTransactions" ADD CONSTRAINT "walletTransactions_walletId_userWallets_id_fk" FOREIGN KEY ("walletId") REFERENCES "public"."userWallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "walletTransactions" ADD CONSTRAINT "walletTransactions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "walletTransactions" ADD CONSTRAINT "walletTransactions_commissionId_commissions_id_fk" FOREIGN KEY ("commissionId") REFERENCES "public"."commissions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "walletTransactions" ADD CONSTRAINT "walletTransactions_paymentId_payments_id_fk" FOREIGN KEY ("paymentId") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "community_posts_user_id_idx" ON "communityPosts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "community_posts_is_demo_idx" ON "communityPosts" USING btree ("isDemo");--> statement-breakpoint
CREATE INDEX "ideas_user_id_idx" ON "ideas" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "ideas_status_idx" ON "ideas" USING btree ("evaluationStatus");--> statement-breakpoint
CREATE INDEX "ideas_is_demo_idx" ON "ideas" USING btree ("isDemo");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "notifications_is_read_idx" ON "notifications" USING btree ("isRead");--> statement-breakpoint
CREATE INDEX "projects_user_id_idx" ON "projects" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("projectStatus");--> statement-breakpoint
CREATE INDEX "projects_is_demo_idx" ON "projects" USING btree ("isDemo");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "username_idx" ON "users" USING btree ("username");