'use client';

/**
 * =====================================================
 * Componente de Indicador de Fortaleza de Contraseña
 * =====================================================
 * Este componente analiza y muestra visualmente qué tan
 * segura es una contraseña en tiempo real mientras el
 * usuario la escribe.
 */

import { useMemo } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

/**
 * Información sobre un nivel de fortaleza.
 */
interface StrengthInfo {
  /** Puntuación de 0 a 4 */
  score: number;
  /** Etiqueta textual del nivel */
  label: string;
  /** Color del texto */
  color: string;
  /** Color de fondo de la barra */
  bgColor: string;
  /** Sugerencias para mejorar */
  suggestions: string[];
}

/**
 * Niveles predefinidos de fortaleza de contraseña.
 * Cada nivel tiene estilos y mensajes específicos.
 */
const strengthLevels: StrengthInfo[] = [
  {
    score: 0,
    label: 'Very Weak',
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    suggestions: ['Use at least 8 characters', 'Add numbers and symbols'],
  },
  {
    score: 1,
    label: 'Weak',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    suggestions: ['Add mixed case letters', 'Include numbers'],
  },
  {
    score: 2,
    label: 'Fair',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    suggestions: ['Add special characters (!@#$%)', 'Make it longer'],
  },
  {
    score: 3,
    label: 'Strong',
    color: 'text-lime-500',
    bgColor: 'bg-lime-500',
    suggestions: ['Great password!', 'Consider adding more length'],
  },
  {
    score: 4,
    label: 'Very Strong',
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    suggestions: ['Excellent password!'],
  },
];

/**
 * Calcula la fortaleza de una contraseña basándose en múltiples criterios.
 * 
 * Criterios evaluados:
 * - Longitud mínima de 8 caracteres (+1 punto)
 * - Longitud de 12+ caracteres (+1 punto)
 * - Mezcla de mayúsculas y minúsculas (+1 punto)
 * - Presencia de números (+1 punto)
 * - Presencia de caracteres especiales (+1 punto)
 * - Penalties por contraseñas comunes (-2 puntos)
 * - Penalty por solo letras (-1 punto)
 * 
 * @param password - Contraseña a evaluar
 * @returns Información de fortaleza calculada
 */
function calculateStrength(password: string): StrengthInfo {
  if (!password) return strengthLevels[0];

  let score = 0;
  const suggestions: string[] = [];

  // Longitud mínima
  if (password.length >= 8) score++;
  else suggestions.push('Use at least 8 characters');

  // Longitud adicional
  if (password.length >= 12) score++;

  // Mayúsculas y minúsculas
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else suggestions.push('Add mixed case letters');

  // Números
  if (/\d/.test(password)) score++;
  else suggestions.push('Include numbers');

  // Caracteres especiales
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else suggestions.push('Add special characters (!@#$%)');

  // Lista de contraseñas comunes (poco seguras)
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'];
  if (commonPasswords.some(p => password.toLowerCase().includes(p))) {
    score = Math.max(0, score - 2);
    suggestions.push('Avoid common passwords');
  }

  // Solo letras
  if (/^[a-zA-Z]+$/.test(password)) {
    score = Math.max(0, score - 1);
    suggestions.push('Add numbers or symbols');
  }

  const finalScore = Math.min(4, Math.max(0, score));

  return {
    ...strengthLevels[finalScore],
    suggestions: suggestions.slice(0, 3),
  };
}

/**
 * Componente que muestra visualmente la fortaleza de una contraseña.
 * Se actualiza en tiempo real mientras el usuario escribe.
 *
 * @param password - Contraseña a evaluar
 */
export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => calculateStrength(password), [password]);

  // No muestra nada si no hay contraseña
  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      {/* Barra de fortaleza visual. */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Password strength:</span>
        <span className={`text-xs font-medium ${strength.color}`}>{strength.label}</span>
      </div>
      
      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.bgColor}`}
          style={{ width: `${((strength.score + 1) / 5) * 100}%` }}
        />
      </div>

      {/* Lista de sugerencias para mejorar la contraseña. */}
      {strength.suggestions.length > 0 && (
        <ul className="space-y-1">
          {strength.suggestions.map((suggestion, index) => (
            <li key={index} className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="text-yellow-500">•</span>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Exportaciones para uso en testing y otros componentes.
 */
export { calculateStrength, strengthLevels };
