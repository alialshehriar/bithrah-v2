CREATE TABLE "projectReferrals" (
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
	CONSTRAINT "projectReferrals_referralCode_unique" UNIQUE("referralCode")
);
--> statement-breakpoint
ALTER TABLE "referrals" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "referrals" CASCADE;--> statement-breakpoint
ALTER TABLE "commissions" DROP CONSTRAINT "commissions_referralId_referrals_id_fk";
--> statement-breakpoint
ALTER TABLE "referralClicks" DROP CONSTRAINT "referralClicks_referralId_referrals_id_fk";
--> statement-breakpoint
ALTER TABLE "projectReferrals" ADD CONSTRAINT "projectReferrals_referrerUserId_users_id_fk" FOREIGN KEY ("referrerUserId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectReferrals" ADD CONSTRAINT "projectReferrals_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_referralId_projectReferrals_id_fk" FOREIGN KEY ("referralId") REFERENCES "public"."projectReferrals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referralClicks" ADD CONSTRAINT "referralClicks_referralId_projectReferrals_id_fk" FOREIGN KEY ("referralId") REFERENCES "public"."projectReferrals"("id") ON DELETE cascade ON UPDATE no action;