import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

type FormAlertVariant = "error" | "info" | "success";

type FormAlertProps = {
  variant?: FormAlertVariant;
  title?: string;
  message: string;
};

const STYLES: Record<FormAlertVariant, { wrap: string; icon: string; title: string; text: string }> = {
  error: {
    wrap: "border-red-200 bg-red-50",
    icon: "text-red-500",
    title: "text-red-800",
    text: "text-red-700",
  },
  info: {
    wrap: "border-blue-200 bg-blue-50",
    icon: "text-blue-500",
    title: "text-blue-900",
    text: "text-blue-800",
  },
  success: {
    wrap: "border-green-200 bg-green-50",
    icon: "text-green-500",
    title: "text-green-900",
    text: "text-green-800",
  },
};

export default function FormAlert({
  variant = "error",
  title,
  message,
}: FormAlertProps) {
  const style = STYLES[variant];
  const Icon =
    variant === "success"
      ? CheckCircleIcon
      : variant === "info"
        ? InformationCircleIcon
        : ExclamationCircleIcon;

  return (
    <div
      data-variant={variant}
      className={`mb-4 rounded-lg border px-4 py-3 text-sm flex gap-3 ${style.wrap}`}
      role="status"
    >
      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${style.icon}`} />
      <div>
        {title && <p className={`font-semibold mb-0.5 ${style.title}`}>{title}</p>}
        <p className={style.text}>{message}</p>
      </div>
    </div>
  );
}