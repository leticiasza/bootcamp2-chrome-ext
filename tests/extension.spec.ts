import { test, expect, chromium, BrowserContext } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dist = path.resolve(__dirname, '..', 'dist');

test.describe('Gerador de Senhas - Extensão Chrome', () => {
  let context: BrowserContext;
  let extensionId: string;

  test.beforeAll(async () => {
    console.log('📁 Carregando extensão do caminho:', dist);
    
    context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${dist}`,
        `--load-extension=${dist}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
    });

    // Aguarda alguns segundos para a extensão carregar
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Aguarda o service worker da extensão
    let [background] = context.serviceWorkers();
    if (!background) {
      console.log('⏳ Aguardando service worker...');
      background = await context.waitForEvent('serviceworker', { timeout: 10000 });
    }

    extensionId = background.url().split('/')[2];
    console.log('✅ Extension ID:', extensionId);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('extensão carrega sem erros', async () => {
    expect(extensionId).toBeTruthy();
    expect(extensionId).toMatch(/^[a-z]{32}$/);
  });

  test('manifest.json está correto', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/manifest.json`);
    
    const manifestText = await page.locator('body').textContent();
    const manifest = JSON.parse(manifestText || '{}');

    expect(manifest.name).toBe('Gerador de Senhas');
    expect(manifest.version).toBeTruthy();
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.action).toBeDefined();
    expect(manifest.action.default_popup).toBe('src/popup/popup.html');
    
    await page.close();
  });

  test('popup HTML existe e pode ser acessado', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/src/popup/popup.html`);

    await expect(page.locator('body')).toBeVisible();
    
    await page.close();
  });

  test('service worker está registrado', async () => {
    const serviceWorkers = context.serviceWorkers();
    expect(serviceWorkers.length).toBeGreaterThan(0);
    
    const extensionWorker = serviceWorkers.find(sw => 
      sw.url().includes(extensionId)
    );
    
    expect(extensionWorker).toBeDefined();
  });

  test('permissões necessárias estão configuradas', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/manifest.json`);
    
    const manifestText = await page.locator('body').textContent();
    const manifest = JSON.parse(manifestText || '{}');

    expect(manifest.permissions).toContain('clipboardWrite');
    
    await page.close();
  });

  test('popup contém elementos de geração de senha', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/src/popup/popup.html`);

    await page.waitForLoadState('domcontentloaded');

    const hasPasswordDisplay = await page.locator('input, .password, #password').count() > 0;
    expect(hasPasswordDisplay).toBeTruthy();

    const hasGenerateButton = await page.locator('button').count() > 0;
    expect(hasGenerateButton).toBeTruthy();

    await page.close();
  });
});