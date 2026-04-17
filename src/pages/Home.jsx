import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSurah, setSearchTerm } from '../features/quranSlice';
import { Link, useNavigate } from 'react-router-dom'; // Tambah useNavigate
import { SkeletonCard } from '../components/Skeleton';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Inisialisasi navigate
  
  const { surahList, loading, searchTerm } = useSelector((state) => state.quran);
  
  const [open, setOpen] = useState(false); 
  const [lastRead, setLastRead] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "light");
  const [goal, setGoal] = useState(localStorage.getItem("dailyGoal") || 10);
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  // Perbaikan: Tambahkan state currentProgress agar tidak error saat di-render
  const [currentProgress, setCurrentProgress] = useState(0);

  const handleGoalChange = (e) => {
    const value = e.target.value;
    setGoal(value);
    localStorage.setItem("dailyGoal", value);
  };

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
    dispatch(getAllSurah());
    
    // Tema
    const savedTheme = localStorage.getItem("theme") || "light";
    changeTheme(savedTheme);

    // Last Read
    const savedLastRead = localStorage.getItem("lastRead");
    if (savedLastRead) {
      setLastRead(JSON.parse(savedLastRead));
    }

    // Progress Goal (Sync data)
    const today = new Date().toLocaleDateString();
    const stats = JSON.parse(localStorage.getItem("quran_stats")) || { date: today, count: 0 };
    if (stats.date === today) {
      setCurrentProgress(stats.count);
    }
  }, [dispatch]);

  const filteredSurah = surahList.filter((s) =>
    s.namaLatin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung persentase untuk UI lingkaran
  const percentage = Math.min(Math.round((currentProgress / goal) * 100), 100);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 dark:bg-[#0f172a] dark:text-gray-100 transition-colors duration-500 font-sans">
      <div className="container mx-auto p-4 md:p-6 lg:h-screen lg:overflow-hidden flex flex-col">
        
        <header className="text-center py-8 flex-shrink-0">
          <h1 className="text-5xl md:text-6xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
            QuranFlow
          </h1>
        </header>

        <main className="flex flex-col lg:flex-row gap-6 flex-grow lg:overflow-hidden mb-6">
          <div className="lg:w-7/12 flex flex-col gap-6 h-full">
            
            {/* LAST READ CARD */}
            <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 flex flex-col justify-center shadow-sm">
              {lastRead ? (
                <Link to={`/surat/${lastRead.nomorSurah}`} className="group bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] transition-all hover:ring-2 hover:ring-emerald-500/50">
                   <div className="flex justify-between items-start mb-6">
                      <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-700 dark:text-emerald-300">{lastRead.nama}</h2>
                      <span className="bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full font-bold">Terakhir Dibaca</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-bold">{lastRead.nomorSurah}. {lastRead.namaSurah}</h3>
                        <p className="text-sm text-gray-500">Ayat ke-{lastRead.nomorAyat}</p>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <span>Lanjut Baca</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </div>
                   </div>
                </Link>
              ) : (
                <div className="opacity-40 flex flex-col items-center py-10">
                  <h2 className="text-xl font-bold italic">Belum ada riwayat baca</h2>
                </div>
              )}
            </div>

            {/* GOAL CARD */}
            <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 flex flex-col shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Daily Reading Goal</h3>
                <button onClick={() => setIsEditingGoal(!isEditingGoal)} className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                  {isEditingGoal ? 'Selesai' : 'Ubah Target'}
                </button>
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  {isEditingGoal ? (
                    <input type="number" value={goal} onChange={handleGoalChange} className="text-5xl font-black text-emerald-600 bg-transparent border-b-2 border-emerald-500 outline-none w-full" autoFocus />
                  ) : (
                    <p className="text-6xl font-black text-emerald-600 tabular-nums">{goal}</p>
                  )}
                  <p className="text-[10px] text-gray-500 font-bold uppercase mt-2">Ayat Per Hari</p>
                </div>
                <div className="hidden md:block w-24 h-24 relative">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-gray-100 dark:text-gray-800" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-emerald-500" strokeDasharray={`${percentage}, 100`} strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-emerald-600">{percentage}%</div>
                </div>
              </div>
              <div className="mt-auto pt-6">
                 <p className="text-[11px] text-gray-500 italic">"One verse at a time, healing the soul in every line."</p>
              </div>
            </div>
          </div>

          {/* LIST SURAH */}
          <div className="lg:w-5/12 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] flex flex-col shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-50 dark:border-gray-800">
              <input 
                type="text" 
                placeholder="Cari Surah..." 
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" 
                onChange={(e) => dispatch(setSearchTerm(e.target.value))} 
              />
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {loading ? (
                [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              ) : (
                filteredSurah.map((surah) => (
                  <Link 
                    to={`/surat/${surah.nomor}`} 
                    key={surah.nomor} 
                    className="block group p-4 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {/* Box Nomor Surah - Sekarang berubah warna saat Dark Mode */}
                        <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 font-black shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          {surah.nomor}
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {surah.namaLatin}
                          </h3>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            {surah.arti} • {surah.jumlahAyat} Ayat
                          </p>
                        </div>
                      </div>
                      <h4 className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-300" dir="rtl">
                        {surah.nama}
                      </h4>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </main>

        {/* SIDEBAR */}
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
                <Link to="/bookmark" onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 font-bold hover:scale-[1.02] transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>Bookmark Tersimpan</Link>
              </div>
            </div>
          </div>
        </aside>

        {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-slate-900/40 z-[90]" />}

        <button onClick={() => setOpen(true)} className="fixed bottom-8 right-8 bg-emerald-600 text-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl z-30"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M10 3h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M20 3h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M10 13h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M17 13a4 4 0 1 1 -3.995 4.2l-.005 -.2l.005 -.2a4 4 0 0 1 3.995 -3.8z" /></svg></button>
      </div>
    </div>
  );
};

export default Home;