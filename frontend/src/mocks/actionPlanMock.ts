import type { PlanState } from "./actionPlanEngine";
import { updateAccount } from "./db";
import { requireAccount } from "./studentMock";
import { delay } from "./delay";

// Tiruan penyimpanan Action Plan (docs/API_CONTRACT.md bagian 11). Penyusunan
// latihannya ada di actionPlanEngine.ts dan dipanggil dari actionPlanService.

export async function mockGetPlanState(token: string | null): Promise<PlanState | null> {
  await delay(250);
  const account = requireAccount(token);
  return account.actionPlan ? structuredClone(account.actionPlan) : null;
}

export async function mockSavePlanState(token: string | null, state: PlanState): Promise<void> {
  await delay(150);
  const account = requireAccount(token);
  updateAccount(account.id, (a) => {
    a.actionPlan = structuredClone(state);
  });
}
