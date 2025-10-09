export interface LoaderProps {
  size?: number;
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export function LoaderComponent({
  size = 40,
  color = "border-[rgb(0,8,26)]",
  text,
  fullScreen = false
}: LoaderProps) {
  const loaderElement = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
        style={{ width: size, height: size }}
      />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
        {loaderElement}
      </div>
    );
  }

  return loaderElement;
}