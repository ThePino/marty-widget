import { app, BrowserWindow, ipcMain, screen, Tray, Menu, globalShortcut, nativeImage } from 'electron';
import path from 'path';
import fs from 'fs';
import Store from 'electron-store';

// SETUP LINUX/DOCKER
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('enable-transparent-visuals');

const store = new Store();

let widgetWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWidgetWindow() {
  const lastPosition = store.get('windowPosition', { x: 100, y: 100 }) as { x: number, y: number };

  widgetWindow = new BrowserWindow({
    width: 350,
    height: 150,
    x: lastPosition.x,
    y: lastPosition.y,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000', 
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    type: 'toolbar',
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
  });

  widgetWindow.setAlwaysOnTop(true, 'screen-saver'); 
  widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  
  // CARICAMENTO ROBUSTO:
  widgetWindow.loadURL(startUrl).catch((e) => {
     console.log("⚠️ Errore caricamento iniziale:", e.message);
  });

  // Se la pagina fallisce (es. Vite non è ancora pronto), riprova ogni secondo
  widgetWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log(`⏳ Vite non pronto (${errorDescription}), riprovo tra 1s...`);
    setTimeout(() => {
      if (widgetWindow) widgetWindow.loadURL(startUrl);
    }, 1000);
  });

  widgetWindow.on('moved', () => {
    if (widgetWindow) {
      const [x, y] = widgetWindow.getPosition();
      store.set('windowPosition', { x, y });
    }
  });

  globalShortcut.register('Control+Shift+I', () => {
    widgetWindow?.webContents.openDevTools({ mode: 'detach' });
  });

  widgetWindow.on('closed', () => (widgetWindow = null));
}

function createTray() {
  // MODIFICA: Usiamo icon.png invece di vite.svg
  const iconPath = path.join(__dirname, '../public/icon.png');
  
  if (!fs.existsSync(iconPath)) {
    console.warn("⚠️ Icona Tray ancora non trovata:", iconPath);
    return;
  }

  try {
    const icon = nativeImage.createFromPath(iconPath);
    // Ridimensioniamo l'icona per essere sicuri che entri nella tray
    const resizedIcon = icon.resize({ width: 16, height: 16 });

    tray = new Tray(resizedIcon);
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Esci', click: () => app.quit() }
    ]);
    tray.setToolTip('Time Tracker');
    tray.setContextMenu(contextMenu);
    console.log("✅ Tray creata con successo!");
  } catch (e) { 
    console.error("Errore critico creazione Tray:", e); 
  }
}

app.whenReady().then(() => {
  setTimeout(() => {
      createWidgetWindow();
      createTray();
  }, 1000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});