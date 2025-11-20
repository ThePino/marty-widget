import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  moveCorner: (corner: string) => ipcRenderer.send('move-corner', corner),
  setIgnoreMouse: (ignore: boolean) => ipcRenderer.send('set-ignore-mouse', ignore),
  saveTimeLog: (data: any) => ipcRenderer.invoke('save-time-log', data) 
});