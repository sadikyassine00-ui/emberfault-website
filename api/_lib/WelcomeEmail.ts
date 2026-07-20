export function renderWelcomeEmail(email: string): string {
  const unsubscribeUrl = `https://emberfault.com/api/unsubscribe?email=${encodeURIComponent(email)}`;

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
          padding: 40px 20px;
          background-color: #050505;
          /* Faint Skull Pattern */
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15c-4.4 0-8 3.6-8 8 0 3.5 2.2 6.5 5.4 7.6v3.4h5.2v-3.4c3.2-1.1 5.4-4.1 5.4-7.6 0-4.4-3.6-8-8-8zm-3 9.6c-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6zm6 0c-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6z' fill='%23121214' fill-opacity='0.8' fill-rule='evenodd'/%3E%3C/svg%3E");
          color: #d4d4d8;
          font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
          line-height: 1.6;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: rgba(13, 13, 16, 0.95);
          border: 1px solid #27272a;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
        }

        .header {
          background-color: #18181b;
          padding: 32px 24px 24px 24px;
          border-bottom: 2px solid #eab308;
          text-align: center;
        }

        .header img {
          max-width: 250px;
          height: auto;
          margin-bottom: 12px;
        }

        .header .subtitle {
          color: #eab308;
          font-size: 12px;
          letter-spacing: 4px;
          margin-top: 8px;
          font-weight: 800;
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
        
        .message strong {
          color: #ffffff;
        }

        .highlight {
          color: #eab308;
        }
        
        .section-title {
          color: #a855f7;
          font-weight: bold;
          text-transform: uppercase;
          margin-right: 8px;
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
        
        .footer a {
          color: #a1a1aa;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <img src="https://emberfault.com/logo.png" alt="EMBERFAULT" />
          <div class="subtitle">DEVELOPMENT UPDATES</div>
        </div>

        <!-- Body -->
        <div class="content">
          <div class="status-box">
            <p class="status-text">> RECORD ESTABLISHED</p>
            <p class="status-text" style="color: #a1a1aa; font-size: 12px; margin-top: 4px;">> ENLISTED: ${email}</p>
          </div>

          <div class="message">
            <p style="font-size: 16px; font-weight: bold; color: white;">You're in.</p>
            <p>Welcome to EMBERFAULT.</p>
            <p>Think cute voxel blocks, heavy hammers, and absolute doom.</p>
            
            <p><span class="section-title">Day:</span> Mine collapsing floating islands. Stay too long, you lose it all.</p>
            <p><span class="section-title">Night:</span> Smash the floor out from under a monster swarm before they break your core.</p>
            
            <p>No run is wasted. Build the base camp, get stronger, try again.</p>
            <p>Next alpha test keys drop right here. Watch your back.</p>
          </div>

          <div class="cta-container">
            <a href="https://emberfault.com" class="cta-button">
              RETURN TO BASE
            </a>
          </div>

          <div class="message" style="text-align: center; font-size: 13px; color: #a1a1aa; font-weight: bold;">
            <p>PREPARE TO SHATTER THE EARTH.<br>SURVIVE THE NIGHT.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>TRANSMISSION ORIGIN: EMBERFAULT HQ</p>
          <p>This is an automated message. You received this uplink because you registered your beacon at emberfault.com.</p>
          <p style="margin-top: 16px;">
            <a href="${unsubscribeUrl}">Disconnect Comm Link (Unsubscribe)</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
