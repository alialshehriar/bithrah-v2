#!/usr/bin/env python3
import requests
import json

VERCEL_TOKEN = "fQJLNoSszC6FLMLue17FnPa3"
PROJECT_ID = "prj_9HVYDyKKQ0AxLh9JZDsTwIR0DzLk"

# Environment variables to add
env_vars = {
    "DATABASE_URL": 'mysql://3GBEQsMxKetHhYw.15ec670fd271:8krQBgTq5s08YL9pXA5S@gateway02.us-east-1.prod.aws.tidbcloud.com:4000/VRAozaC7wZxCFU6SoJ8XBX?ssl={"rejectUnauthorized":true}',
    "JWT_SECRET": "ZBX9FLPnX6j3NwNtxeWFos",
    "VITE_APP_ID": "VRAozaC7wZxCFU6SoJ8XBX",
    "OAUTH_SERVER_URL": "https://api.manus.im",
    "VITE_OAUTH_PORTAL_URL": "https://manus.im",
    "OWNER_OPEN_ID": "JG4RmFXJdoubr87XZJAJ4L",
    "OWNER_NAME": "Ali Alshehriii",
    "BUILT_IN_FORGE_API_URL": "https://forge.manus.ai",
    "BUILT_IN_FORGE_API_KEY": "Nayb4HTL2bwfVxPuzkGhYo",
    "VITE_FRONTEND_FORGE_API_KEY": "icoUt7yEaXF3fTVRsJnfZS",
    "VITE_FRONTEND_FORGE_API_URL": "https://forge.manus.ai",
    "VITE_ANALYTICS_ENDPOINT": "https://manus-analytics.com",
    "VITE_ANALYTICS_WEBSITE_ID": "f666d908-2adb-4a73-a38a-7bb11e1f6b3e",
    "VITE_APP_TITLE": "بذره 2.0 - منصة الوساطة الذكية",
    "VITE_APP_LOGO": "https://files.manuscdn.com/user_upload_by_module/web_dev_logo/116849159/NEYTbuXjtwAVCEwZ.png"
}

headers = {
    "Authorization": f"Bearer {VERCEL_TOKEN}",
    "Content-Type": "application/json"
}

print("🚀 Adding environment variables to Vercel project...")
print(f"Project ID: {PROJECT_ID}\n")

success_count = 0
failed_count = 0

for key, value in env_vars.items():
    payload = {
        "key": key,
        "value": value,
        "type": "encrypted",
        "target": ["production", "preview", "development"]
    }
    
    try:
        response = requests.post(
            f"https://api.vercel.com/v10/projects/{PROJECT_ID}/env",
            headers=headers,
            json=payload
        )
        
        if response.status_code in [200, 201]:
            print(f"✅ {key}")
            success_count += 1
        else:
            print(f"❌ {key}: {response.status_code} - {response.text[:100]}")
            failed_count += 1
    except Exception as e:
        print(f"❌ {key}: {str(e)}")
        failed_count += 1

print(f"\n📊 Summary: {success_count} succeeded, {failed_count} failed")

# Link GitHub repository
print("\n🔗 Linking GitHub repository...")
link_payload = {
    "type": "github",
    "repo": "alialshehriar/bithrah-v2",
    "repoId": 999999999  # Will be auto-detected
}

try:
    link_response = requests.post(
        f"https://api.vercel.com/v9/projects/{PROJECT_ID}/link",
        headers=headers,
        json=link_payload
    )
    
    if link_response.status_code in [200, 201]:
        print("✅ GitHub repository linked successfully")
    else:
        print(f"⚠️  GitHub link status: {link_response.status_code}")
        print(f"Response: {link_response.text[:200]}")
except Exception as e:
    print(f"⚠️  GitHub link error: {str(e)}")

print("\n✅ Deployment configuration complete!")
print("🌐 Visit: https://vercel.com/dashboard to trigger the first deployment")
