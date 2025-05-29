import { useState, useEffect } from 'react';

interface DragItem {
  id: string;
  type: string;
  index: number;
}

type DropResult = {
  id: string;
  type: string;
  fromIndex: number;
  toIndex: number;
}

type DropHandler = (result: DropResult) => void;

export const useDragAndDrop = (onDrop: DropHandler) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  // Unikalne identyfikatory dla całej operacji drag/drop
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  
  // Potrzebne do czyszczenia eventów
  useEffect(() => {
    return () => {
      window.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, []);
  
  // Obsługa globalnego zakończenia przeciągania
  const handleGlobalDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
    setDragStartId(null);
    document.body.classList.remove('is-dragging');
  };

  // Rozpoczęcie przeciągania
  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    // Ustawiamy dane, które będą dostępne podczas upuszczania
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
    
    // Ustawiamy identyfikator tej operacji drag
    const startId = `drag_${Date.now()}`;
    setDragStartId(startId);
    
    // Dodajemy identyfikator do elementu, aby powiązać start z końcem
    e.dataTransfer.setData('drag-id', startId);
    
    // Ustawiamy stan przeciągania
    setIsDragging(true);
    setDraggedItem(item);
    
    // Dodajemy klasę do body, aby można było stylizować podczas przeciągania
    document.body.classList.add('is-dragging');
    
    // Rejestrujemy handler zakończenia, aby wyczyścić stan
    window.addEventListener('dragend', handleGlobalDragEnd, { once: true });
  };

  // Obsługa dragover - potrzebna do wskazania, że upuszczenie jest dozwolone
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Obsługa upuszczenia
  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    
    // Sprawdzamy, czy to ten sam drag & drop
    const dropDragId = e.dataTransfer.getData('drag-id');
    if (dropDragId !== dragStartId) {
      return; // To nie jest nasza operacja drag & drop
    }
    
    try {
      // Pobieramy dane z dataTransfer
      const itemData = e.dataTransfer.getData('application/json');
      if (!itemData) return;
      
      const item = JSON.parse(itemData) as DragItem;
      
      // Wywołujemy handler upuszczenia
      if (item.index !== toIndex) {
        onDrop({
          id: item.id,
          type: item.type,
          fromIndex: item.index,
          toIndex
        });
      }
    } catch (err) {
      console.error('Error during drop operation:', err);
    } finally {
      // Czyścimy stan
      handleGlobalDragEnd();
    }
  };

  return {
    isDragging,
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
}; 