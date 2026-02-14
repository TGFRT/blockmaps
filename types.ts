export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingMetadata?: GroundingMetadata;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  groundingSupports?: any[]; // Simplified for this app
  webSearchQueries?: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    sourceId: string;
    title: string;
    uri: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
        reviewAuthor: string;
      }[];
    }[];
  };
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'error' | 'denied';
