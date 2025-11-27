export {};

declare global {
  interface Window {
    electronAPI: {
      setIgnoreMouse: (ignore: boolean) => void;
      saveTimeLog: (data: any) => Promise<void>;
    };
  }
}