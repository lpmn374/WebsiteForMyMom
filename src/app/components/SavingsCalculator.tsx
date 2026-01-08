import { useState } from 'react';

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
  const [principalStr, setPrincipalStr] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [timeValue, setTimeValue] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<'days' | 'months' | 'years'>('months');
  const [resultData, setResultData] = useState<{
    interest: number;
    startDate: string;
    endDate: string;
    daysCount: number;
  } | null>(null);

  const numericPrincipal = Number(principalStr.replace(/\./g, ''));

  const handlePrincipalChange = (val: string) => {
    const onlyNums = val.replace(/\D/g, '');
    const formatted = onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setPrincipalStr(formatted);
  };

  const handleInterestChange = (val: string) => {
    let cleanVal = val.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
    const parts = cleanVal.split('.');
    if (parts.length > 2) cleanVal = parts[0] + '.' + parts.slice(1).join('');
    setInterestRate(cleanVal);
  };

  const handleTimeChange = (val: string) => {
    const onlyNums = val.replace(/\D/g, '');
    setTimeValue(onlyNums);
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
    const current = parseInt(timeValue) || 0;
    setTimeValue((current + val).toString());
  };

  const calculateProfit = () => {
    const p = numericPrincipal;
    const r = parseFloat(interestRate);
    const t = parseInt(timeValue);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
      alert('Mẹ ơi, mẹ nhập đủ số tiền, lãi suất và thời gian nhé!');
      return;
    }

    const startDate = new Date(); // Ngày gửi là hôm nay
    const endDate = new Date();

    if (timeUnit === 'days') {
      endDate.setDate(startDate.getDate() + t);
    } else if (timeUnit === 'months') {
      endDate.setMonth(startDate.getMonth() + t);
    } else {
      endDate.setFullYear(startDate.getFullYear() + t);
    }

    // Tính số ngày thực tế giữa 2 ngày
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Công thức chuẩn ngân hàng: Lãi = (Số tiền * Lãi suất * Số ngày thực tế) / 365
    const interest = (p * (r / 100) * daysCount) / 365;

    setResultData({
      interest,
      startDate: startDate.toLocaleDateString('vi-VN'),
      endDate: endDate.toLocaleDateString('vi-VN'),
      daysCount
    });
  };

  const reset = () => {
    setPrincipalStr('');
    setInterestRate('');
    setTimeValue('');
    setResultData(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-center font-bold text-2xl text-primary">Tính Lãi Tiết Kiệm</h2>

      {/* Số Tiền Gửi */}
      <div>
        <label className="block mb-2 font-medium text-lg">Số Tiền Gửi (₫)</label>
        <input
          type="text"
          inputMode="numeric"
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
            <button key={amt} onClick={() => addAmount(amt)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-white transition-colors border border-border font-medium">
              + {amt >= 1_000_000_000 ? (amt/1_000_000_000) + ' Tỷ' : amt >= 1_000_000 ? (amt/1_000_000) + ' Triệu' : amt >= 1_000 ? (amt/1_000) + ' Ngàn' : amt + ' Đồng'}
            </button>
          ))}
          <button onClick={() => setPrincipalStr('')} className="px-3 py-2 text-destructive text-sm border border-destructive rounded-md hover:bg-destructive hover:text-white transition-colors font-bold">Xóa</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium text-lg">Lãi Suất (%/năm)</label>
          <input
            type="text"
            inputMode="decimal"
            value={interestRate}
            onChange={(e) => handleInterestChange(e.target.value)}
            placeholder="Ví dụ: 4.75"
            className="w-full px-4 py-4 rounded-lg bg-input-background border-2 border-border focus:border-primary text-xl font-semibold outline-none"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={() => addInterest(1)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-white transition-colors border border-border font-medium">+ 1 %</button>
            <button onClick={() => addInterest(0.1)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-white transition-colors border border-border font-medium">+ 0.1 %</button>
            <button onClick={() => setInterestRate('')} className="px-3 py-2 text-destructive text-sm border border-destructive rounded-md hover:bg-destructive hover:text-white transition-colors font-bold">Xóa</button>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium text-lg">Thời Gian Gửi</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-4 rounded-lg bg-input-background border-2 border-border focus:border-primary text-xl font-semibold outline-none"
            />
            <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value as 'days' | 'months' | 'years')} className="px-4 py-4 rounded-lg bg-input-background border-2 border-border font-medium text-lg outline-none">
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

      <div className="flex gap-3 pt-4">
        <button onClick={calculateProfit} className="flex-[2] py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all">TÍNH TIỀN LÃI</button>
        <button onClick={reset} className="flex-1 py-4 bg-secondary text-secondary-foreground rounded-xl font-medium border border-border">Làm lại</button>
      </div>

      {resultData !== null && (
        <div className="mt-6 p-6 bg-primary/5 rounded-2xl border-2 border-primary shadow-inner">
          <p className="text-center text-muted-foreground font-medium mb-1">Tiền lãi dự kiến nhận được:</p>
          <p className="text-center text-4xl font-bold text-primary mb-1">{Math.round(resultData.interest).toLocaleString('vi-VN')}₫</p>
          <p className="text-center text-primary font-medium mb-4 italic text-sm">({formatToWords(resultData.interest)})</p>
          
          <div className="space-y-3 text-sm pt-4 border-t border-primary/20">
            <div className="flex justify-between bg-white/50 p-2 rounded-lg">
              <span className="text-muted-foreground">Ngày gửi:</span>
              <span className="font-bold">{resultData.startDate}</span>
            </div>
            <div className="flex justify-between bg-white/50 p-2 rounded-lg">
              <span className="text-muted-foreground">Ngày đáo hạn:</span>
              <span className="font-bold text-primary">{resultData.endDate}</span>
            </div>
            <div className="flex justify-between p-2">
              <span className="text-muted-foreground">Số ngày thực tế:</span>
              <span className="font-semibold">{resultData.daysCount} ngày</span>
            </div>
            
            <div className="border-t border-dashed border-primary/30 pt-3">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Tiền gốc:</span>
                <span className="font-semibold">{numericPrincipal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-foreground pt-2">
                <span>Tổng nhận:</span>
                <div className="text-right">
                  <span className="text-primary block">{(Math.round(numericPrincipal + resultData.interest)).toLocaleString('vi-VN')}₫</span>
                  <span className="text-xs font-medium text-primary italic">({formatToWords(numericPrincipal + resultData.interest)})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}