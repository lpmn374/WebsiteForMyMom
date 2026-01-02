import { useState } from 'react';

// Hàm hỗ trợ chuyển số thành chữ rút gọn giúp mẹ dễ đọc
const formatToWords = (num: number): string => {
  if (!num || num <= 0) return "";
  const roundedNum = Math.round(num);
  
  if (roundedNum >= 1_000_000_000) {
    const ty = Math.floor(roundedNum / 1_000_000_000);
    const trieu = Math.floor((roundedNum % 1_000_000_000) / 1_000_000);
    const nghin = Math.floor((roundedNum % 1_000_000) / 1_000);
    const dong = roundedNum % 1_000;
    return `${ty} Tỷ ${trieu > 0 ? trieu + ' Triệu ' : ''}${nghin > 0 ? nghin + ' Ngàn ' : ''}${dong > 0 ? dong : ''} Đồng`;
  }
  if (roundedNum >= 1_000_000) {
    const trieu = Math.floor(roundedNum / 1_000_000);
    const nghin = Math.floor((roundedNum % 1_000_000) / 1_000);
    const dong = roundedNum % 1_000;
    return `${trieu} Triệu ${nghin > 0 ? nghin + ' Ngàn ' : ''}${dong > 0 ? dong : ''} Đồng`;
  }
  if (roundedNum >= 1_000) {
    const nghin = Math.floor(roundedNum / 1_000);
    const dong = roundedNum % 1_000;
    return `${nghin} Ngàn ${dong > 0 ? dong : ''} Đồng`;
  }
  return `${roundedNum} Đồng`;
};

