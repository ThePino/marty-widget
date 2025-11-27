import type { IElectronAPI } from '@my-electron/ipc-interface';

export {};

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}