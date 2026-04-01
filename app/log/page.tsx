import { requireCurrentUserProfile } from "@/lib/profile";
import { logDrink } from "./actions";
import { LogForm } from "./log-form";

export default async function LogPage() {
  await requireCurrentUserProfile();

  return <LogForm action={logDrink} />;
}
