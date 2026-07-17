import { z } from "zod";
import { applicationSchema } from "../schemas/application";

export type Application = z.infer<typeof applicationSchema>;
