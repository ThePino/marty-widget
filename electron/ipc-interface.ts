export interface IElectronAPI {
  setIgnoreMouse: (ignore: boolean) => void;
  saveTimeLog: (data: { id: string; duration: number; label: string }) => Promise<void>;
}