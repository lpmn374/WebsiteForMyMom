import { useState, useMemo } from 'react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const SEARCHABLE_PAGES = [
  {
    id: 'savings',
    title: 'Lãi suất tiết kiệm ngân hàng',
    tags: ['tiết kiệm', 'ngân hàng', 'gửi tiền', 'lãi suất', 'tính lãi', 'bank']
  },
  {
    id: 'gold',
    title: 'Lợi nhuận vàng',
    tags: ['vàng', 'giá vàng', 'bán vàng', 'mua vàng', 'lợi nhuận', 'vàng miếng', 'nhẫn']
  },
  {
    id: 'home',
    title: 'Trang chủ',
    tags: ['nhà', 'trang chủ', 'quay lại', 'home']
  }
];

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [showFunctionsMenu, setShowFunctionsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Lọc danh sách gợi ý khi mẹ đang gõ
  const suggestions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query.length < 1) return [];
    return SEARCHABLE_PAGES.filter(page => 
      page.title.toLowerCase().includes(query) || 
      page.tags.some(tag => tag.includes(query))
    );
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      onNavigate(suggestions[0].id);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-card shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-start h-16 gap-8">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0" 
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <img src="/Logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="hidden md:block text-primary font-bold text-lg">Website nhỏ dành cho mẹ Mận ❤︎</span>
          </div>

          <div className="flex items-center gap-4 flex-1">
            {/* Trang chủ */}
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                currentPage === 'home' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'
              }`}
            >
              Trang chủ
            </button>

            {/* Công năng */}
            <div className="relative">
              <button
                onClick={() => setShowFunctionsMenu(!showFunctionsMenu)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                  currentPage !== 'home' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'
                }`}
              >
                Tính toán
                <svg className={`w-4 h-4 transition-transform ${showFunctionsMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showFunctionsMenu && (
                <div className="absolute top-full mt-2 left-0 bg-card shadow-xl rounded-lg border border-border min-w-[250px] overflow-hidden z-50">
                  <button
                    onClick={() => { onNavigate('savings'); setShowFunctionsMenu(false); }}
                    className="w-full text-left px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                  >
                    💰 Lãi suất tiết kiệm ngân hàng
                  </button>
                  <button
                    onClick={() => { onNavigate('gold'); setShowFunctionsMenu(false); }}
                    className="w-full text-left px-4 py-4 hover:bg-secondary transition-colors"
                  >
                    ✨ Lợi nhuận vàng
                  </button>
                </div>
              )}
            </div>

            {/* Search Bar - Trả về thiết kế cũ nhưng thêm Gợi ý */}
            <div className="relative hidden lg:block ml-auto">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="px-4 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring w-48 transition-all"
                />
              </form>

              {/* Bảng gợi ý khi gõ */}
              {suggestions.length > 0 && (
                <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-lg w-64 overflow-hidden z-[60]">
                  {suggestions.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => {
                        onNavigate(page.id);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-primary hover:text-primary-foreground transition-colors text-sm border-b last:border-none border-border"
                    >
                      {page.id === 'savings' ? '💰 ' : page.id === 'gold' ? '✨ ' : '🏠 '}
                      {page.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}