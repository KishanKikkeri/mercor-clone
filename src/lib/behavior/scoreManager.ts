import { BehaviorState, Interaction } from "./types";
import { DEFAULT_SCORING_WEIGHTS, matchCategory, CATEGORY_TO_STATE_KEY } from "./scoreRules";

/**
 * Pure state reducer to calculate the next BehaviorState based on an interaction.
 */
export function updateScore(
  state: BehaviorState,
  interaction: Interaction
): BehaviorState {
  const newState = { ...state };
  
  // Update base profile metadata
  newState.totalInteractions += 1;
  newState.lastInteraction = interaction.type;
  newState.lastUpdated = new Date().toISOString();

  const weight = DEFAULT_SCORING_WEIGHTS[interaction.type] as number | undefined;
  if (!weight) {
    return newState;
  }

  let categoryStr: string | null = null;

  // Resolve target mapping text depending on interaction type
  if (interaction.type === "job_search") {
    const keyword = interaction.payload?.searchKeyword;
    if (keyword) {
      categoryStr = matchCategory(keyword);
    }
  } else if (interaction.type === "category_selected") {
    const cat = interaction.payload?.category;
    if (cat) {
      categoryStr = matchCategory(cat);
    }
  } else if (interaction.type === "job_viewed" || interaction.type === "apply_clicked") {
    const job = interaction.payload;
    if (job) {
      // Map based on combining category name, job title, and skills to catch matches
      const searchTarget = [
        job.category || "",
        job.title || "",
        Array.isArray(job.skills) ? job.skills.join(" ") : "",
      ].join(" ");
      categoryStr = matchCategory(searchTarget);
    }
  }

  // Update score if category resolved successfully to a supported key
  if (categoryStr) {
    const stateKey = CATEGORY_TO_STATE_KEY[categoryStr];
    if (stateKey && stateKey in newState) {
      (newState as any)[stateKey] += weight;
    }
  }

  return newState;
}
