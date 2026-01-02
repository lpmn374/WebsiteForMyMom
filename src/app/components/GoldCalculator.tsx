import { useState } from 'react';

// Hàm hỗ trợ chuyển số thành chữ giúp mẹ dễ đọc
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

export function GoldCalculator() {
  const [luong, setLuong] = useState<string>('');
  const [phan, setPhan] = useState<string>('');
  const [chi, setChi] = useState<string>('');
  
  const [purchasePriceStr, setPurchasePriceStr] = useState<string>('');
  const [sellingPriceStr, setSellingPriceStr] = useState<string>('');

  const [result, setResult] = useState<{
    totalSelling: number;
    profit?: number;
    percentage?: number;
    totalPurchase?: number;
  } | null>(null);

  const numericPurchasePrice = Number(purchasePriceStr.replace(/\./g, ''));
  const numericSellingPrice = Number(sellingPriceStr.replace(/\./g, ''));

  const handleMoneyChange = (val: string, setter: (v: string) => void) => {
    const onlyNums = val.replace(/\D/g, '');
    const formatted = onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setter(formatted);
  };

  const addMoney = (amount: number, currentStr: string, setter: (v: string) => void) => {
    const currentNum = Number(currentStr.replace(/\./g, ''));
    const newTotal = currentNum + amount;
    const formatted = newTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setter(formatted);
  };

  const addWeight = (val: string, setter: (v: string) => void) => {
    const current = parseFloat(val) || 0;
    setter((current + 1).toString());
  };

  const calculateProfit = () => {
    const l = parseFloat(luong) || 0;
    const p = parseFloat(phan) || 0;
    const c = parseFloat(chi) || 0;
    const sell = numericSellingPrice;

    if (l === 0 && p === 0 && c === 0) {
      alert('Mẹ ơi, mẹ nhập số lượng vàng (lượng, chỉ hoặc phân) nhé!');
      return;
    }

    if (!sell || sell <= 0) {
      alert('Mẹ ơi, mẹ nhập giá bán hôm nay nhé!');
      return;
    }

    const totalLuong = l + (p / 10) + (c / 100);
    const totalSelling = sell * totalLuong;

    if (purchasePriceStr !== '' && numericPurchasePrice > 0) {
      const buy = numericPurchasePrice;
      const totalPurchase = buy * totalLuong;
      const profit = totalSelling - totalPurchase;
      const profitPercentage = (profit / totalPurchase) * 100;

      setResult({
        totalSelling,
        profit,
        percentage: profitPercentage,
        totalPurchase,
      });
    } else {
      setResult({ totalSelling });
    }
  };

  const reset = () => {
    setLuong(''); setPhan(''); setChi('');
    setPurchasePriceStr(''); setSellingPriceStr('');
    setResult(null);
  };

  const moneyButtons = [
    { label: '1 Tỷ', value: 1_000_000_000 },
    { label: '100 Triệu', value: 100_000_000 },
    { label: '10 Triệu', value: 10_000_000 },
    { label: '1 Triệu', value: 1_000_000 },
    { label: '100 Ngàn', value: 100_000 },
    { label: '10 Ngàn', value: 10_000 },
    { label: '1 Ngàn', value: 1_000 },
    { label: '100 Đồng', value: 100 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-center font-bold text-2xl text-primary">Tính Toán Bán Vàng</h2>

      {/* Khối nhập Trọng Lượng */}
      <div className="bg-secondary/20 p-4 rounded-xl border border-border">
        <label className="block mb-3 font-medium text-lg">Số lượng vàng hiện có?</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'luong', label: 'Lượng', val: luong, set: setLuong },
            { id: 'phan', label: 'Phân', val: phan, set: setPhan },
            { id: 'chi', label: 'Chỉ', val: chi, set: setChi }
          ].map((item) => (
            <div key={item.id}>
              <label className="block text-xs text-muted-foreground mb-1 uppercase font-bold">{item.label}</label>
              <input
                type="number"
                value={item.val}
                onChange={(e) => item.set(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-3 rounded-lg bg-input-background border-2 border-border focus:border-primary text-center font-bold text-lg outline-none"
              />
              <button 
                onClick={() => addWeight(item.val, item.set)}
                className="w-full mt-2 py-1 bg-white border border-border rounded text-[11px] font-medium hover:bg-primary hover:text-white transition-colors"
              >
                + 1 {item.label}
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => { setLuong(''); setPhan(''); setChi(''); }} className= "mt-3 w-full py-1 text-destructive text-xs border border-destructive/30 rounded font-medium">Xóa trọng lượng</button>
      </div>

      {/* Giá Mua Vào */}
      <div>
        <label className="block mb-2 font-medium">Giá Mua vào mỗi Lượng (₫)</label>
        <input
          type="text"
          value={purchasePriceStr}
          onChange={(e) => handleMoneyChange(e.target.value, setPurchasePriceStr)}
          placeholder="Nếu không nhớ thì mẹ không cần nhập"
          className="w-full px-4 py-3 rounded-lg bg-input-background border-2 border-border text-lg font-semibold outline-none focus:border-primary"
        />
        <p className="mt-1 text-primary text-xs font-medium min-h-[1rem]">
          {numericPurchasePrice > 0 && `Mẹ đang nhập: ${formatToWords(numericPurchasePrice)}`}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {moneyButtons.map(btn => (
            <button key={btn.value} onClick={() => addMoney(btn.value, purchasePriceStr, setPurchasePriceStr)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-white transition-colors border border-border font-medium">
              + {btn.label}
            </button>
          ))}
          <button onClick={() => setPurchasePriceStr('')} className="px-3 py-2 text-destructive text-sm border border-destructive rounded-md hover:bg-destructive hover:text-white transition-colors font-bold">Xóa</button>
        </div>
      </div>

      {/* Giá Bán Ra */}
      <div>
        <label className="block mb-2 font-medium">Giá Bán ra mỗi Lượng (₫)</label>
        <input
          type="text"
          value={sellingPriceStr}
          onChange={(e) => handleMoneyChange(e.target.value, setSellingPriceStr)}
          placeholder="Ví dụ: 85.000.000"
          className="w-full px-4 py-3 rounded-lg bg-input-background border-2 border-border text-lg font-semibold outline-none focus:border-primary"
        />
        <p className="mt-1 text-primary text-xs font-medium min-h-[1rem]">
          {numericSellingPrice > 0 && `Mẹ đang nhập: ${formatToWords(numericSellingPrice)}`}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {moneyButtons.map(btn => (
            <button key={btn.value} onClick={() => addMoney(btn.value, sellingPriceStr, setSellingPriceStr)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-white transition-colors border border-border font-medium">
              + {btn.label}
            </button>
          ))}
          <button onClick={() => setSellingPriceStr('')} className="px-3 py-2 text-destructive text-sm border border-destructive rounded-md hover:bg-destructive hover:text-white transition-colors font-bold">Xóa</button>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={calculateProfit} className="flex-[2] py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all">TÍNH KẾT QUẢ</button>
        <button onClick={reset} className="flex-1 py-4 bg-secondary rounded-xl font-medium border border-border text-sm">Làm lại</button>
      </div>

      {result !== null && (
        <div className="mt-6 p-6 bg-primary/5 rounded-2xl border-2 border-primary shadow-inner">
          <p className="text-center text-muted-foreground font-medium mb-1">
            {result.profit === undefined ? 'Số tiền bán được:' : (result.profit >= 0 ? 'Lợi Nhuận:' : 'Kết quả (Lỗ):')}
          </p>
          <div className="text-center mb-4">
            <p className={`text-4xl font-bold ${result.profit !== undefined && result.profit < 0 ? 'text-destructive' : 'text-primary'}`}>
              {result.profit !== undefined ? Math.abs(result.profit).toLocaleString('vi-VN') : result.totalSelling.toLocaleString('vi-VN')}₫
            </p>
            <p className={`text-sm font-medium italic mt-1 ${result.profit !== undefined && result.profit < 0 ? 'text-destructive' : 'text-primary'}`}>
              ({formatToWords(result.profit !== undefined ? Math.abs(result.profit) : result.totalSelling)})
            </p>
          </div>
          
          <div className="space-y-3 text-sm pt-4 border-t border-primary/20">
            {result.totalPurchase !== undefined && (
              <div className="flex justify-between items-start text-muted-foreground">
                <span>Tổng tiền vốn:</span>
                <div className="text-right">
                  <span className="font-semibold text-foreground block">{result.totalPurchase.toLocaleString('vi-VN')}₫</span>
                  <span className="text-[11px] italic">({formatToWords(result.totalPurchase)})</span>
                </div>
              </div>
            )}
            <div className="flex justify-between items-start text-muted-foreground">
              <span>Tổng tiền thu về:</span>
              <div className="text-right">
                <span className="font-semibold text-foreground block">{result.totalSelling.toLocaleString('vi-VN')}₫</span>
                <span className="text-[11px] italic">({formatToWords(result.totalSelling)})</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}