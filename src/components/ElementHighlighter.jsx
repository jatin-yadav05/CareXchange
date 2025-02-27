"use client";

import { useEffect, useState } from 'react';

export default function ElementHighlighter() {
  const [selectedElement, setSelectedElement] = useState(null);

  useEffect(() => {
    // Create and append the highlighter elements
    const highlighter = document.createElement('div');
    highlighter.id = 'element-highlighter';
    highlighter.className = 'pointer-events-none fixed z-[9999] transition-all duration-300 ease-in-out';
    
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-primary/10 backdrop-blur-[2px] border-2 border-primary rounded-lg shadow-lg';
    
    const badge = document.createElement('div');
    badge.className = 'absolute -top-9 left-0 bg-primary text-white px-3 py-1.5 rounded-t-lg font-medium text-sm flex items-center gap-2 shadow-lg';
    
    const dimensions = document.createElement('div');
    dimensions.className = 'absolute -bottom-9 right-0 bg-primary text-white px-3 py-1.5 rounded-b-lg font-medium text-sm flex items-center gap-2 shadow-lg';
    
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'absolute inset-0 border-2 border-primary rounded-lg animate-ping opacity-50';
    
    highlighter.appendChild(overlay);
    highlighter.appendChild(badge);
    highlighter.appendChild(dimensions);
    highlighter.appendChild(ripple);
    document.body.appendChild(highlighter);

    // Function to update highlighter position and info
    const updateHighlighter = (element) => {
      if (!element) {
        highlighter.style.display = 'none';
        return;
      }

      const rect = element.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Update highlighter position
      highlighter.style.display = 'block';
      highlighter.style.width = `${rect.width}px`;
      highlighter.style.height = `${rect.height}px`;
      highlighter.style.transform = `translate(${rect.left + scrollLeft}px, ${rect.top + scrollTop}px)`;

      // Update badge with element info
      const tagName = element.tagName.toLowerCase();
      const classes = Array.from(element.classList).join('.');
      const id = element.id ? `#${element.id}` : '';
      badge.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        ${tagName}${id}${classes ? `.${classes}` : ''}
      `;

      // Update dimensions
      dimensions.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
    };

    // Listen for element selection events
    const handleElementSelect = (event) => {
      if (event.detail?.element) {
        setSelectedElement(event.detail.element);
        updateHighlighter(event.detail.element);
      }
    };

    window.addEventListener('elementSelected', handleElementSelect);

    // Cleanup
    return () => {
      window.removeEventListener('elementSelected', handleElementSelect);
      document.body.removeChild(highlighter);
    };
  }, []);

  return null; // This component doesn't render anything directly
} 