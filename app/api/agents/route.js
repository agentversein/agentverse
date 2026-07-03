import { agents } from "@/lib/agents";

export async function GET() {
  return Response.json(agents);
}