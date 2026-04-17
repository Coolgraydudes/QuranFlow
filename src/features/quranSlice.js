import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllSurah, fetchDetailSurah } from '../services/quranApi';

// ============ ASYNC THUNK ============
// Thunk adalah fungsi khusus untuk handle operasi async (seperti fetch data)

// Thunk untuk mengambil semua surah
export const getAllSurah = createAsyncThunk(
  'quran/getAllSurah',  // Nama action type (format: 'namaSlice/namaAction')
  async () => {
    const response = await fetchAllSurah();
    return response.data.data;  // Kita hanya ambil bagian 'data' yang kita butuhkan
  }
);

// Thunk untuk mengambil detail surah
export const getSurahDetail = createAsyncThunk(
  'quran/getDetail',
  async (nomor) => {
    const response = await fetchDetailSurah(nomor);
    return response.data.data;
  }
);

// ============ INITIAL STATE ============
// State awal aplikasi sebelum ada data
const initialState = {
  surahList: [],      // Array untuk menyimpan daftar surat
  detailSurah: null,  // Object untuk detail surat yang dipilih
  loading: false,     // Status loading (true saat mengambil data)
  error: null,        // Menyimpan pesan error jika ada
  searchTerm: '',     // Kata kunci pencarian
  bookmarks: [],      // Bookmark
};

// ============ SLICE ============
// Slice menggabungkan reducers dan actions dalam satu tempat
const quranSlice = createSlice({
  name: 'quran',  // Nama slice, akan menjadi prefix untuk semua action
  initialState, 
  
  // Reducers untuk actions yang sinkron (bukan async)
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;  // Update kata kunci pencarian
    },

    toggleBookmark: (state, action) => {
      const ayat = action.payload;

      const isExist = state.bookmarks.find(
        (item) => item.id === ayat.id
      );

      if (isExist) {
        // Jika sudah ada → hapus dari bookmark
        state.bookmarks = state.bookmarks.filter(
          (item) => item.id !== ayat.id
        );
      } else {
        //klo blom di tambahin
        state.bookmarks.push(ayat);
      } 
    }
  },
  
  // ExtraReducers untuk actions async (dari createAsyncThunk)
  extraReducers: (builder) => {
    builder
      // ============ HANDLE GET ALL SURAH ============
      .addCase(getAllSurah.pending, (state) => {
        state.loading = true;      // Mulai loading
        state.error = null;        // Reset error
      })
      .addCase(getAllSurah.fulfilled, (state, action) => {
        state.loading = false;     // Selesai loading
        state.surahList = action.payload;  // Simpan data ke state
      })
      .addCase(getAllSurah.rejected, (state, action) => {
        state.loading = false;     // Selesai loading
        state.error = action.error.message;  // Simpan pesan error
      })
      
      // ============ HANDLE GET SURAH DETAIL ============
      .addCase(getSurahDetail.pending, (state) => {
        state.loading = true;
        state.detailSurah = null;  // Reset detail saat loading
      })
      .addCase(getSurahDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detailSurah = action.payload;
      })
      .addCase(getSurahDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions (untuk digunakan di komponen)
export const { setSearchTerm, toggleBookmark } = quranSlice.actions;

// Export reducer (untuk didaftarkan ke store)
export default quranSlice.reducer;