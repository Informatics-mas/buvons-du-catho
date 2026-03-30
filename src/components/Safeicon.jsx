import React from 'react';
import * as Icons from 'lucide-react';

const SafeIcon = ({ name, ...props }) => {
  const IconComponent = Icons[name];
  if (!IconComponent) {
    console.warn(`L'icône "${name}" n'existe pas.`);
    return <Icons.HelpCircle {...props} />; // Affiche un "?" si l'icône est introuvable
  }
  return <IconComponent {...props} />;
};

export default SafeIcon;