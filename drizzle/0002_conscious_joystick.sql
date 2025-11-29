CREATE TABLE "earlyAccessReferrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"referrerId" integer NOT NULL,
	"referredId" integer NOT NULL,
	"referralCode" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "earlyAccessUsers" (
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
	CONSTRAINT "earlyAccessUsers_email_unique" UNIQUE("email"),
	CONSTRAINT "earlyAccessUsers_username_unique" UNIQUE("username"),
	CONSTRAINT "earlyAccessUsers_referralCode_unique" UNIQUE("referralCode")
);
--> statement-breakpoint
ALTER TABLE "earlyAccessReferrals" ADD CONSTRAINT "earlyAccessReferrals_referrerId_earlyAccessUsers_id_fk" FOREIGN KEY ("referrerId") REFERENCES "public"."earlyAccessUsers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "earlyAccessReferrals" ADD CONSTRAINT "earlyAccessReferrals_referredId_earlyAccessUsers_id_fk" FOREIGN KEY ("referredId") REFERENCES "public"."earlyAccessUsers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "early_access_referrals_referrer_id_idx" ON "earlyAccessReferrals" USING btree ("referrerId");--> statement-breakpoint
CREATE INDEX "early_access_referrals_referred_id_idx" ON "earlyAccessReferrals" USING btree ("referredId");--> statement-breakpoint
CREATE UNIQUE INDEX "early_access_email_idx" ON "earlyAccessUsers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "early_access_username_idx" ON "earlyAccessUsers" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "early_access_referral_code_idx" ON "earlyAccessUsers" USING btree ("referralCode");--> statement-breakpoint
CREATE INDEX "early_access_referred_by_idx" ON "earlyAccessUsers" USING btree ("referredBy");