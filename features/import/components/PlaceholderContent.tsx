/**
 * A simple placeholder component for sections that are under construction.
 */
export function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="text-center p-12 bg-surface rounded-lg">
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="text-textSecondary">Contenido en construcción.</p>
    </div>
  );
}
