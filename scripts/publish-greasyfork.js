#!/usr/bin/env node
/**
 * GreasyFork 自动发布脚本
 * 
 * 使用方法:
 * 1. 设置环境变量: GREASYFORK_API_KEY=你的API密钥
 * 2. 修改 package.json 中的 greasyfork.scriptId
 * 3. 运行: npm run publish:greasyfork
 * 
 * 获取 API 密钥: https://greasyfork.org/users/webhook-info
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const packageJson = require('../package.json');
const SCRIPT_ID = packageJson.greasyfork?.scriptId || process.env.GREASYFORK_SCRIPT_ID;
const API_KEY = process.env.GREASYFORK_API_KEY;

const DIST_FILE = path.join(__dirname, '../dist/douban-polish.user.js');

function log(message, type = 'info') {
    const colors = {
        info: '\x1b[36m',    // 青色
        success: '\x1b[32m', // 绿色
        error: '\x1b[31m',   // 红色
        warn: '\x1b[33m'     // 黄色
    };
    const reset = '\x1b[0m';
    console.log(`${colors[type] || colors.info}[GreasyFork]${reset} ${message}`);
}

async function checkPrerequisites() {
    // 检查 API 密钥
    if (!API_KEY) {
        log('错误: 未设置 GREASYFORK_API_KEY 环境变量', 'error');
        log('请访问 https://greasyfork.org/users/webhook-info 获取 API 密钥', 'info');
        log('然后运行: set GREASYFORK_API_KEY=your_key (Windows) 或 export GREASYFORK_API_KEY=your_key (Mac/Linux)', 'info');
        process.exit(1);
    }

    // 检查 Script ID
    if (!SCRIPT_ID || SCRIPT_ID === 'YOUR_SCRIPT_ID') {
        log('错误: 未配置 greasyfork.scriptId', 'error');
        log('请在 package.json 中设置 greasyfork.scriptId', 'info');
        process.exit(1);
    }

    // 检查构建文件是否存在
    if (!fs.existsSync(DIST_FILE)) {
        log('构建文件不存在，正在执行构建...', 'warn');
        try {
            execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
        } catch (e) {
            log('构建失败', 'error');
            process.exit(1);
        }
    }
}

async function publishToGreasyFork() {
    const content = fs.readFileSync(DIST_FILE, 'utf-8');
    
    const postData = new URLSearchParams({
        'script_version[code]': content
    }).toString();

    const options = {
        hostname: 'greasyfork.org',
        port: 443,
        path: `/scripts/${SCRIPT_ID}/versions.json`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve({ success: true, data });
                } else if (res.statusCode === 401) {
                    reject(new Error('API 密钥无效，请检查 GREASYFORK_API_KEY'));
                } else if (res.statusCode === 404) {
                    reject(new Error(`脚本 ID ${SCRIPT_ID} 不存在`));
                } else {
                    reject(new Error(`发布失败 (HTTP ${res.statusCode}): ${data}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function main() {
    log('=====================================');
    log('  GreasyFork 自动发布工具');
    log('=====================================');
    
    await checkPrerequisites();
    
    log(`脚本版本: ${packageJson.version}`);
    log(`Script ID: ${SCRIPT_ID}`);
    log('正在发布...', 'info');

    try {
        const result = await publishToGreasyFork();
        log('✓ 发布成功!', 'success');
        log(`脚本地址: ${packageJson.greasyfork?.url || `https://greasyfork.org/scripts/${SCRIPT_ID}`}`, 'info');
    } catch (error) {
        log(`✗ 发布失败: ${error.message}`, 'error');
        process.exit(1);
    }
}

main();
