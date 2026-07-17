import { PersonalizeEventKey } from "../personalize/constants";

export type InteractionType = PersonalizeEventKey;

export interface Interaction {
  type: InteractionType;
  payload?: any;
}

export interface BehaviorState {
  aiEngineer: number;
  frontendDeveloper: number;
  backendDeveloper: number;
  fullStackDeveloper: number;
  totalInteractions: number;
  lastInteraction?: InteractionType;
  lastUpdated?: string;
}
