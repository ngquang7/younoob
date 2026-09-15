export function formatNumberUsStyle(num: number | string): string {
  const numberValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numberValue)) return '';  
  return numberValue.toLocaleString('en-US');
}