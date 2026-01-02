interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8">
      <div className="max-w-3xl w-full">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Chào mẹ, chúc mẹ một ngày tốt lành! 🌸</h1>
          <p className="text-muted-foreground text-xl">Hôm nay mẹ cần tính gì?</p>
        </div>

        {/* Quick Select Section */}
        <div className="bg-card rounded-lg shadow-lg p-8">
          <h2 className="text-center mb-6">Chọn nhanh:</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Bank Savings Button */}
            <button
              onClick={() => onNavigate('savings')}
              className="group p-6 rounded-lg border-2 border-primary bg-white hover:bg-primary transition-all duration-300 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary group-hover:bg-white rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <span className="text-2xl">🏦</span>
                </div>
                <div>
                  <h3 className="mb-2 group-hover:text-primary-foreground transition-colors">
                    Tính lãi suất tiết kiệm
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
                    Tính toán lợi nhuận từ tiền gửi tiết kiệm ngân hàng
                  </p>
                </div>
              </div>
            </button>

            {/* Gold Profit Button */}
            <button
              onClick={() => onNavigate('gold')}
              className="group p-6 rounded-lg border-2 border-primary bg-white hover:bg-primary transition-all duration-300 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary group-hover:bg-white rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h3 className="mb-2 group-hover:text-primary-foreground transition-colors">
                    Tính lợi nhuận vàng
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
                    Tính toán lợi nhuận từ mua bán vàng
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Mẹ có thể sử dụng menu phía trên để điều hướng hoặc chọn nhanh bên dưới
          </p>
        </div>
      </div>
    </div>
  );
}
