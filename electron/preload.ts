import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  setIgnoreMouse: (ignore: boolean) => ipcRenderer.send('set-ignore-mouse', ignore),
  saveTimeLog: (data: any) => ipcRenderer.invoke('save-time-log', data) 
});