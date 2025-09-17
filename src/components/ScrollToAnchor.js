// src/components/ScrollToAnchor.js
import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

export default function ScrollToAnchor() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return null;
}
