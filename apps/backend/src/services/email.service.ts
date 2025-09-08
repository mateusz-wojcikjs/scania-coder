import crypto from "crypto";
import { URL } from "url";
import nodemailer, { SendMailOptions } from "nodemailer";
import { logger } from "../logger";

type InvitationParams = {
  to: string;
  token: string;
  name?: string | null;
};

const REQUIRED_ENV = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_SECURE",
  "SMTP_SERVICE",
  "SMTP_FROM",
  "FRONTEND_URL",
  "APP_NAME",
  "SUPPORT_EMAIL",
  "INVITE_EXPIRES_DAYS",
] as const;

const assertEnv = () => {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Brak wymaganych zmiennych środowiskowych: ${missing.join(", ")}`);
  }
};

const bool = (val: string | undefined, fallback = false): boolean => {
  return typeof val === "string" ? ["1", "true", "yes"].includes(val.toLowerCase()) : fallback;
};

const number = (val: string | undefined, fallback: number): number => {
  const n = Number(val);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const APP_NAME = process.env.APP_NAME || "Twoja Aplikacja";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@example.com";
const INVITE_EXPIRES_DAYS = number(process.env.INVITE_EXPIRES_DAYS, 7);

export class EmailService {
  private static transporter = (() => {
    assertEnv();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: bool(process.env.SMTP_SECURE),
      service: process.env.SMTP_SERVICE || undefined,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 50,
      tls: {
        rejectUnauthorized: true,
      },
    });

    transporter.verify((err, success) => {
      if (err) {
        logger.error("SMTP verify failed", { err });
      } else {
        logger.info("SMTP connection verified", { success });
      }
    });

    return transporter;
  })();

  static async sendInvitationEmail({ to, token, name }: InvitationParams): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const setupUrl = EmailService.buildSetupUrl(frontendUrl, token);
    const messageId = `<${crypto.randomUUID()}@${new URL(frontendUrl).hostname}>`;

    const subject = `Zaproszenie do ${APP_NAME}`;
    const preheader = `Utwórz hasło i dokończ konfigurację konta. Link ważny ${INVITE_EXPIRES_DAYS} dni.`;

    const html = EmailService.invitationHtmlTemplate({
      appName: APP_NAME,
      setupUrl,
      preheader,
      recipientName: name || undefined,
      supportEmail: SUPPORT_EMAIL,
      expiresDays: INVITE_EXPIRES_DAYS,
    });

    const text = EmailService.invitationTextTemplate({
      appName: APP_NAME,
      setupUrl,
      recipientName: name || undefined,
      supportEmail: SUPPORT_EMAIL,
      expiresDays: INVITE_EXPIRES_DAYS,
    });

    const mailOptions: SendMailOptions = {
      from: process.env.SMTP_FROM || `${APP_NAME} <noreply@${new URL(frontendUrl).hostname}>`,
      to,
      subject,
      html,
      text,
      headers: {
        "X-Entity-Ref-ID": crypto.randomUUID(),
        "List-Unsubscribe": `<mailto:${SUPPORT_EMAIL}?subject=Rezygnacja%20z%20wiadomości>`,
      },
      messageId,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Invitation email sent", {
        to,
        messageId: info.messageId,
        response: info.response,
      });
    } catch (error: unknown) {
      logger.error("Error sending invitation email", {
        error: error instanceof Error ? error.message : String(error),
        to,
      });
      throw new Error(`Error sending invitation email to ${to}: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }

  private static buildSetupUrl(frontendUrl: string, token: string): string {
    const url = new URL("/setup-password", frontendUrl);
    url.searchParams.set("token", token);
    return url.toString();
  }

  // ---------- TEMPLATES ----------

  private static invitationTextTemplate(params: {
    appName: string;
    setupUrl: string;
    recipientName?: string;
    supportEmail: string;
    expiresDays: number;
  }): string {
    const { appName, setupUrl, recipientName, supportEmail, expiresDays } = params;
    const hello = recipientName ? `Cześć ${recipientName},` : "Cześć,";

    return `${hello}

Otrzymałeś zaproszenie do ${appName}.
Aby dokończyć konfigurację konta, ustaw swoje hasło pod poniższym adresem:

${setupUrl}

Uwaga: link wygaśnie za ${expiresDays} dni.

Jeśli nie spodziewałeś się tego zaproszenia, zignoruj tę wiadomość.
W razie pytań napisz do nas: ${supportEmail}

Pozdrawiamy,
Zespół ${appName}
`;
  }

  private static invitationHtmlTemplate(params: {
    appName: string;
    setupUrl: string;
    preheader: string;
    recipientName?: string;
    supportEmail: string;
    expiresDays: number;
  }): string {
    const { appName, setupUrl, preheader, recipientName, supportEmail, expiresDays } = params;

    return `<!doctype html>
<html lang="pl">
  <head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${EmailService.escape(appName)} – Zaproszenie</title>
    <style>
      /* Dark mode tweaks dla wspieranych klientów */
      @media (prefers-color-scheme: dark) {
        .wrapper { background-color: #0f172a !important; }
        .card { background-color: #111827 !important; color: #e5e7eb !important; }
        .muted { color: #9ca3af !important; }
        .btn { color: #ffffff !important; }
      }
      a { color: #0ea5e9; text-decoration: none; }
      .btn:hover { filter: brightness(0.95); }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;">
    <!-- preheader (ukryty) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${EmailService.escape(preheader)}
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="wrapper" style="background:#f3f4f6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
            <tr>
              <td style="padding:0 12px 24px 12px; text-align:center;">
                <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',Arial,'Noto Sans',sans-serif;font-size:20px;font-weight:700;color:#111827;">
                  ${EmailService.escape(appName)}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="card" style="background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
                  <tr>
                    <td style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',Arial,'Noto Sans',sans-serif;color:#111827;">
                      <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.3;">${recipientName ? `Cześć ${EmailService.escape(recipientName)}!` : "Cześć!"}</h1>

                      <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;">
                        Otrzymałeś zaproszenie do <strong>${EmailService.escape(appName)}</strong>.
                        Kliknij poniższy przycisk, aby ustawić hasło i dokończyć konfigurację konta.
                      </p>

                      <div style="text-align:center;margin:24px 0;">
                        <!-- button -->
                        <a
                          href="${EmailService.escape(setupUrl)}"
                          class="btn"
                          style="display:inline-block;background:#0ea5e9;color:#ffffff;font-weight:700;padding:12px 20px;border-radius:999px;"
                        >
                          Ustaw hasło i dołącz
                        </a>
                      </div>

                      <p class="muted" style="margin:0 0 12px 0;font-size:13px;line-height:1.6;color:#6b7280;">
                        Link wygaśnie po ${expiresDays} dniach od momentu otrzymania wiadomości.
                      </p>

                      <p style="margin:16px 0 8px 0;font-size:13px;line-height:1.6;">
                        Jeśli przycisk nie działa, skopiuj i wklej ten adres w przeglądarce:
                      </p>

                      <p style="word-break:break-all;margin:0 0 16px 0;font-size:12px;color:#374151;">
                        <a href="${EmailService.escape(setupUrl)}" style="color:#0ea5e9;">${EmailService.escape(setupUrl)}</a>
                      </p>

                      <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />

                      <p style="margin:0 0 8px 0;font-size:13px;line-height:1.6;">
                        Nie spodziewałeś się tej wiadomości? Po prostu ją zignoruj.
                      </p>
                      <p style="margin:0;font-size:13px;line-height:1.6;">
                        Masz pytania? Napisz do nas: <a href="mailto:${EmailService.escape(
                          supportEmail
                        )}">${EmailService.escape(supportEmail)}</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="text-align:center;padding:16px 12px;">
                <p class="muted" style="margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',Arial,'Noto Sans',sans-serif;font-size:12px;color:#6b7280;">
                  © ${new Date().getFullYear()} ${EmailService.escape(appName)} — Wszelkie prawa zastrzeżone
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  }

  private static escape(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}
