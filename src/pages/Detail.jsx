import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSurahDetail, toggleBookmark } from '../features/quranSlice';
import { SkeletonAyat } from '../components/Skeleton';

const Detail = () => {
  const { nomor } = useParams();
  const dispatch = useDispatch();
  const { detailSurah, loading, bookmarks } = useSelector((state) => state.quran);
  
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

  const handleShare = async (ayat) => {
    const shareText = `[${detailSurah.namaLatin} Ayat ${ayat.nomorAyat}]\n\n${ayat.teksArab}\n\nArtinya: "${ayat.teksIndonesia}"`;
    const shareUrl = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'Mishkah', text: shareText, url: shareUrl }); } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(`${shareText}\n\nLink: ${shareUrl}`);
      alert("Ayat disalin ke clipboard!");
    }
  };

  const handleLastRead = (ayat) => {
    const data = {
      nomorSurah: detailSurah.nomor,
      namaSurah: detailSurah.namaLatin,
      nomorAyat: ayat.nomorAyat,
      nama: detailSurah.nama
    };
    localStorage.setItem("lastRead", JSON.stringify(data));
    alert(`Ditandai: ${detailSurah.namaLatin} ayat ${ayat.nomorAyat}`);
  };

  useEffect(() => {
    dispatch(getSurahDetail(nomor));
    const savedTheme = localStorage.getItem("theme") || "light";
    changeTheme(savedTheme);
    window.scrollTo(0, 0);
  }, [dispatch, nomor]);

  if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-10"><SkeletonAyat /></div>;

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

        {detailSurah && (
          <div className="w-full max-w-4xl space-y-10 mb-24">
            <div className="relative overflow-hidden bg-emerald-600 dark:bg-emerald-500 text-white p-10 md:p-14 rounded-[3rem] shadow-2xl text-center">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              <h1 className="text-5xl md:text-6xl font-black mb-3">{detailSurah.namaLatin}</h1>
              <p className="text-emerald-100 font-bold text-xl mb-8 uppercase tracking-widest">{detailSurah.arti} • {detailSurah.jumlahAyat} Ayat</p>
              <div className="bg-black/10 backdrop-blur-xl p-4 rounded-[2rem] border border-white/20 inline-block w-full max-w-md">
                <audio controls className="w-full h-10 accent-emerald-400"><source src={detailSurah.audioFull['05']} type="audio/mpeg" /></audio>
              </div>
            </div>

            <div className="space-y-8">
              {detailSurah.ayat.map((ayat) => (
                <div key={ayat.nomorAyat} className="bg-white dark:bg-slate-900/40 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500">
                  <div className="flex justify-between items-center mb-10">
                    <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 w-12 h-12 flex items-center justify-center rounded-2xl font-black">{ayat.nomorAyat}</span>
                    <div className="flex gap-3">
                      <button onClick={() => handleShare(ayat)} className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-emerald-500 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button>
                      <button onClick={() => handleLastRead(ayat)} className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-emerald-500 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
                      <button onClick={() => dispatch(toggleBookmark({ id: `${detailSurah.nomor}:${ayat.nomorAyat}`, ar: ayat.teksArab, text: ayat.teksIndonesia, surah: detailSurah.namaLatin }))}
                        className={`p-3 rounded-xl transition-all ${bookmarks.find(b => b.id === `${detailSurah.nomor}:${ayat.nomorAyat}`) ? 'bg-emerald-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}><svg className="w-6 h-6" fill={bookmarks.find(b => b.id === `${detailSurah.nomor}:${ayat.nomorAyat}`) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg></button>
                    </div>
                  </div>
                  <div className="text-right mb-12"><h2 className="text-4xl md:text-6xl font-serif font-bold leading-[2.5]" dir="rtl">{ayat.teksArab}</h2></div>
                  <div className="space-y-4 border-l-4 border-emerald-500/20 pl-6"><p className="text-emerald-600 dark:text-emerald-400 font-bold italic">{ayat.teksLatin}</p><p className="text-gray-600 dark:text-gray-300 text-lg font-medium">{ayat.teksIndonesia}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

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
        {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-slate-900/40 z-40 transition-all" />}
        <button onClick={() => setOpen(true)} className="fixed bottom-8 right-8 bg-emerald-600 dark:bg-emerald-500 text-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl z-30 group hover:scale-110 transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="group-hover:rotate-12 transition-transform duration-500"><path d="M10 3h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M20 3h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M10 13h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M17 13a4 4 0 1 1 -3.995 4.2l-.005 -.2l.005 -.2a4 4 0 0 1 3.995 -3.8z" /></svg></button>
      </div>
    </div>
  );
};

export default Detail;