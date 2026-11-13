<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Monitor Market</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #131722; /* Warna gelap agar mata tidak cepat lelah */
            color: white;
            margin: 0;
            padding: 20px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #2a2e39;
        }
        .title h2 {
            margin: 0;
            color: #d1d4dc;
        }
        .title p {
            margin: 5px 0 0 0;
            font-size: 12px;
            color: #787b86;
        }
        .balance-box {
            background-color: #2a2e39;
            padding: 10px 20px;
            border-radius: 8px;
            border-left: 4px solid #2962ff;
            text-align: right;
        }
        .balance-title {
            font-size: 12px;
            color: #b2b5be;
            margin: 0 0 5px 0;
        }
        .balance-amount {
            font-size: 22px;
            font-weight: bold;
            margin: 0;
            color: #ffffff;
        }
        .chart-container {
            height: 70vh; /* Mengambil 70% tinggi layar */
            width: 100%;
            border-radius: 8px;
            overflow: hidden;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="title">
            <h2>Platform Analisis Personal</h2>
            <p>Fokus, Disiplin, Sabar.</p>
        </div>
        
        <!-- Saldo ini bersifat statis/manual karena tidak ada API ke broker -->
        <div class="balance-box">
            <p class="balance-title">Fokus pada Grafik, Bukan Saldo Eksternal</p>
            <p class="balance-amount">Semangat!</p>
        </div>
    </div>

    <!-- Menarik data grafik Real-Time anti-lag dari TradingView -->
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
                "container_id": "tradingview_78a1c"
            }
            </script>
        </div>
    </div>

    <script>
        // Di sini biasanya diletakkan kode JS untuk menarik saldo,
        // tapi untuk alasan keamanan broker, hal tersebut diblokir oleh sistem mereka.
        // Gunakan halaman ini murni untuk menganalisa pergerakan candle.
        console.log("Sistem grafik berjalan dengan lancar tanpa lag.");
    </script>

</body>
</html>
