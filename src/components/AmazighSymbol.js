'use client';

import React from 'react';

/**
 * Composant SVG représentant le symbole Yaz (ⵣ) de l'alphabet Tifinagh.
 * @param {string} className - Classes CSS optionnelles
 * @param {string} color - Couleur du trait (défaut:currentColor)
 * @param {number} size - Taille en pixels (défaut:48)
 * @param {boolean} animate - Si true, joue l'animation de dessin
 * @param {number} strokeWidth - Épaisseur du trait
 */
export default function AmazighSymbol({ 
  className = '', 
  color = 'currentColor', 
  size = 48, 
  animate = true,
  strokeWidth = 2
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`amazigh-symbol ${animate ? 'animate-draw' : ''} ${className}`}
    >
      {/* 
        Le symbole Yaz (ⵣ) ressemble à un 'I' central avec deux demi-arcs ouverts vers l'extérieur.
        Structure:
        - Barre verticale centrale
        - Arc à gauche (ouvert vers la droite)
        - Arc à droite (ouvert vers la gauche)
      */}
      
      {/* Barre centrale verticale */}
      <path 
        d="M50 20 L50 80" 
        className="path-vertical"
      />
      
      {/* Arc gauche (ⵣ - partie gauche) */}
      <path 
        d="M20 30 C30 30, 45 40, 45 50 C45 60, 30 70, 20 70" 
        className="path-left-arc"
      />
      
      {/* Arc droit (ⵣ - partie droite) */}
      <path 
        d="M80 30 C70 30, 55 40, 55 50 C55 60, 70 70, 80 70" 
        className="path-right-arc"
      />

      <style jsx>{`
        .amazigh-symbol.animate-draw path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawStroke 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .path-vertical { animation-delay: 0s; }
        .path-left-arc { animation-delay: 0.5s; }
        .path-right-arc { animation-delay: 1s; }

        @keyframes drawStroke {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </svg>
  );
}
