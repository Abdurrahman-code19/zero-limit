"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function setupAdminUser() {
  const email = "zerolimitunlimited@gmail.com"
  const password = "Zero_Limitv1"

  const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(email)

  if (existingUser?.user) {
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existingUser.user.id,
      { password, email_confirm: true }
    )

    if (updateError) return { error: updateError.message }

    await supabaseAdmin
      .from("profiles")
      .upsert({ id: existingUser.user.id, email, role: "super_admin", first_name: "Admin", last_name: "User" })

    return { success: true, message: "Admin user updated" }
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: "Admin",
      last_name: "User",
      full_name: "Admin User",
    },
  })

  if (error) return { error: error.message }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: data.user.id, email, role: "super_admin", first_name: "Admin", last_name: "User" })

  if (profileError) return { error: profileError.message }

  return { success: true, message: "Admin user created successfully" }
}
