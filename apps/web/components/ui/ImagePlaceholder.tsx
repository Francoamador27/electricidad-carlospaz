interface ImagePlaceholderProps {
  label: string;
  filename: string;
  aspectRatio?: "video" | "square" | "portrait" | "wide";
  className?: string;
}

const ratios: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

export default function ImagePlaceholder({
  label,
  filename,
  aspectRatio = "video",
  className = "",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`${ratios[aspectRatio]} ${className} bg-slate-200 border-2 border-dashed border-slate-400 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 p-4`}
    >
      <span className="text-4xl">📷</span>
      <span className="font-semibold text-sm text-center">{label}</span>
      <span className="text-xs text-slate-400 text-center font-mono">
        /public/images/{filename}
      </span>
    </div>
  );
}
