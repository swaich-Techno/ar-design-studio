import {handleGeneration} from "@/lib/photo3d/generation-handler.mjs";
export const dynamic="force-dynamic";
export const maxDuration=300;
export async function POST(request){return handleGeneration(request);}
