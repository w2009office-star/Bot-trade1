<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Jurnal & Pemantauan Market</title>
    <style>
        /* Pengaturan Dasar dan Warna Tema Gelap (Mata Tidak Cepat Lelah) */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #131722; 
            color: #d1d4dc;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        /* Bagian Atas: Profil & Saldo */
        .header-container {
            background-color: #1e222d;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #2a2e39;
        }
        .profil h2 {
            margin: 0;
            font-size: 18px;
            color: #ffffff;
        }
        .profil p {
            margin: 4px 0 0 0;
            font-size: 12px;
            color: #787b86;
        }
        .saldo-box {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .saldo-text {
            text-align: right;
        }
        .saldo-text p {
            margin: 0;
            font-size: 11px;
            color: #b2b5be;
        }
        .saldo-text h3 {
            margin: 0;
            font-size: 20px;
            color: #2962ff;
        }
        .btn-edit {
            background-color: #2962ff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        .btn-edit:hover {
            background-color: #1e4bd8;
        }
        /* Bagian Bawah: Grafik Layar Penuh */
        .chart-container {
            flex-grow: 1; /* Mengambil seluruh sisa layar di bawah header */
            width: 100%;
        }
    </style>
</head>
<body>

    <!-- HEADER: Menampilkan Judul dan Saldo Anda -->
    <div class="header-container">
        <div class="profil">
            <h2>Dashboard Pantauan</h2>
            <p>Fokus, Disiplin, Sabar.</p>
        </div>
        <div class="saldo-box">
            <div class="saldo-text">
                <p>Total Saldo Saat Ini</p>
                <h3 id="angka-saldo">Rp 0</h3>
            </div>
            <!-- Tombol untuk mengubah angka saldo -->
            <button class="btn-edit" onclick="updateSaldo()">Ubah Saldo</button>
        </div>
    </div>

    <!-- GRAFIK: Menampilkan Candle Real-Time Anti-Lag -->
    <div class="chart-container">
        <div class="tradingview-widget-container" style="height:100%;width:100%">
            <div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>
            <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
            {
                "autosize": true,
                "symbol": "FX:EURUSD",
                "interval": "1",
                "timezone": "Asia/Jakarta",
                "theme": "dark",
                "style": "1",
                "locale": "id",
                "enable_publishing": false,
                "backgroundColor": "#131722",
                "gridColor": "#1f293d",
                "hide_top_toolbar": false,
                "hide_legend": false,
                "save_image": false,
                "container_id": "tradingview_monitor"
            }
            </script>
        </div>
    </div>

    <!-- JAVASCRIPT: Otak untuk menyimpan saldo agar tidak hilang -->
    <script>
        // Perintah ini berjalan otomatis saat layar pertama kali dibuka
        document.addEventListener("DOMContentLoaded", function() {
            // Mengecek apakah sebelumnya sudah ada saldo yang disimpan di memori HP
            let saldoTersimpan = localStorage.getItem("dataSaldoPribadi");
            
            // Jika ada, tampilkan saldo tersebut
            if (saldoTersimpan !== null) {
                document.getElementById("angka-saldo").innerText = saldoTersimpan;
            }
        });

        // Perintah ini berjalan saat tombol "Ubah Saldo" diklik
        function updateSaldo() {
            // Memunculkan kotak peringatan untuk mengetik saldo baru
            let saldoBaru = prompt("Masukkan jumlah saldo terbaru Anda\n(contoh: Rp 1.500.000):");
            
            // Jika Anda mengetik sesuatu dan memencet OK
            if (saldoBaru !== null && saldoBaru.trim() !== "") {
                // 1. Ubah tulisan saldo di layar
                document.getElementById("angka-saldo").innerText = saldoBaru;
                // 2. Simpan secara permanen di memori aplikasi
                localStorage.setItem("dataSaldoPribadi", saldoBaru);
            }
        }
    </script>

</body>
</html>
