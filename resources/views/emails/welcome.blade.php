<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur UniConnect</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f1f5f9;padding:32px 0;">
    <tr>
        <td align="center">

            {{-- Header --}}
            <table width="570" cellpadding="0" cellspacing="0" role="presentation" style="max-width:570px;width:100%;margin-bottom:24px;">
                <tr>
                    <td align="center" style="padding:0 0 20px 0;">
                        <a href="{{ config('app.url') }}" style="text-decoration:none;display:inline-flex;align-items:center;gap:10px;">
                            <div style="width:38px;height:38px;background:linear-gradient(135deg,#1e40af,#4f46e5);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
                                <span style="color:#fff;font-size:20px;font-weight:900;line-height:1;">U</span>
                            </div>
                            <span style="font-size:22px;font-weight:900;color:#1e293b;letter-spacing:-0.5px;">Uni<span style="color:#2563eb;">Connect</span></span>
                        </a>
                    </td>
                </tr>
            </table>

            {{-- Card --}}
            <table width="570" cellpadding="0" cellspacing="0" role="presentation"
                   style="max-width:570px;width:100%;background:#fff;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(37,99,235,0.07);">

                {{-- Blue top bar --}}
                <tr>
                    <td style="height:5px;background:linear-gradient(90deg,#2563eb,#4f46e5);border-radius:16px 16px 0 0;"></td>
                </tr>

                {{-- Content --}}
                <tr>
                    <td style="padding:40px 40px 32px 40px;">

                        <p style="font-size:28px;margin:0 0 8px 0;">👋</p>
                        <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:700;color:#0f172a;">
                            Bonjour {{ $user->name }},
                        </h1>

                        <p style="margin:0 0 16px 0;font-size:15px;color:#475569;line-height:1.6;">
                            Bienvenue sur <strong style="color:#2563eb;">UniConnect</strong> — le réseau social académique de votre campus.
                            Votre compte est maintenant actif.
                        </p>

                        <p style="margin:0 0 28px 0;font-size:15px;color:#475569;line-height:1.6;">
                            Vous pouvez dès maintenant vous connecter avec votre adresse institutionnelle et rejoindre votre communauté universitaire.
                        </p>

                        {{-- CTA Button --}}
                        <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 28px auto;">
                            <tr>
                                <td align="center" style="border-radius:8px;background:#2563eb;">
                                    <a href="{{ config('app.url') }}/login"
                                       style="display:inline-block;padding:12px 32px;font-size:15px;font-weight:600;color:#fff;text-decoration:none;border-radius:8px;letter-spacing:0.2px;">
                                        Se connecter →
                                    </a>
                                </td>
                            </tr>
                        </table>

                        {{-- Features --}}
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                               style="background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:8px;">
                            <tr>
                                <td style="padding:20px 24px;">
                                    <p style="margin:0 0 12px 0;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Ce qui vous attend</p>
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding:5px 0;font-size:14px;color:#334155;">📰 &nbsp;Fil d'actualités académique</td>
                                            <td style="padding:5px 0;font-size:14px;color:#334155;">💬 &nbsp;Messagerie directe & groupes</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:5px 0;font-size:14px;color:#334155;">📡 &nbsp;Canaux par filière</td>
                                            <td style="padding:5px 0;font-size:14px;color:#334155;">📚 &nbsp;Bibliothèque de ressources</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>

                {{-- Footer --}}
                <tr>
                    <td style="padding:20px 40px;border-top:1px solid #f1f5f9;text-align:center;">
                        <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                            Vous recevez cet email car vous venez de créer un compte UniConnect.<br>
                            © {{ date('Y') }} <strong style="color:#2563eb;">UniConnect</strong> · Plateforme académique éthique · Conforme RGPD
                        </p>
                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>
