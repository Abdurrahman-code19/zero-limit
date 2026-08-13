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

  const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })

  if (listError) return { error: listError.message }

  const existingUser = listData.users.find((user) => user.email === email)

  if (existingUser) {
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existingUser.id,
      { password, email_confirm: true }
    )

    if (updateError) return { error: updateError.message }

    await supabaseAdmin
      .from("profiles")
      .upsert({ id: existingUser.id, email, role: "super_admin", full_name: "Admin User" })

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
    .upsert({ id: data.user.id, email, role: "super_admin", full_name: "Admin User" })

  if (profileError) return { error: profileError.message }

  return { success: true, message: "Admin user created successfully" }
}
