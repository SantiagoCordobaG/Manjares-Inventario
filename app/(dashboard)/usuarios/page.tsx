import { createClient } from "@/lib/supabase/server";
import { AccessDenied } from "@/components/ui/access-denied";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { getProfile } from "@/lib/data";
import { canManageUsers } from "@/lib/permissions";
export default async function UsuariosPage(){ const profile=await getProfile(); if(!canManageUsers(profile?.rol)){ return <AccessDenied title="Solo administracion" message="La gestion de usuarios solo esta disponible para perfiles administradores." />; } const supabase=createClient(); const { data }=await supabase.from("usuarios").select("*, punto:puntos(nombre)").order("created_at",{ascending:false}); return <div className="space-y-6"><div><h1 className="text-3xl font-semibold tracking-tight">Usuarios</h1><p className="text-muted-foreground">Perfiles y roles conectados con Supabase Auth.</p></div><Card><CardHeader><CardTitle>Equipo</CardTitle></CardHeader><CardContent><Table><THead><TR><TH>Nombre</TH><TH>Rol</TH><TH>Punto</TH></TR></THead><TBody>{data?.map((u:any)=><TR key={u.id}><TD>{u.nombre}</TD><TD>{u.rol}</TD><TD>{u.punto?.nombre??"Todos"}</TD></TR>)}</TBody></Table></CardContent></Card></div> }
