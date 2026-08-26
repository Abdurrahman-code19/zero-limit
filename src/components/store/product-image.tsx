import Image from "next/image"

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
}

export function ProductImage({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
  sizes,
}: ProductImageProps) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
        className={className}
        unoptimized
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 400}
      height={height ?? 500}
      sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
      className={className}
      unoptimized
    />
  )
}
