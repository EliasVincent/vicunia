export interface ServerSettings {
  folderPath: string;
  llamaSettings: {
    t: number;
    numOfTokens: number;
    repetitionPenalty: number;
    isReverse: boolean;
    reverseMessage: string;
    temp: number;
    topP: number;
    topK: number;
    repeatLastN: number;
  };
}
