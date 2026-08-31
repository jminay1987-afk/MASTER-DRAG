import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";
export async function db(){const c=await cookies();return createServerClient((process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://kujcnigznlhsqcrigaru.supabase.co"),(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_bpwtZZplxAZvJaHGG06RLQ_-YJclLB5"),{cookies:{getAll:()=>c.getAll(),setAll(v){try{v.forEach(({name,value,options})=>c.set(name,value,options))}catch{}}}})}
