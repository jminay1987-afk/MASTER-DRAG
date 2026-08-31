import {redirect} from "next/navigation";
import {db} from "@/lib/supabase";
export type Role="ADMIN_PRINCIPAL"|"GRILLA"|"CRONOMETRAJE"|"JUEZ";
export async function operator(){const s=await db();const {data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined;if(!uid)redirect("/login");const {data:u}=await s.from("usuarios").select("usuario_id,nombre,email_login,rol_global,activo,auth_user_id").eq("auth_user_id",uid).eq("activo",true).maybeSingle();if(!u)redirect("/login?error=sin_permiso");return {s,u:u as {usuario_id:string,nombre:string,email_login:string,rol_global:Role,activo:boolean,auth_user_id:string}}}
export const allowed=(global:Role,role:Exclude<Role,"ADMIN_PRINCIPAL">)=>global==="ADMIN_PRINCIPAL"||global===role;
