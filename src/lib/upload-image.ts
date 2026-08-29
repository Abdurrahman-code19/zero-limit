import { createClient } from "@/lib/supabase/client"

const BUCKET = "product-images"

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient()
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpeg"
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { upsert: true, contentType: file.type || "image/jpeg" })

  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}
