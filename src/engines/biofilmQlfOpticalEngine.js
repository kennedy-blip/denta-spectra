export const qlfPresets = [
  { name: 'Healthy enamel', ratio: 0.72, deltaF: -1.8, score: 0.4, note: 'Low visible signal in this simulated sample' },
  { name: 'Cervical plaque pattern', ratio: 1.42, deltaF: -4.2, score: 3.6, note: 'Red-channel prominence is elevated in this example' },
  { name: 'White-spot example', ratio: 0.66, deltaF: -14.5, score: 2.1, note: 'Reduced green-channel intensity in this simulated sample' },
  { name: 'Gumline redness example', ratio: 1.08, deltaF: -5.7, score: 2.8, note: 'Color may be affected by lighting and camera processing' },
];
export function analyzeRgb(r, g, b) {
  const ratio = r / Math.max(1, g);
  const redness = Math.max(0, Math.min(4, (r - g) / 36));
  return { ratio: Number(ratio.toFixed(2)), deltaF: Number((-Math.max(0, 1 - g / Math.max(r, g, b, 1)) * 100).toFixed(1)), score: Math.max(0, Math.min(5, Math.round((ratio - 0.6) * 4))) , redness: Number(redness.toFixed(1)) };
}
export function qlfLabel(sample) { return sample.ratio > 1.2 ? 'Porphyrin-like color signal' : sample.deltaF < -12 ? 'Lower fluorescence-like signal' : 'Low signal in this sample'; }
