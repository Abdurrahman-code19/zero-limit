import { createClient } from "@/lib/supabase/server"

export async function logActivity(params: {
  action: string
  entity_type: string
  entity_id?: string
  details?: Record<string, unknown>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return
  
  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: params.action,
    entity_type: params.entity_type,
    entity_id: params.entity_id,
    details: params.details ?? {},
  })
}
