function handleDownload() {
    const url = urlInput.value.trim();
    
    if (url === "") {
        resultArea.innerHTML = "<p>Menunggu tautan video...</p>";
        return;
    }

    if (!url.includes("tiktok.com")) {
        resultArea.innerHTML = "<p style='color: #FF6B9D;'>❌ URL yang dimasukkan harus dari TikTok.</p>";
        return;
    }
    
    // 1. Tampilkan loading saat URL valid
    resultArea.innerHTML = "<p class='loading-text'>⏳ Memproses video... Mohon tunggu sebentar.</p>";

    // 2. GANTI URL DI BAWAH dengan endpoint API backend Anda yang nyata.
    const YOUR_BACKEND_API_ENDPOINT = 'https://api.yourdomain.com/download-tiktok'; // Contoh: Ganti dengan URL server Anda

    // 3. Panggil API backend menggunakan Fetch
    fetch(YOUR_BACKEND_API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Jika backend Anda butuh API key untuk otentikasi, tambahkan di sini
        },
        body: JSON.stringify({ 
            videoUrl: url 
        })
    })
    .then(response => {
        // Cek jika respons server sukses
        if (!response.ok) {
            throw new Error(`Server Error: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // ASUMSI: Backend Anda mengembalikan objek seperti ini:
        // { title: "Judul Video", thumbnail: "url_thumbnail", downloadLink: "url_video_mp4_tanpa_wm" }
        
        const videoTitle = data.title || "Video TikTok Tanpa Watermark";
        const videoThumbnail = data.thumbnail;
        const finalDownloadLink = data.downloadLink; // URL Unduhan Nyata!

        if (!finalDownloadLink) {
             throw new Error('Tautan unduhan tidak ditemukan dalam respons.');
        }

        resultArea.innerHTML = `
            <h3>✅ Video Ditemukan!</h3>
            <img src="${videoThumbnail}" onerror="this.style.display='none'" alt="Thumbnail Video" class="video-thumbnail">
            <p>Judul: <strong>${videoTitle}</strong></p>
            <a href="${finalDownloadLink}" download="${videoTitle.replace(/\s/g, '_')}_nowm_${Date.now()}.mp4" class="download-link" target="_blank">
                ⬇️ DOWNLOAD VIDEO (MP4 Tanpa WM)
            </a>
        `;
    })
    .catch(error => {
        console.error('Download Error:', error);
        resultArea.innerHTML = `<p style='color: #FF6B9D;'>❌ Error Download: ${error.message}. Pastikan tautan benar dan server backend berfungsi.</p>`;
    });
}
