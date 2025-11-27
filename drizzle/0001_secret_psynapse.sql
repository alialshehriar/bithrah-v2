CREATE TABLE `adminActivityLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminUserId` int NOT NULL,
	`actionType` varchar(100) NOT NULL,
	`actionDescription` text,
	`targetType` varchar(50),
	`targetId` int,
	`changesMade` json,
	`createdAt` datetime NOT NULL,
	CONSTRAINT `adminActivityLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `commissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int NOT NULL,
	`negotiationId` int,
	`referralId` int,
	`commissionType` enum('bithrah_basic','bithrah_plus','marketer') NOT NULL,
	`commissionAmount` decimal(15,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`dealAmount` decimal(15,2),
	`commissionPercentage` decimal(5,2),
	`status` enum('pending','approved','paid') NOT NULL DEFAULT 'pending',
	`createdAt` datetime NOT NULL,
	`approvedAt` datetime,
	`paidAt` datetime,
	CONSTRAINT `commissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communityComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`parentCommentId` int,
	`commentText` text NOT NULL,
	`likesCount` int NOT NULL DEFAULT 0,
	`isReported` boolean NOT NULL DEFAULT false,
	`isHidden` boolean NOT NULL DEFAULT false,
	`isDeleted` boolean NOT NULL DEFAULT false,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`deletedAt` datetime,
	CONSTRAINT `communityComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communityPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`postText` text,
	`postType` enum('text','image','video','link','poll') NOT NULL DEFAULT 'text',
	`mediaUrl` varchar(500),
	`mediaType` varchar(50),
	`linkUrl` varchar(500),
	`linkTitle` varchar(255),
	`linkDescription` text,
	`linkImageUrl` varchar(500),
	`likesCount` int NOT NULL DEFAULT 0,
	`commentsCount` int NOT NULL DEFAULT 0,
	`sharesCount` int NOT NULL DEFAULT 0,
	`viewsCount` int NOT NULL DEFAULT 0,
	`hashtags` json,
	`mentions` json,
	`isReported` boolean NOT NULL DEFAULT false,
	`isHidden` boolean NOT NULL DEFAULT false,
	`isDeleted` boolean NOT NULL DEFAULT false,
	`isDemo` boolean NOT NULL DEFAULT false,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`deletedAt` datetime,
	CONSTRAINT `communityPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communityReactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`postId` int,
	`commentId` int,
	`reactionType` enum('like','love','celebrate','support','insightful') NOT NULL DEFAULT 'like',
	`createdAt` datetime NOT NULL,
	CONSTRAINT `communityReactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterId` int NOT NULL,
	`postId` int,
	`commentId` int,
	`reportReason` enum('spam','harassment','inappropriate','misleading','other') NOT NULL,
	`reportDescription` text,
	`status` enum('pending','reviewed','action_taken','dismissed') NOT NULL DEFAULT 'pending',
	`reviewedByAdminId` int,
	`adminNotes` text,
	`createdAt` datetime NOT NULL,
	`reviewedAt` datetime,
	CONSTRAINT `contentReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailVerificationTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` datetime NOT NULL,
	`createdAt` datetime NOT NULL,
	`usedAt` datetime,
	CONSTRAINT `emailVerificationTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailVerificationTokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `follows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`followerId` int NOT NULL,
	`followingId` int NOT NULL,
	`createdAt` datetime NOT NULL,
	CONSTRAINT `follows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ideas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`ideaName` varchar(255) NOT NULL,
	`ideaDescription` text NOT NULL,
	`sector` varchar(100),
	`category` varchar(100),
	`stage` varchar(100),
	`technicalNeeds` text,
	`financialNeeds` text,
	`evaluationStatus` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`evaluationSummary` text,
	`strengths` text,
	`weaknesses` text,
	`risks` text,
	`feasibilityOpinion` text,
	`strategicAnalysis` text,
	`financialAnalysis` text,
	`marketAnalysis` text,
	`executionAnalysis` text,
	`growthStrategy` text,
	`overallScore` decimal(3,2),
	`convertedToProject` boolean NOT NULL DEFAULT false,
	`projectId` int,
	`isDemo` boolean NOT NULL DEFAULT false,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`evaluatedAt` datetime,
	`deletedAt` datetime,
	CONSTRAINT `ideas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaderboardSnapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`snapshotDate` datetime NOT NULL,
	`snapshotType` enum('daily','weekly','monthly','all_time') NOT NULL,
	`topProjectsByFunding` json,
	`topProjectsByBackers` json,
	`topBackers` json,
	`topProjectOwners` json,
	`topCommunityMembers` json,
	`createdAt` datetime NOT NULL,
	CONSTRAINT `leaderboardSnapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `negotiationMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`negotiationId` int NOT NULL,
	`senderId` int NOT NULL,
	`messageText` text NOT NULL,
	`messageType` enum('text','file','offer','counter_offer') NOT NULL DEFAULT 'text',
	`attachmentUrl` varchar(500),
	`attachmentType` varchar(50),
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` datetime,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `negotiationMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `negotiations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`investorId` int NOT NULL,
	`projectOwnerId` int NOT NULL,
	`depositAmount` decimal(15,2),
	`depositStatus` enum('pending','paid','refunded') NOT NULL DEFAULT 'pending',
	`status` enum('open','in_progress','closed_success','closed_failed','cancelled') NOT NULL DEFAULT 'open',
	`dealAmount` decimal(15,2),
	`dealTerms` text,
	`commissionType` enum('basic','plus'),
	`bithrahCommission` decimal(15,2),
	`marketerCommission` decimal(15,2),
	`ndaSigned` boolean NOT NULL DEFAULT false,
	`ndaSignedAt` datetime,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`closedAt` datetime,
	CONSTRAINT `negotiations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`notificationType` varchar(100) NOT NULL,
	`notificationTitle` varchar(255) NOT NULL,
	`notificationText` text,
	`notificationIconUrl` varchar(500),
	`relatedEntityType` varchar(50),
	`relatedEntityId` int,
	`actionUrl` varchar(500),
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` datetime,
	`createdAt` datetime NOT NULL,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `passwordResetTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` datetime NOT NULL,
	`createdAt` datetime NOT NULL,
	`usedAt` datetime,
	CONSTRAINT `passwordResetTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `passwordResetTokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`paymentType` enum('deposit','commission','refund','subscription') NOT NULL,
	`paymentAmount` decimal(15,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`paymentMethod` varchar(50),
	`paymentGateway` varchar(50),
	`gatewayTransactionId` varchar(255),
	`gatewayResponse` text,
	`projectId` int,
	`negotiationId` int,
	`backingId` int,
	`status` enum('pending','processing','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` datetime NOT NULL,
	`completedAt` datetime,
	`failedAt` datetime,
	`refundedAt` datetime,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectBackings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`packageId` int,
	`backingAmount` decimal(15,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`backingType` enum('support','negotiation_deposit') NOT NULL DEFAULT 'support',
	`paymentStatus` enum('pending','processing','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`paymentReference` varchar(255),
	`referralCode` varchar(100),
	`referredByUserId` int,
	`createdAt` datetime NOT NULL,
	`completedAt` datetime,
	`refundedAt` datetime,
	CONSTRAINT `projectBackings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`parentCommentId` int,
	`commentText` text NOT NULL,
	`isDeleted` boolean NOT NULL DEFAULT false,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `projectComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`linkType` enum('website','twitter','linkedin','instagram','facebook','other') NOT NULL,
	`linkUrl` varchar(500) NOT NULL,
	`linkTitle` varchar(255),
	`createdAt` datetime NOT NULL,
	CONSTRAINT `projectLinks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectMedia` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`mediaType` enum('image','video','pdf','document') NOT NULL,
	`mediaUrl` varchar(500) NOT NULL,
	`mediaTitle` varchar(255),
	`mediaDescription` text,
	`fileSize` int,
	`mimeType` varchar(100),
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` datetime NOT NULL,
	CONSTRAINT `projectMedia_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectPackages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`packageName` varchar(255) NOT NULL,
	`packageType` enum('support','negotiation_deposit') NOT NULL DEFAULT 'support',
	`packageAmount` decimal(15,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`packageDescription` text,
	`isLimited` boolean NOT NULL DEFAULT false,
	`totalQuantity` int,
	`claimedQuantity` int NOT NULL DEFAULT 0,
	`features` json,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `projectPackages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectTeamMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`memberName` varchar(255) NOT NULL,
	`memberRole` varchar(255) NOT NULL,
	`memberBio` text,
	`memberImageUrl` varchar(500),
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` datetime NOT NULL,
	CONSTRAINT `projectTeamMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectUpdates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`updateTitle` varchar(255) NOT NULL,
	`updateContent` text NOT NULL,
	`isPublic` boolean NOT NULL DEFAULT true,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `projectUpdates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`ideaId` int,
	`projectName` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`tagline` varchar(500),
	`description` text NOT NULL,
	`sector` varchar(100),
	`category` varchar(100),
	`city` varchar(100),
	`country` varchar(100) DEFAULT 'Saudi Arabia',
	`fundingGoal` decimal(15,2) NOT NULL,
	`currentFunding` decimal(15,2) NOT NULL DEFAULT '0.00',
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`deadline` datetime,
	`coverImageUrl` varchar(500),
	`videoUrl` varchar(500),
	`risksDescription` text,
	`fundUsageDescription` text,
	`status` enum('draft','under_review','published','funded','suspended','completed') NOT NULL DEFAULT 'draft',
	`visibility` enum('public','private','unlisted') NOT NULL DEFAULT 'public',
	`isDemo` boolean NOT NULL DEFAULT false,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`publishedAt` datetime,
	`fundedAt` datetime,
	`deletedAt` datetime,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `projects_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `referralClicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referralId` int NOT NULL,
	`ipAddress` varchar(50),
	`userAgent` text,
	`clickedAt` datetime NOT NULL,
	CONSTRAINT `referralClicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerUserId` int NOT NULL,
	`projectId` int NOT NULL,
	`referralCode` varchar(100) NOT NULL,
	`clicksCount` int NOT NULL DEFAULT 0,
	`conversionsCount` int NOT NULL DEFAULT 0,
	`totalCommission` decimal(15,2) NOT NULL DEFAULT '0.00',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roleName` varchar(100) NOT NULL,
	`roleDescription` text,
	`permissions` json,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_roleName_unique` UNIQUE(`roleName`)
);
--> statement-breakpoint
CREATE TABLE `siteSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(100) NOT NULL,
	`settingValue` text,
	`settingType` enum('text','boolean','number','json') NOT NULL DEFAULT 'text',
	`settingDescription` text,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `siteSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `siteSettings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
CREATE TABLE `staticPages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageSlug` varchar(100) NOT NULL,
	`pageTitle` varchar(255) NOT NULL,
	`pageContent` text NOT NULL,
	`metaTitle` varchar(255),
	`metaDescription` text,
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `staticPages_id` PRIMARY KEY(`id`),
	CONSTRAINT `staticPages_pageSlug_unique` UNIQUE(`pageSlug`)
);
--> statement-breakpoint
CREATE TABLE `userAchievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementType` varchar(100) NOT NULL,
	`achievementName` varchar(255) NOT NULL,
	`achievementDescription` text,
	`achievementIconUrl` varchar(500),
	`currentProgress` int NOT NULL DEFAULT 0,
	`targetProgress` int,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`createdAt` datetime NOT NULL,
	`completedAt` datetime,
	CONSTRAINT `userAchievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userRoles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`roleId` int NOT NULL,
	`assignedAt` datetime NOT NULL,
	`assignedByUserId` int,
	CONSTRAINT `userRoles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userWallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`availableBalance` decimal(15,2) NOT NULL DEFAULT '0.00',
	`pendingBalance` decimal(15,2) NOT NULL DEFAULT '0.00',
	`totalEarned` decimal(15,2) NOT NULL DEFAULT '0.00',
	`totalWithdrawn` decimal(15,2) NOT NULL DEFAULT '0.00',
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `userWallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `userWallets_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `walletTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`walletId` int NOT NULL,
	`userId` int NOT NULL,
	`transactionType` enum('credit','debit','commission','withdrawal') NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`description` text,
	`commissionId` int,
	`paymentId` int,
	`balanceAfter` decimal(15,2),
	`createdAt` datetime NOT NULL,
	CONSTRAINT `walletTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `createdAt` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `updatedAt` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `lastSignedIn` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `coverImageUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `country` varchar(100) DEFAULT 'Saudi Arabia';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `userType` enum('user','project_owner','investor','marketer') DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `isVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `isEarlyAccess` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `batch` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` enum('free','silver','gold','platinum') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionExpiresAt` datetime;--> statement-breakpoint
ALTER TABLE `users` ADD `websiteUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `twitterUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `linkedinUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `instagramUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `emailNotifications` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `marketingEmails` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `language` varchar(10) DEFAULT 'ar' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `timezone` varchar(50) DEFAULT 'Asia/Riyadh' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `deletedAt` datetime;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `username_idx` UNIQUE(`username`);--> statement-breakpoint
ALTER TABLE `adminActivityLogs` ADD CONSTRAINT `adminActivityLogs_adminUserId_users_id_fk` FOREIGN KEY (`adminUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions` ADD CONSTRAINT `commissions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions` ADD CONSTRAINT `commissions_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions` ADD CONSTRAINT `commissions_negotiationId_negotiations_id_fk` FOREIGN KEY (`negotiationId`) REFERENCES `negotiations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions` ADD CONSTRAINT `commissions_referralId_referrals_id_fk` FOREIGN KEY (`referralId`) REFERENCES `referrals`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communityComments` ADD CONSTRAINT `communityComments_postId_communityPosts_id_fk` FOREIGN KEY (`postId`) REFERENCES `communityPosts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communityComments` ADD CONSTRAINT `communityComments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communityPosts` ADD CONSTRAINT `communityPosts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communityReactions` ADD CONSTRAINT `communityReactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communityReactions` ADD CONSTRAINT `communityReactions_postId_communityPosts_id_fk` FOREIGN KEY (`postId`) REFERENCES `communityPosts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communityReactions` ADD CONSTRAINT `communityReactions_commentId_communityComments_id_fk` FOREIGN KEY (`commentId`) REFERENCES `communityComments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentReports` ADD CONSTRAINT `contentReports_reporterId_users_id_fk` FOREIGN KEY (`reporterId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentReports` ADD CONSTRAINT `contentReports_postId_communityPosts_id_fk` FOREIGN KEY (`postId`) REFERENCES `communityPosts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentReports` ADD CONSTRAINT `contentReports_commentId_communityComments_id_fk` FOREIGN KEY (`commentId`) REFERENCES `communityComments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentReports` ADD CONSTRAINT `contentReports_reviewedByAdminId_users_id_fk` FOREIGN KEY (`reviewedByAdminId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emailVerificationTokens` ADD CONSTRAINT `emailVerificationTokens_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `follows` ADD CONSTRAINT `follows_followerId_users_id_fk` FOREIGN KEY (`followerId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `follows` ADD CONSTRAINT `follows_followingId_users_id_fk` FOREIGN KEY (`followingId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ideas` ADD CONSTRAINT `ideas_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `negotiationMessages` ADD CONSTRAINT `negotiationMessages_negotiationId_negotiations_id_fk` FOREIGN KEY (`negotiationId`) REFERENCES `negotiations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `negotiationMessages` ADD CONSTRAINT `negotiationMessages_senderId_users_id_fk` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `negotiations` ADD CONSTRAINT `negotiations_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `negotiations` ADD CONSTRAINT `negotiations_investorId_users_id_fk` FOREIGN KEY (`investorId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `negotiations` ADD CONSTRAINT `negotiations_projectOwnerId_users_id_fk` FOREIGN KEY (`projectOwnerId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `passwordResetTokens` ADD CONSTRAINT `passwordResetTokens_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_negotiationId_negotiations_id_fk` FOREIGN KEY (`negotiationId`) REFERENCES `negotiations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_backingId_projectBackings_id_fk` FOREIGN KEY (`backingId`) REFERENCES `projectBackings`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectBackings` ADD CONSTRAINT `projectBackings_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectBackings` ADD CONSTRAINT `projectBackings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectBackings` ADD CONSTRAINT `projectBackings_packageId_projectPackages_id_fk` FOREIGN KEY (`packageId`) REFERENCES `projectPackages`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectBackings` ADD CONSTRAINT `projectBackings_referredByUserId_users_id_fk` FOREIGN KEY (`referredByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectComments` ADD CONSTRAINT `projectComments_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectComments` ADD CONSTRAINT `projectComments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectLinks` ADD CONSTRAINT `projectLinks_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectMedia` ADD CONSTRAINT `projectMedia_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectPackages` ADD CONSTRAINT `projectPackages_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectTeamMembers` ADD CONSTRAINT `projectTeamMembers_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectUpdates` ADD CONSTRAINT `projectUpdates_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectUpdates` ADD CONSTRAINT `projectUpdates_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_ideaId_ideas_id_fk` FOREIGN KEY (`ideaId`) REFERENCES `ideas`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referralClicks` ADD CONSTRAINT `referralClicks_referralId_referrals_id_fk` FOREIGN KEY (`referralId`) REFERENCES `referrals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_referrerUserId_users_id_fk` FOREIGN KEY (`referrerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userAchievements` ADD CONSTRAINT `userAchievements_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userRoles` ADD CONSTRAINT `userRoles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userRoles` ADD CONSTRAINT `userRoles_roleId_roles_id_fk` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userRoles` ADD CONSTRAINT `userRoles_assignedByUserId_users_id_fk` FOREIGN KEY (`assignedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userWallets` ADD CONSTRAINT `userWallets_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `walletTransactions` ADD CONSTRAINT `walletTransactions_walletId_userWallets_id_fk` FOREIGN KEY (`walletId`) REFERENCES `userWallets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `walletTransactions` ADD CONSTRAINT `walletTransactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `walletTransactions` ADD CONSTRAINT `walletTransactions_commissionId_commissions_id_fk` FOREIGN KEY (`commissionId`) REFERENCES `commissions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `walletTransactions` ADD CONSTRAINT `walletTransactions_paymentId_payments_id_fk` FOREIGN KEY (`paymentId`) REFERENCES `payments`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `community_posts_user_id_idx` ON `communityPosts` (`userId`);--> statement-breakpoint
CREATE INDEX `community_posts_is_demo_idx` ON `communityPosts` (`isDemo`);--> statement-breakpoint
CREATE INDEX `ideas_user_id_idx` ON `ideas` (`userId`);--> statement-breakpoint
CREATE INDEX `ideas_status_idx` ON `ideas` (`evaluationStatus`);--> statement-breakpoint
CREATE INDEX `ideas_is_demo_idx` ON `ideas` (`isDemo`);--> statement-breakpoint
CREATE INDEX `notifications_user_id_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `notifications_is_read_idx` ON `notifications` (`isRead`);--> statement-breakpoint
CREATE INDEX `projects_user_id_idx` ON `projects` (`userId`);--> statement-breakpoint
CREATE INDEX `projects_status_idx` ON `projects` (`status`);--> statement-breakpoint
CREATE INDEX `projects_is_demo_idx` ON `projects` (`isDemo`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `user_type_idx` ON `users` (`userType`);