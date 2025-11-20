export {};

declare global {
  interface Window {
    electronAPI: {
      moveCorner: (corner: string) => void;
      setIgnoreMouse: (ignore: boolean) => void;
      saveTimeLog: (data: any) => Promise<void>;
    };
  }
}