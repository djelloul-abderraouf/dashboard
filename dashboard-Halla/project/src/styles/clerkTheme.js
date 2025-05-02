// Thème personnalisé pour les composants d'authentification Clerk
export const clerkTheme = {
    baseTheme: 'dark',
    variables: {
      colorPrimary: '#00E0FF',
      colorText: '#ffffff',
      colorTextSecondary: '#94a3b8',
      colorBackground: '#2A3042',
      colorInputBackground: '#1e293b',
      colorInputText: '#ffffff',
      colorDanger: '#ef4444',
      colorSuccess: '#22c55e',
      borderRadius: '0.5rem',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    elements: {
      card: {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#374151',
        margin: '2rem auto',
      },
      formButtonPrimary: {
        backgroundColor: '#00E0FF',
        color: '#1e293b',
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        fontWeight: '600',
        padding: '0.75rem 1.5rem',
        '&:hover': {
          backgroundColor: '#0cc0d9',
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease-in-out',
        },
      },
      formFieldLabel: {
        color: '#ffffff',
        fontSize: '0.875rem',
        fontWeight: '500',
      },
      formFieldInput: {
        borderColor: '#4b5563',
        borderRadius: '0.375rem',
        padding: '0.75rem 1rem',
        backgroundColor: '#1e293b',
        transition: 'all 0.2s ease',
        '&:focus': {
          borderColor: '#00E0FF',
          boxShadow: '0 0 0 2px rgba(0, 224, 255, 0.25)',
        },
      },
      footerActionLink: {
        color: '#00E0FF',
        fontWeight: '500',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      identityPreviewEditButton: {
        color: '#00E0FF',
      },
      socialButtonsIconButton: {
        backgroundColor: '#1e293b',
        '&:hover': {
          backgroundColor: '#374151',
        },
      },
      alert: {
        borderRadius: '0.375rem',
      },
      dividerLine: {
        backgroundColor: '#4b5563',
      },
      dividerText: {
        color: '#94a3b8',
      }
    },
    layout: {
      socialButtonsPlacement: 'bottom',
      socialButtonsVariant: 'iconButton',
    }
  };
  
  // Textes personnalisés en français
  export const clerkLocalization = {
    signIn: {
      start: {
        title: "Connexion",
        subtitle: "Accédez à votre compte Datta Able",
        actionText: "Vous n'avez pas de compte ?",
        actionLink: "Créer un compte",
      },
      emailCode: {
        title: "Vérifiez votre e-mail",
        subtitle: "Un code a été envoyé à votre adresse e-mail",
        formTitle: "Code de vérification",
        formSubtitle: "Entrez le code envoyé à votre e-mail",
        resendButton: "Renvoyer le code",
      },
      password: {
        title: "Bienvenue",
        subtitle: "Connectez-vous avec votre mot de passe",
        actionText: "Mot de passe oublié ?",
        actionLink: "Réinitialiser",
        formTitle: "Mot de passe",
        formSubtitle: "Entrez votre mot de passe",
      },
      emailLink: {
        title: "Vérifiez votre e-mail",
        subtitle: "Un lien a été envoyé à votre adresse e-mail",
        formTitle: "Lien de connexion",
        formSubtitle: "Vérifiez votre boîte mail pour le lien de connexion",
        resendButton: "Renvoyer le lien",
        unusedTab: {
          title: "Fermez cet onglet",
          subtitle: "Vous vous êtes connecté(e) dans un autre onglet",
          message: "Vous pouvez fermer cette fenêtre en toute sécurité.",
        },
      },
      phoneCode: {
        title: "Vérifiez votre téléphone",
        subtitle: "Un code a été envoyé à votre téléphone",
        formTitle: "Code de vérification",
        formSubtitle: "Entrez le code envoyé à votre téléphone",
        resendButton: "Renvoyer le code",
      },
      forgotPassword: {
        title: "Réinitialiser votre mot de passe",
        subtitle: "Un lien sera envoyé à votre adresse e-mail",
        formTitle: "E-mail de réinitialisation",
        formSubtitle: "Entrez votre adresse e-mail pour recevoir le lien de réinitialisation",
        submitButton: "Envoyer le lien de réinitialisation",
      },
      forgotPasswordSubmitted: {
        title: "Vérifiez votre e-mail",
        subtitle: "Un lien de réinitialisation a été envoyé",
        message: "Si un compte existe avec cette adresse e-mail, vous recevrez un lien pour créer un nouveau mot de passe.",
      },
      resetPassword: {
        title: "Créer un nouveau mot de passe",
        subtitle: "pour votre compte",
        formTitle: "Nouveau mot de passe",
        formSubtitle: "Entrez un nouveau mot de passe pour votre compte",
        submitButton: "Enregistrer le mot de passe",
      },
    },
    signUp: {
      start: {
        title: "Créer un compte",
        subtitle: "Rejoignez Datta Able",
        actionText: "Vous avez déjà un compte ?",
        actionLink: "Se connecter",
      },
      emailCode: {
        title: "Vérifiez votre e-mail",
        subtitle: "Un code a été envoyé à votre adresse e-mail",
        formTitle: "Code de vérification",
        formSubtitle: "Entrez le code envoyé à votre e-mail",
        resendButton: "Renvoyer le code",
      },
      emailLink: {
        title: "Vérifiez votre e-mail",
        subtitle: "Un lien a été envoyé à votre adresse e-mail",
        formTitle: "Lien d'inscription",
        formSubtitle: "Vérifiez votre boîte mail pour le lien d'inscription",
        resendButton: "Renvoyer le lien",
      },
      password: {
        title: "Créez votre mot de passe",
        subtitle: "pour sécuriser votre compte",
        formTitle: "Mot de passe",
        formSubtitle: "Créez un mot de passe sécurisé",
      },
      continue: {
        title: "Complétez vos informations",
        subtitle: "pour finaliser votre compte",
      },
    },
    userProfile: {
      formButtonPrimary: "Enregistrer",
      formButtonReset: "Annuler",
      start: {
        title: "Profil utilisateur",
        subtitle: "Gérez vos informations personnelles",
      },
    },
    userButton: {
      action__signOut: "Déconnexion",
      action__manageAccount: "Gérer le compte",
      action__signOutAll: "Déconnexion de tous les comptes",
    },
    footerActionLink: {
      signIn: "Se connecter",
      signUp: "S'inscrire",
    },
    socialButtonsBlockButton: {
      "continueWith": "Continuer avec {{provider}}",
      "signInWith": "Se connecter avec {{provider}}",
      "signUpWith": "S'inscrire avec {{provider}}",
    },
    formFieldLabel: {
      email: "E-mail",
      password: "Mot de passe",
      username: "Nom d'utilisateur",
      phoneNumber: "Numéro de téléphone",
      firstName: "Prénom",
      lastName: "Nom",
    },
    formButtonPrimary: {
      signIn: "Se connecter",
      signUp: "S'inscrire",
      continue: "Continuer",
    },
  };