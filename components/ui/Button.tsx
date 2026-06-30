import Link from "next/link";

type Variant = "primary" | "secondary" | "outline";

interface ButtonProps {
  href?: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

const variants: Record<Variant, string> = {
  primary: "bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold",
  secondary: "bg-slate-900 hover:bg-slate-800 text-white font-bold",
  outline: "border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-900 font-bold",
};

const base = "inline-flex items-center justify-center px-6 py-3 rounded-lg transition-colors text-sm gap-2";

export default function Button({
  href,
  variant = "primary",
  children,
  className = "",
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
