import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { WebSocket } from 'ws';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9222;
const APP_URL = 'https://proofolio-ochre.vercel.app';
const OUT_DIR = path.resolve('docs/screenshots');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getWebSocketDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (res.ok) {
        const pages = await res.json();
        if (pages.length > 0 && pages[0].webSocketDebuggerUrl) {
          return pages[0].webSocketDebuggerUrl;
        }
      }
    } catch {
      // wait
    }
    await sleep(300);
  }
  throw new Error('Chrome remote debugging not ready');
}

class CDPClient {
  constructor(ws) {
    this.ws = ws;
    this.id = 1;
    this.pending = new Map();

    this.ws.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) {
          reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        } else {
          resolve(msg.result);
        }
      }
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    return res?.result?.value;
  }

  async captureScreenshot(filepath, clip = null) {
    const params = { format: 'png', captureBeyondViewport: true };
    if (clip) params.clip = clip;
    const res = await this.send('Page.captureScreenshot', params);
    const buf = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filepath, buf);
    console.log(`Saved screenshot: ${filepath} (${(buf.length / 1024).toFixed(1)} KB)`);
  }
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('Starting headless Chrome...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--window-size=1440,1080',
    '--default-background-color=050811',
    '--hide-scrollbars',
  ], { stdio: 'ignore' });

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.on('open', res);
      ws.on('error', rej);
    });

    const cdp = new CDPClient(ws);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1080,
      deviceScaleFactor: 2, // Retina HD
      mobile: false,
    });

    console.log(`Navigating to ${APP_URL}...`);
    await cdp.send('Page.navigate', { url: APP_URL });
    await sleep(3500);

    // 1. Hero & Network Status Screenshot
    console.log('Capturing Hero & Network Status...');
    await cdp.eval(`window.scrollTo(0, 0);`);
    await sleep(600);
    await cdp.captureScreenshot(path.join(OUT_DIR, '01_hero_and_live_status.png'), {
      x: 0,
      y: 0,
      width: 1440,
      height: 860,
      scale: 1,
    });

    // 2. Connect Demo Wallet & View Solvency Terminal
    console.log('Connecting Demo Wallet & Scrolling to Solvency Terminal...');
    await cdp.eval(`
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Demo') || b.textContent.includes('Connect Demo Wallet'));
      if (btn) btn.click();
    `);
    await sleep(800);

    await cdp.eval(`
      const target = document.getElementById('prover-app') || document.querySelector('.solvency-gate-card') || document.querySelector('.section-container:nth-of-type(2)');
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo(0, 750);
      }
    `);
    await sleep(800);

    await cdp.captureScreenshot(path.join(OUT_DIR, '02_solvency_terminal_presets.png'), {
      x: 0,
      y: 0,
      width: 1440,
      height: 980,
      scale: 1,
    });

    // 3. Click "Generate ZK Proof & Submit to Preprod"
    console.log('Triggering ZK Proof Generation...');
    await cdp.eval(`
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.textContent.includes('Generate ZK Proof') || 
        b.textContent.includes('Prove Solvency')
      );
      if (submitBtn) submitBtn.click();
    `);
    
    // Wait for client-side proving animation and confirmation
    await sleep(3500);

    console.log('Capturing Verified ZK Proof Result...');
    await cdp.eval(`
      const resElem = document.querySelector('.circuit-result-box') || document.querySelector('.result-field-full') || document.getElementById('prover-app');
      if (resElem) resElem.scrollIntoView({ behavior: 'instant', block: 'center' });
    `);
    await sleep(600);

    await cdp.captureScreenshot(path.join(OUT_DIR, '03_zk_proof_verified_result.png'), {
      x: 0,
      y: 0,
      width: 1440,
      height: 920,
      scale: 1,
    });

    // 4. Open Audit Certificate Modal
    console.log('Opening Cryptographic Audit Certificate Modal...');
    await cdp.eval(`
      const certBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.textContent.includes('Audit Certificate') || 
        b.textContent.includes('Certificate')
      );
      if (certBtn) certBtn.click();
    `);
    await sleep(1000);

    console.log('Capturing Audit Certificate Modal...');
    await cdp.captureScreenshot(path.join(OUT_DIR, '04_verifiable_audit_certificate.png'), {
      x: 0,
      y: 0,
      width: 1440,
      height: 1080,
      scale: 1,
    });

    // 5. Close Modal and Scroll to Privacy Inspector
    console.log('Capturing Observable Privacy Inspector...');
    await cdp.eval(`
      const closeBtn = document.querySelector('.modal-close-btn') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close') || b.title?.includes('Close'));
      if (closeBtn) closeBtn.click();
    `);
    await sleep(500);

    await cdp.eval(`
      const privacySection = document.getElementById('privacy-model') || document.querySelector('.privacy-inspector-container') || Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent.includes('Privacy') || h.textContent.includes('Inspector'))?.parentElement;
      if (privacySection) {
        privacySection.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo(0, 1800);
      }
    `);
    await sleep(800);

    await cdp.captureScreenshot(path.join(OUT_DIR, '05_zero_disclosure_privacy_inspector.png'), {
      x: 0,
      y: 0,
      width: 1440,
      height: 900,
      scale: 1,
    });

    console.log('All 5 screenshots captured successfully!');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

main().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
