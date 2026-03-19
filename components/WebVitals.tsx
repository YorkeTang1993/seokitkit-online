'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToGA(metric: { name: string; value: number; id: string }) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
}

export default function WebVitals() {
  useEffect(() => {
    onCLS(sendToGA);
    onINP(sendToGA);
    onLCP(sendToGA);
    onFCP(sendToGA);
    onTTFB(sendToGA);
  }, []);

  return null;
}
