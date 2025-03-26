// src/components/ui/toaster.tsx
import React from 'react';

interface ToasterProps {
  // Add any props you need
}

export function Toaster(props: ToasterProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Add your toast notification content here */}
    </div>
  );
}