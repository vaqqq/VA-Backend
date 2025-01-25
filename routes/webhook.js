var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var https = require('https');

const VERCEL_WEBHOOK_SECRET = 'EF3nuYyP0WdD9FCdm7K0I0Og';
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1325213160260636726/Ssmyhn6Iyxo70xT-fkVKXkEsMqkRYvo-AZf-QgSrdw_vhRhccEkbSqHbAUxEeyK2bavi';
const DISCORD_WEBHOOK_NAME = 'Holy Vercel Alerts';
const DISCORD_WEBHOOK_AVATAR = 'https://holy-client.com/assets/badges/HolyBadge.png';

function validateSignature(req) {
    const signature = req.headers['x-vercel-signature'];
    if (!signature) return false;

    const rawBody = JSON.stringify(req.body);
    const expectedSignature = crypto
        .createHmac('sha1', VERCEL_WEBHOOK_SECRET) 
        .update(rawBody)
        .digest('hex');

    return signature === expectedSignature;
}

function sendDiscordMessage(content) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            username: DISCORD_WEBHOOK_NAME,
            avatar_url: DISCORD_WEBHOOK_AVATAR,
            content,
        });

        const webhookUrl = new URL(DISCORD_WEBHOOK_URL);
        const options = {
            hostname: webhookUrl.hostname,
            path: webhookUrl.pathname + webhookUrl.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => (responseData += chunk));
            res.on('end', () => {
                if (res.statusCode === 204) {
                    console.log('✅ Sent Discord notification:', content);
                    resolve();
                } else {
                    console.error('❌ Failed to send Discord message:', responseData);
                    reject(new Error(responseData));
                }
            });
        });

        req.on('error', (error) => reject(error));
        req.write(postData);
        req.end();
    });
}

/* GET home page. */
router.post('/', async (req, res) => {
    console.log('🔔 Webhook received:', req.body);

    if (VERCEL_WEBHOOK_SECRET && !validateSignature(req)) {
        console.log('❌ Invalid signature!');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const eventType = req.body.type || 'unknown';
    let message = '';

    switch (eventType) {
        case 'deployment.created':
            message = `🔔 **Deployment Started**\n**Project:** ${req.body.payload?.name}\n**URL:** ${req.body.payload?.url}`;
            break;

        case 'deployment.ready':
            message = `✅ **Deployment Successful!**\n**Project:** ${req.body.payload?.name}\n**URL:** ${req.body.payload?.url}`;
            break;

        case 'deployment.error':
            message = `❌ **Deployment Failed!**\n**Project:** ${req.body.payload?.name}\n**Error:** ${req.body.payload?.error?.message || 'Unknown error'}`;
            break;

        case 'deployment.promoted':
            message = `🚀 **Deployment Promoted!**\n**Project:** ${req.body.payload?.name}\n**URL:** ${req.body.payload?.url}\n**Promoted from:** ${req.body.payload?.from || 'Unknown'}`;
            break;
        
        case 'deployment.succeeded':
            message = `🎉 **Deployment Succeeded!**\n**Project:** ${req.body.payload?.name}\n**URL:** ${req.body.payload?.url}`;
        break;

        case 'firewall.detect':
            message = `🚨 **Firewall Alert!**\n**Project:** ${req.body.payload?.project}\n**Blocked IP:** ${req.body.payload?.clientIp}\n**Location:** ${req.body.payload?.country || 'Unknown'}\n**Reason:** ${req.body.payload?.reason || 'Unknown reason'}`;
            break;

        default:
            message = `⚠️ **Unknown Event:** ${eventType}`;
    }

    if (message) {
        try {
            await sendDiscordMessage(message);
        } catch (error) {
            console.error('❌ Error sending Discord message:', error.message);
        }
    }

    res.status(200).json({ success: true, event: eventType });
});

module.exports = router;