export interface LLMModelProvider {
  id: string;
  providerName: string;
  providerLogo?: string;
  status?: boolean;
  type?: 'default' | 'custom';
}
