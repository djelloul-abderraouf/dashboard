import React from 'react';
import { TrendingUp } from 'lucide-react';
import { clerkTheme, clerkLocalization } from '../../styles/clerkTheme';

/**
 * Composant qui enveloppe les composants d'authentification Clerk
 * Ajoute un logo et un arrière-plan personnalisé
 */
const ClerkWrapper = ({ children }) => {
  return (
    <div className="cl-auth-background">
  <div className="max-w-md w-full mx-auto">  {/* mx-auto pour centrer horizontalement */}
    <div className="cl-auth-logo flex items-center justify-center gap-2 my-4 mr-5"> {/* ajout de flex et centrage */}
      <div className="w-10 h-10 bg-cyan-400 rounded flex items-center justify-center">
        <TrendingUp size={18} className="text-white" />
      </div>
      <span className="cl-auth-logo-text">Datta Able</span>
    </div>

    {children}
  </div>
</div>

  );
};

export default ClerkWrapper;

/**
 * Cette fonction configure le thème Clerk pour une instance SignIn ou SignUp
 * @param {Object} component - Le composant Clerk à configurer
 * @returns Le composant configuré avec le thème personnalisé
 */
export const applyClerkTheme = (component) => {
  return {
    ...component,
    appearance: clerkTheme,
    localization: clerkLocalization,
  };
};