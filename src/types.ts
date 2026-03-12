export type IncidentType = 'Assédio' | 'Discriminação' | 'Fraude' | 'Conduta inadequada' | 'Outro' | '';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'committee';
  text: string;
  timestamp: string;
}

export interface Report {
  id: string;
  destinationType: 'registered' | 'direct_email';
  complianceEmail?: string;
  company: string;
  anonymity: 'anonymous' | 'identified';
  incidentType: IncidentType;
  date: string;
  location: string;
  peopleInvolved: string;
  witnesses: string;
  description: string;
  status: 'Recebida' | 'Em análise' | 'Em investigação';
  createdAt: string;
  messages: ChatMessage[];
}
