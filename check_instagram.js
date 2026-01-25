require('dotenv').config();
const axios = require('axios');

async function checkInstagramAccounts() {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
        console.error('❌ Error: INSTAGRAM_ACCESS_TOKEN is not defined in .env');
        return;
    }

    console.log('🔍 Debugging Token & Accounts...');

    try {
        // 1. Check WHO owns the token
        const meUrl = 'https://graph.facebook.com/v18.0/me';
        const meResponse = await axios.get(meUrl, {
            params: { access_token: accessToken, fields: 'id,name' }
        });

        console.log(`👤 User: ${meResponse.data.name} (ID: ${meResponse.data.id})`);

        // 2. Check Permissions
        const permUrl = 'https://graph.facebook.com/v18.0/me/permissions';
        const permResponse = await axios.get(permUrl, {
            params: { access_token: accessToken }
        });

        const permissions = permResponse.data.data;
        const granted = permissions.filter(p => p.status === 'granted').map(p => p.permission);
        console.log(`📋 Permissions: ${granted.join(', ')}`);

        // 3. Fetch ALL Pages
        console.log('\n🔍 Scanning for Pages...');
        const pagesUrl = 'https://graph.facebook.com/v18.0/me/accounts';
        const response = await axios.get(pagesUrl, {
            params: {
                access_token: accessToken,
                fields: 'name,id,access_token,instagram_business_account{id,username,name}'
            }
        });

        const pages = response.data.data;

        if (!pages || pages.length === 0) {
            console.log('\n⚠️ No Pages found.');
            console.log('Possibilities:');
            console.log('1. Page selection was skipped during login.');
            console.log('2. The page is not "Published".');
            console.log('3. You are logged into a different FB account.');
            return;
        }

        console.log(`\n✅ Found ${pages.length} Page(s):`);

        pages.forEach((page, index) => {
            console.log(`\n[Page ${index + 1}]`);
            console.log(`  Name: ${page.name}`);
            console.log(`  ID:   ${page.id}`);

            if (page.instagram_business_account) {
                const insta = page.instagram_business_account;
                console.log(`  📷 Instagram Linked!`);
                console.log(`    Username: ${insta.username}`);
                console.log(`    Insta ID: \x1b[32m${insta.id}\x1b[0m (Set this in .env!)`);
            } else {
                console.log(`  ❌ No Instagram linked.`);
            }
        });

    } catch (error) {
        console.error('\n❌ API Error:');
        if (error.response) {
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

checkInstagramAccounts();
