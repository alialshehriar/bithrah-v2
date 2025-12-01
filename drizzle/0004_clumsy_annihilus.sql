CREATE TABLE "systemSettings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"type" "settingType" DEFAULT 'text' NOT NULL,
	"description" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "systemSettings_key_unique" UNIQUE("key")
);
