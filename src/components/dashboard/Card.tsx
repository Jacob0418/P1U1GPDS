import type { ReactNode } from 'react';

// Define los tipos para las props del componente
type CardProps = {
  title?: string; // title también puede ser opcional si algunas tarjetas no lo tienen
  icon?: ReactNode;
  children: ReactNode;
  className?: string; // <--- LA SOLUCIÓN: Hacer className opcional con '?'
};

const Card = ({ title, icon, children, className }: CardProps) => {
  return (
    // Usa un valor por defecto ('') si className no se proporciona
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className || ''}`}>
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;