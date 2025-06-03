const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const requestIp = require('request-ip');
const useragent = require('express-useragent');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const PORT = process.env.PORT || 5000;
const path = require('path');
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/confess';

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.json());
app.use(useragent.express());
app.use(express.static(path.join(__dirname, 'public')));

// ========== Mongoose Model ==========
const ConfessionSchema = new mongoose.Schema({
    confession: { type: String, required: true },
    nickname: { type: String, default: null },
    isPublic: { type: Boolean, default: null },
    hashtags: { type: [String], default: null },
    hints: { type: String, default: null },
    ipAddress: { type: String },
    proxy: { type: Boolean, default: null },
    asn: { type: String, default: null },
    isp: { type: String, default: null },
    geolocation: {
        country: { type: String, default: null },
        city: { type: String, default: null },
        region: { type: String, default: null },
        timezone: { type: String, default: null },
        loc: { type: String, default: null }, // lat,long string
        gps: { type: String, default: null }, // from browser
        gpsAccuracy: { type: Number, default: null },
    },
    userAgent: {
        browser: { type: String, default: null },
        version: { type: String, default: null },
        os: { type: String, default: null },
        platform: { type: String, default: null },
        source: { type: String, default: null },
        raw: { type: String, default: null }, // Store navigator.userAgent as raw
    },
    network: {
        connectionType: { type: String, default: null },
        bandwidth: { type: Number, default: null },
    },
    screenResolution: { type: String, default: null },
    behavioral: {
        timeSpent: { type: Number, default: null }, // ms/seconds
        referrer: { type: String, default: null },
        pageLoadTimestamp: { type: Date, default: null },
    },
    createdAt: { type: Date, default: Date.now },
});

const Confession = mongoose.model('confessions', ConfessionSchema);

// ========== MongoDB Connection ==========
mongoose.connect(mongoURI).then(() => console.log('MongoDB connected')).catch((err) => console.error(err));;

// ========== Serve form (ejs view assumed as 'form.ejs') ==========
app.get('/', (req, res) => {
    res.render('form');
});

// ========== Helper: IP Info ==========
async function getIpInfo(ip) {
    try {
        // Use ipinfo.io for ASN, ISP, country, city, loc, timezone, org
        const res = await fetch(`https://ipinfo.io/${ip}?token=${process.env.LOCATION_TOKEN}`);
        if (!res.ok) return {};
        const data = await res.json();
        return {
            ip: data.ip,
            city: data.city,
            country: data.country,
            region: data.region,
            loc: data.loc,
            timezone: data.timezone,
            org: data.org,
            asn: data.asn ? data.asn.asn : undefined,
            isp: data.org,
            proxy: data.privacy && data.privacy.proxy ? true : false,
        };
    } catch (e) {
        return {};
    }
}

// ========== API Endpoint ==========
app.post('/submit', async (req, res) => {
    const {
        confession,
        nickname,
        isPublic,
        hashtags,
        hints,
        screenResolution,
        userAgent, // raw userAgent string from frontend
        connectionType,
        bandwidth,
        gpsCoords,
        gpsAccuracy,
        timeSpent,
        referrer,
        pageLoadTimestamp,
    } = req.body;

    // Ensure confession is not empty
    if (!confession || confession.trim() === '') {
        return res.status(400).json({ error: 'Confession is required.' });
    }

    // Get IP address
    const ip = requestIp.getClientIp(req);

    // Restrict user to 5 submissions/day per IP
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await Confession.countDocuments({
        ipAddress: ip,
        createdAt: { $gte: today },
    });
    if (count >= 5) {
        return res.status(429).json({ error: 'Submission limit exceeded.' });
    }

    // User agent info from express-useragent
    const ua = req.useragent;
    const userAgentInfo = {
        browser: ua.browser,
        version: ua.version,
        os: ua.os,
        platform: ua.platform,
        source: ua.source,
        raw: userAgent || null,
    };

    // IP info, ASN, ISP, geolocation
    const ipInfo = await getIpInfo(ip);

    const confessionDoc = new Confession({
        confession,
        nickname: nickname && nickname.trim() !== '' ? nickname : null,
        isPublic: typeof isPublic === 'boolean' ? isPublic : !!isPublic, // frontend sends true/false
        hashtags: Array.isArray(hashtags) && hashtags.length > 0 ? hashtags : null,
        hints: hints && hints.trim() !== '' ? hints : null,
        ipAddress: ip,
        proxy: ipInfo.proxy,
        asn: ipInfo.asn,
        isp: ipInfo.isp,
        geolocation: {
            country: ipInfo.country,
            city: ipInfo.city,
            region: ipInfo.region,
            timezone: ipInfo.timezone,
            loc: ipInfo.loc,
            gps: gpsCoords || null,
            gpsAccuracy: gpsAccuracy || null,
        },
        userAgent: userAgentInfo,
        network: {
            connectionType: connectionType || null,
            bandwidth: bandwidth || null,
        },
        screenResolution: screenResolution || null,
        behavioral: {
            timeSpent: timeSpent || null,
            referrer: referrer || null,
            pageLoadTimestamp: pageLoadTimestamp ? new Date(pageLoadTimestamp) : null,
        },
    });

    try {
        await confessionDoc.save();
        res.json({ success: true, message: 'Confession submitted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});