import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import { resolveImageUrl, isLocalAsset } from '@/lib/imageResolver';

interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  is_active: boolean | null;
}

interface SortableImageCardProps {
  image: GalleryImage;
  onToggleActive: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
  compact?: boolean;
}

export const SortableImageCard = ({ image, onToggleActive, onDelete, compact = false }: SortableImageCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`border rounded-lg overflow-hidden ${
          image.is_active ? 'border-border' : 'border-destructive/50 opacity-60'
        } ${isDragging ? 'shadow-xl' : ''}`}
      >
        <div className="aspect-video relative">
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 z-10 p-1.5 bg-background/80 rounded cursor-grab active:cursor-grabbing hover:bg-background"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <img
            src={resolveImageUrl(image.image_url)}
            alt={image.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {!image.is_active && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <span className="text-destructive font-medium text-sm">Inactiva</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h4 className="font-medium text-foreground text-sm mb-2 truncate">{image.title}</h4>
          <div className="flex gap-2">
            <button
              onClick={() => onToggleActive(image)}
              className={`flex-1 py-1.5 px-2 rounded text-xs transition-colors ${
                image.is_active
                  ? 'bg-secondary text-foreground hover:bg-secondary/80'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {image.is_active ? 'Desactivar' : 'Activar'}
            </button>
            {!isLocalAsset(image.image_url) && (
              <button
                onClick={() => onDelete(image)}
                className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border rounded-xl overflow-hidden ${
        image.is_active ? 'border-border' : 'border-destructive/50 opacity-60'
      } ${isDragging ? 'shadow-xl' : ''}`}
    >
      <div className="aspect-video relative">
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-10 p-2 bg-background/80 rounded cursor-grab active:cursor-grabbing hover:bg-background"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
        <img
          src={resolveImageUrl(image.image_url)}
          alt={image.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {!image.is_active && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <span className="text-destructive font-medium">Inactiva</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 truncate">{image.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleActive(image)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
              image.is_active
                ? 'bg-secondary text-foreground hover:bg-secondary/80'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {image.is_active ? 'Desactivar' : 'Activar'}
          </button>
          {!isLocalAsset(image.image_url) && (
            <button
              onClick={() => onDelete(image)}
              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
