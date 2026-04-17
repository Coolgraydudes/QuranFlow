import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { toggleBookmark } from '../features/quranSlice';

const Bookmark = () => {
  const dispatch = useDispatch();
  const { bookmarks } = useSelector((state) => state.quran);
  const [open, setOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "light");

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    changeTheme(savedTheme);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 dark:bg-[#0f172a] dark:text-gray-100 transition-colors duration-500 font-sans">
      <div className="container mx-auto p-4 md:p-6 flex flex-col items-center">
        
        {/* HEADER */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-10">
          <Link to="/" className="group flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:-translate-x-1 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </div>
            <span>Beranda</span>
          </Link>
          <h2 className="text-xl font-black italic tracking-tighter text-emerald-600 dark:text-emerald-400">QuranFlow</h2>
        </div>

        {/* LIST BOOKMARK */}
        <div className="w-full max-w-3xl mb-24">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Bookmark</h1>
            <div className="h-1.5 w-20 bg-emerald-500 mx-auto rounded-full"></div>
          </header>

          {bookmarks.length === 0 ? (
            <div className="py-24 text-center opacity-20"><h2 className="text-2xl font-bold uppercase tracking-widest italic">Kosong</h2></div>
          ) : (
            <div className="space-y-10">
              {bookmarks.map((b) => (
                <div key={b.id} className="bg-white dark:bg-slate-900/50 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-sm group relative overflow-hidden transition-all duration-500">
                  <div className="flex justify-between items-center mb-10">
                    <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest">{b.surah} : {b.id.split(':')[1]}</span>
                    <button onClick={() => dispatch(toggleBookmark({ id: b.id }))} className="text-gray-300 hover:text-red-500 p-2"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 7a1 1 0 00-1 1v11.191A1.92 1.92 0 0116.09 21H7.908A1.92 1.92 0 016 19.191V8a1 1 0 00-2 0v11.191A3.918 3.918 0 007.908 23h8.182A3.918 3.918 0 0020 19.191V8a1 1 0 00-1-1z" /></svg></button>
                  </div>
                  <div className="text-right mb-10"><h2 className="text-4xl md:text-5xl font-serif font-bold leading-[2.5]" dir="rtl">{b.ar}</h2></div>
                  <div className="pt-8 border-t border-gray-50 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6"><p className="text-sm text-gray-500 dark:text-gray-400 italic max-w-md">"{b.text}"</p>
                    <Link to={`/surat/${b.id.split(':')[0]}`} className="whitespace-nowrap bg-emerald-600 dark:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest">Buka Surat</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR (SAMA KYK HOME) */}
        <aside className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-500 z-50 border-r dark:border-gray-800 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-8">
            <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-black italic tracking-tighter text-gray-900 dark:text-white">Menu</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500 p-2 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
            <div className="space-y-8">
              <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Pilih Tema</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1">
                  <button onClick={() => changeTheme('light')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold ${currentTheme === 'light' ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-500'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg><span>Light</span></button>
                  <button onClick={() => changeTheme('dark')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold ${currentTheme === 'dark' ? 'bg-slate-700 text-emerald-400 shadow-md' : 'text-gray-500'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg><span>Dark</span></button>
                </div>
              </div>
              <div className="pt-8 border-t dark:border-gray-800">
                <Link to="/bookmark" onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>Bookmark Tersimpan</Link>
              </div>
            </div>
          </div>
        </aside>
        {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-slate-900/40 z-40 transition-all" />}
        <button onClick={() => setOpen(true)} className="fixed bottom-8 right-8 bg-emerald-600 dark:bg-emerald-500 text-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl z-30 group hover:scale-110 transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="group-hover:rotate-12 transition-transform duration-500"><path d="M10 3h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M20 3h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M10 13h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M17 13a4 4 0 1 1 -3.995 4.2l-.005 -.2l.005 -.2a4 4 0 0 1 3.995 -3.8z" /></svg></button>
      </div>
    </div>
  );
};

export default Bookmark;