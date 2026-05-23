"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export function SalesChart({ data }: { data: { dia: string; ventas: number }[] }) {
  return <div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="dia" /><YAxis allowDecimals={false} /><Tooltip /><Area type="monotone" dataKey="ventas" stroke="currentColor" fill="currentColor" fillOpacity={0.12} /></AreaChart></ResponsiveContainer></div>;
}
