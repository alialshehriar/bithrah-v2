CREATE TABLE "early_access_referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"referrerId" integer NOT NULL,
	"referredId" integer NOT NULL,
	"referralCode" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "early_access_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"fullName" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"username" text NOT NULL,
	"source" text NOT NULL,
	"referralCode" text NOT NULL,
	"referredBy" text,
	"referralCount" integer DEFAULT 0 NOT NULL,
	"bonusYears" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "early_access_users_email_unique" UNIQUE("email"),
	CONSTRAINT "early_access_users_username_unique" UNIQUE("username"),
	CONSTRAINT "early_access_users_referralCode_unique" UNIQUE("referralCode")
);
--> statement-breakpoint
DROP TABLE "earlyAccessReferrals" CASCADE;--> statement-breakpoint
DROP TABLE "earlyAccessUsers" CASCADE;--> statement-breakpoint
ALTER TABLE "early_access_referrals" ADD CONSTRAINT "early_access_referrals_referrerId_early_access_users_id_fk" FOREIGN KEY ("referrerId") REFERENCES "public"."early_access_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "early_access_referrals" ADD CONSTRAINT "early_access_referrals_referredId_early_access_users_id_fk" FOREIGN KEY ("referredId") REFERENCES "public"."early_access_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "early_access_referrals_referrer_id_idx" ON "early_access_referrals" USING btree ("referrerId");--> statement-breakpoint
CREATE INDEX "early_access_referrals_referred_id_idx" ON "early_access_referrals" USING btree ("referredId");--> statement-breakpoint
CREATE UNIQUE INDEX "early_access_email_idx" ON "early_access_users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "early_access_username_idx" ON "early_access_users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "early_access_referral_code_idx" ON "early_access_users" USING btree ("referralCode");--> statement-breakpoint
CREATE INDEX "early_access_referred_by_idx" ON "early_access_users" USING btree ("referredBy");