export function numberToThaiText(input: string | number): string {
  const numberText: string[] = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const positionText: string[] = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];

  // ทำความสะอาด input: ลบ comma และแปลงเป็น string
  const cleaned: string = input.toString().replace(/,/g, '');
  const [intPartRaw, decimalPartRaw] = cleaned.split('.');
  const intPart: number = parseInt(intPartRaw, 10);
  const decimalPart: string | null = decimalPartRaw ? decimalPartRaw.padEnd(2, '0').substring(0, 2) : null;

  if (isNaN(intPart)) return '';

  // Helper: แปลงเลขกลุ่มย่อย (ไม่เกิน 6 หลัก)
  function convertGroup(numStr: string): string {
    let result = '';
    const digits: number[] = numStr.padStart(6, '0').split('').map(Number);

    for (let i = 0; i < digits.length; i++) {
      const digit = digits[i];
      const pos = 5 - i;

      if (digit === 0) continue;

      if (pos === 1) {
        if (digit === 1) result += 'สิบ';
        else if (digit === 2) result += 'ยี่สิบ';
        else result += numberText[digit] + 'สิบ';
      } else if (pos === 0) {
        if (digit === 1 && result !== '') result += 'เอ็ด';
        else result += numberText[digit];
      } else {
        result += numberText[digit] + positionText[pos];
      }
    }

    return result;
  }

  // แปลงเลขจำนวนเต็ม โดยแบ่งกลุ่มละ 6 หลัก รองรับล้านซ้อน
  function convertIntegerToText(num: number): string {
    const numStr: string = num.toString();
    const groups: string[] = [];

    for (let i = numStr.length; i > 0; i -= 6) {
      const start = Math.max(i - 6, 0);
      groups.unshift(numStr.substring(start, i));
    }

    let result = '';
    groups.forEach((group, idx) => {
      const groupText = convertGroup(group);
      if (groupText !== '') {
        const isLastGroup = idx === groups.length - 1;
        result += groupText;
        if (!isLastGroup) result += 'ล้าน';
      }
    });

    return result || numberText[0];
  }

  // แปลงทศนิยมเป็นสตางค์
  function convertDecimalToText(decimalStr: string): string {
    const val = parseInt(decimalStr, 10);
    if (isNaN(val) || val === 0) return 'ถ้วน';
    return convertGroup(decimalStr.padStart(2, '0')) + 'สตางค์';
  }

  // รวมผลลัพธ์
  const bahtText: string = convertIntegerToText(intPart) + 'บาท';
  const satangText: string = decimalPart ? convertDecimalToText(decimalPart) : 'ถ้วน';

  return bahtText + satangText;
}
