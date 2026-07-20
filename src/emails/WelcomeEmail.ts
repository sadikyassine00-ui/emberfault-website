export function renderWelcomeEmail(email: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EMBERFAULT // ENLISTMENT CONFIRMED</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Inter:wght@400;700;900&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          background-color: #09090b;
          color: #d4d4d8;
          font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
          line-height: 1.6;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #0d0d10;
          border: 1px solid #27272a;
        }

        .header {
          background-color: #18181b;
          padding: 32px 24px;
          border-bottom: 2px solid #eab308;
          text-align: center;
        }

        .header h1 {
          margin: 0;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: 28px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .header .subtitle {
          color: #eab308;
          font-size: 12px;
          letter-spacing: 4px;
          margin-top: 8px;
        }

        .content {
          padding: 32px 24px;
        }

        .status-box {
          background-color: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.3);
          padding: 16px;
          margin-bottom: 32px;
          border-left: 4px solid #a855f7;
        }

        .status-text {
          color: #d8b4fe;
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .message {
          margin-bottom: 24px;
          font-size: 14px;
        }

        .message p {
          margin: 0 0 16px 0;
        }

        .highlight {
          color: #eab308;
        }

        .cta-container {
          text-align: center;
          margin: 40px 0;
        }

        .cta-button {
          display: inline-block;
          background-color: #eab308;
          color: #000000;
          text-decoration: none;
          font-weight: bold;
          padding: 16px 32px;
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: 1px solid #fef08a;
          box-shadow: 0 0 20px rgba(234, 179, 8, 0.2);
        }

        .footer {
          background-color: #09090b;
          border-top: 1px solid #27272a;
          padding: 24px;
          text-align: center;
          font-size: 11px;
          color: #71717a;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>EMBERFAULT</h1>
          <div class="subtitle">ALPHA PRE-REGISTRATION</div>
        </div>

        <!-- Body -->
        <div class="content">
          <div class="status-box">
            <p class="status-text">> UPLINK ESTABLISHED</p>
            <p class="status-text" style="color: #a1a1aa; font-size: 12px; margin-top: 4px;">> TARGET IDENTIFIER: ${email}</p>
          </div>

          <div class="message">
            <p>Pilot,</p>
            <p>Your coordinates have been logged into the Vanguard Network. You are officially enlisted for the upcoming <span class="highlight">Emberfault Alpha Test</span>.</p>
            <p>The subterranean swarm activity is escalating. We are currently finalizing the extraction protocols and stabilizing the central hearths. When the tunnels open, you will be among the first to breach the surface and drop into the void.</p>
            <p>Maintain this comms channel. We will transmit critical intelligence, deployment schedules, and your exclusive access key in the coming weeks.</p>
          </div>

          <div class="cta-container">
            <a href="https://emberfault.com" class="cta-button">
              RETURN TO BASE
            </a>
          </div>

          <div class="message" style="font-size: 12px; color: #a1a1aa;">
            <p>> PREPARE TO SHATTER THE EARTH.<br>> SURVIVE THE NIGHT.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>TRANSMISSION ORIGIN: EMBERFAULT HQ // SYSTEM CORE</p>
          <p>You received this uplink because you registered your beacon at emberfault.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
