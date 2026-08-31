"use server";
import {redirect} from "next/navigation";
import {db} from "@/lib/supabase";
export async function login(f:FormData){const s=await db();const {error}=await s.auth.signInWithPassword({email:String(f.get("email")||"").trim(),password:String(f.get("password")||"")});if(error)redirect("/login?error=credenciales");const {data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined;const {data:u}=await s.from("usuarios").select("usuario_id").eq("auth_user_id",uid||"").eq("activo",true).maybeSingle();if(!u){await s.auth.signOut();redirect("/login?error=sin_permiso")}redirect("/admin")}
export async function logout(){const s=await db();await s.auth.signOut();redirect("/login")}
