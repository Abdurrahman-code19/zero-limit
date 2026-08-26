import Link from "next/link"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Size Guide | Zero Limit",
  description: "Find your perfect fit with the Zero Limit size guide. Measurements for chest, waist, and hip across all sizes.",
}

const defaultSizes = [
  { label: "XS", chest: '32-34"', waist: '26-28"', hip: '34-36"' },
  { label: "S", chest: '34-36"', waist: '28-30"', hip: '36-38"' },
  { label: "M", chest: '36-38"', waist: '30-32"', hip: '38-40"' },
  { label: "L", chest: '38-40"', waist: '32-34"', hip: '40-42"' },
  { label: "XL", chest: '40-42"', waist: '34-36"', hip: '42-44"' },
  { label: "XXL", chest: '42-44"', waist: '36-38"', hip: '44-46"' },
]

export default async function SizeGuidePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("cms_content")
    .select("sections")
    .eq("page_slug", "size-guide")
    .single()

  const cmsSections = data?.sections as { title?: string; content?: string }[] | null

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Size Guide</span>
      </div>

      <h1 className="text-3xl font-light mb-4">Size Guide</h1>

      {cmsSections ? (
        <div className="space-y-6 text-sm text-muted-foreground">
          {cmsSections.map((section, i) => (
            <div key={i}>
              {section.title && <h2 className="text-lg font-medium text-foreground mb-2">{section.title}</h2>}
              <div className="leading-relaxed">{section.content}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-8">
            All measurements are in inches. For the best fit, measure yourself and compare with the chart below.
          </p>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 font-medium">Size</th>
                  <th className="text-left p-4 font-medium">Chest</th>
                  <th className="text-left p-4 font-medium">Waist</th>
                  <th className="text-left p-4 font-medium">Hip</th>
                </tr>
              </thead>
              <tbody>
                {defaultSizes.map((s) => (
                  <tr key={s.label} className="border-t">
                    <td className="p-4 font-medium">{s.label}</td>
                    <td className="p-4 text-muted-foreground">{s.chest}</td>
                    <td className="p-4 text-muted-foreground">{s.waist}</td>
                    <td className="p-4 text-muted-foreground">{s.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 space-y-4 text-sm text-muted-foreground">
            <h2 className="text-lg font-medium text-foreground">How to Measure</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Chest:</strong> Measure around the fullest part of your chest.</li>
              <li><strong>Waist:</strong> Measure around your natural waistline.</li>
              <li><strong>Hip:</strong> Measure around the fullest part of your hips.</li>
            </ul>
            <p className="mt-4">If you&apos;re between sizes, we recommend sizing up for a more relaxed fit.</p>
          </div>
        </>
      )}
    </div>
  )
}
