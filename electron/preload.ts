import { contextBridge, ipcRenderer } from 'electron';
import { IElectronAPI } from './ipc-interface'; // Import relativo

const api: IElectronAPI = {
  setIgnoreMouse: (ignore) => ipcRenderer.send('set-ignore-mouse', ignore),
  saveTimeLog: (data) => ipcRenderer.invoke('save-time-log', data),
};

contextBridge.exposeInMainWorld('electronAPI', api);