export function SavingsCalculator() {
  const [principalStr, setPrincipalStr] = useState<string>(''); // Lưu chuỗi có dấu chấm
  const [interestRate, setInterestRate] = useState<string>('');
  const [timeValue, setTimeValue] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<'days' | 'months' | 'years'>('months');
  const [result, setResult] = useState<number | null>(null);

  // Chuyển chuỗi định dạng (1.000.000) về số thực (1000000)
  const numericPrincipal = Number(principalStr.replace(/\./g, ''));

  const handlePrincipalChange = (val: string) => {
    const onlyNums = val.replace(/\D/g, '');
    const formatted = onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setPrincipalStr(formatted);
  };

  const addAmount = (amount: number) => {
    const newTotal = numericPrincipal + amount;
    handlePrincipalChange(newTotal.toString());
  };

  const addInterest = (val: number) => {
    const current = parseFloat(interestRate) || 0;
    setInterestRate((Math.round((current + val) * 100) / 100).toString());
  };

  const addTime = (val: number) => {
    const current = parseFloat(timeValue) || 0;
    setTimeValue((current + val).toString());
  };

  const calculateProfit = () => {
    const p = numericPrincipal;
    // Chuyển đổi mọi dấu phẩy thành dấu chấm trước khi parseFloat
    const safeInterest = interestRate.toString().replace(/,/g, '.');
    const r = parseFloat(interestRate);
    const t = parseFloat(timeValue);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
      alert('Mẹ ơi, mẹ nhập đủ số tiền, lãi suất và thời gian nhé!');
      return;
    }

    let timeInYears = 0;
    if (timeUnit === 'days') timeInYears = t / 365;
    else if (timeUnit === 'months') timeInYears = t / 12;
    else timeInYears = t;

    const interest = (p * r * timeInYears) / 100;
    setResult(interest);
  };

  const reset = () => {
    setPrincipalStr('');
    setInterestRate('');
    setTimeValue('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-center font-bold text-2xl text-primary">Tính Lãi Tiết Kiệm</h2>

      {/* Số Tiền Gốc */}
      <div>
        <label className="block mb-2 font-medium text-lg">Số Tiền Gửi (₫)</label>
        <input
          type="text"
          value={principalStr}
          onChange={(e) => handlePrincipalChange(e.target.value)}
          placeholder="Ví dụ: 100.000.000"
          className="w-full px-4 py-4 rounded-lg bg-input-background border-2 border-border focus:border-primary text-xl font-semibold outline-none"
        />
        
        <p className="mt-2 text-primary font-medium min-h-[1.5rem]">
          {numericPrincipal > 0 && `Mẹ đang nhập: ${formatToWords(numericPrincipal)}`}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {[1_000_000_000, 100_000_000, 10_000_000, 1_000_000, 100_000, 10_000, 1_000, 100].map((amt) => (
            <button
              key={amt}
              onClick={() => addAmount(amt)}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-white transition-colors border border-border font-medium"
            >
              + {
                amt >= 1_000_000_000 ? (amt/1_000_000_000) + ' Tỷ' :
                amt >= 1_000_000 ? (amt/1_000_000) + ' Triệu' : 
                amt >= 1_000 ? (amt/1_000) + ' Ngàn' : 
                amt + ' Đồng'
              }
            </button>
          ))}
          <button 
            onClick={() => setPrincipalStr('')} 
            className="px-3 py-2 text-destructive text-sm border border-destructive rounded-md hover:bg-destructive hover:text-white transition-colors font-bold"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Lãi Suất Năm và Thời Gian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium text-lg">Lãi Suất (%/năm)</label>
          <input
            type="text" // Đổi từ number sang text để nhận được cả dấu phẩy
            inputMode="decimal" // Để điện thoại hiện bàn phím số có dấu ngăn cách
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value.replace(/,/g, '.'))} // Tự động đổi phẩy thành chấm ngay khi nhập
            placeholder="Ví dụ: 4.75"
            className="w-full px-4 py-4 rounded-lg bg-input-background border-2 border-border focus:border-primary text-xl font-semibold outline-none"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={() => addInterest(1)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-white transition-colors border border-border font-medium">+ 1 %</button>
            <button onClick={() => addInterest(0.1)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-white transition-colors border border-border font-medium">+ 0.1 %</button>
            <button onClick={() => addInterest(0.01)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-white transition-colors border border-border font-medium">+ 0.01 %</button>
            <button onClick={() => setInterestRate('')} className="px-3 py-2 text-destructive text-sm border border-destructive rounded-md hover:bg-destructive hover:text-white transition-colors font-bold">Xóa</button>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium text-lg">Thời Gian Gửi</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-4 rounded-lg bg-input-background border-2 border-border focus:border-primary text-xl font-semibold outline-none"
            />
            <select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value as 'days' | 'months' | 'years')}
              className="px-4 py-4 rounded-lg bg-input-background border-2 border-border font-medium text-lg"
            >
              <option value="days">Ngày</option>
              <option value="months">Tháng</option>
              <option value="years">Năm</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={() => addTime(10)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-white transition-colors border border-border font-medium">+ 10</button>
            <button onClick={() => addTime(1)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-white transition-colors border border-border font-medium">+ 1</button>
            <button onClick={() => setTimeValue('')} className="px-3 py-2 text-destructive text-sm border border-destructive rounded-md hover:bg-destructive hover:text-white transition-colors font-bold">Xóa</button>
          </div>
        </div>
      </div>

      {/* Nút Tính Toán */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={calculateProfit}
          className="flex-[2] py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all"
        >
          TÍNH TIỀN LÃI
        </button>
        <button
          onClick={reset}
          className="flex-1 py-4 bg-secondary text-secondary-foreground rounded-xl font-medium border border-border"
        >
          Làm lại
        </button>
      </div>

      {/* Kết quả hiển thị */}
      {result !== null && (
        <div className="mt-6 p-6 bg-primary/5 rounded-2xl border-2 border-primary shadow-inner">
          <p className="text-center text-muted-foreground font-medium mb-1">Tiền lãi nhận được:</p>
          <p className="text-center text-4xl font-bold text-primary mb-1">
            {Math.round(result).toLocaleString('vi-VN')}₫
          </p>
          <p className="text-center text-primary font-medium mb-4 italic text-sm">
            ({formatToWords(result)})
          </p>
          
          <div className="space-y-2 text-sm pt-4 border-t border-primary/20">
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">Tiền gốc ban đầu:</span>
              <div className="text-right">
                <span className="font-semibold block">{numericPrincipal.toLocaleString('vi-VN')}₫</span>
                <span className="text-[11px] italic text-muted-foreground">({formatToWords(numericPrincipal)})</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-dashed">
              <span>Tổng nhận (Gốc + Lãi):</span>
              <div className="text-right">
                <span className="text-primary block">{(Math.round(numericPrincipal + result)).toLocaleString('vi-VN')}₫</span>
                <span className="text-xs font-medium text-primary italic">({formatToWords(numericPrincipal + result)})</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}