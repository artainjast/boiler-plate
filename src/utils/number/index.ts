export function toCurrency(value?: number | string, isToman = false, isInput = false) {
  if (value === undefined) {
    return '';
  }

  let price = Number(toEn(value?.toString()?.replace?.(/,/g, '')));

  if (isNaN(price)) {
    return isInput ? '' : '۰';
  }

  if (!isToman) {
    price = Math.floor(price / 10);
  }
  let priceText = String(price).replace(/\$|,/g, '');
  for (let i = 0; i < Math.floor((priceText.length - (1 + i)) / 3); i++) {
    priceText =
      priceText.substring(0, priceText.length - (4 * i + 3)) +
      ',' +
      priceText.substring(priceText.length - (4 * i + 3));
  }

  return priceText;
}

export function toEn(input?: string | number | null): string {
  if (!(isNumber(input) || isString(input))) return '';
  return (input + '').replace(/[۰-۹]/g, (d) => '' + '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
}

export function isNumber(value: unknown): value is number {
  if (typeof value === 'number') return true;
  //TODO: making number of an empty string should not give us a Zero(0) number!
  else if (typeof value === 'string') return !isNaN(Number(value));
  return false;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export const toPercent = (input: string) => {
  return `${Math.round(Number(input) * 100)}%`;
};
