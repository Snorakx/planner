import React, { createContext, useContext, useState, ReactNode } from "react";

// Typy dla kontekstu
interface DragAndDropContextType {
  draggedItemId: string | null;
  draggedOverItemId: string | null;
  setDraggedItemId: (id: string | null) => void;
  setDraggedOverItemId: (id: string | null) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

// Utworzenie kontekstu z wartościami domyślnymi
const DragAndDropContext = createContext<DragAndDropContextType>({
  draggedItemId: null,
  draggedOverItemId: null,
  setDraggedItemId: () => {},
  setDraggedOverItemId: () => {},
  isDragging: false,
  setIsDragging: () => {},
});

// Props dla providera
interface DragAndDropProviderProps {
  children: ReactNode;
}

// Provider kontekstu
export const DragAndDropProvider: React.FC<DragAndDropProviderProps> = ({ children }) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggedOverItemId, setDraggedOverItemId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DragAndDropContext.Provider
      value={{
        draggedItemId,
        draggedOverItemId,
        setDraggedItemId,
        setDraggedOverItemId,
        isDragging,
        setIsDragging,
      }}
    >
      {children}
    </DragAndDropContext.Provider>
  );
};

// Hook do łatwego dostępu do kontekstu
export const useDragAndDropContext = () => useContext(DragAndDropContext); 