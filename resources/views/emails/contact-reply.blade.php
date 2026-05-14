<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réponse à votre message · UniConnect</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f1f5f9;padding:32px 0;">
    <tr>
        <td align="center">

            {{-- Logo --}}
            <table width="570" cellpadding="0" cellspacing="0" role="presentation" style="max-width:570px;width:100%;margin-bottom:20px;">
                <tr>
                    <td align="center" style="padding:0 0 16px 0;">
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
                   style="max-width:570px;width:100%;background:#fff;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(37,99,235,0.07);overflow:hidden;">

                {{-- Top gradient bar --}}
                <tr>
                    <td style="height:5px;background:linear-gradient(90deg,#2563eb,#4f46e5,#7c3aed);"></td>
                </tr>

                {{-- Body --}}
                <tr>
                    <td style="padding:36px 40px 32px;">

                        {{-- Reply icon badge --}}
                        <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
                            <tr>
                                <td style="background:linear-gradient(135deg,#eff6ff,#eef2ff);border-radius:14px;padding:14px 18px;border:1px solid #dbeafe;">
                                    <table cellpadding="0" cellspacing="0" role="presentation">
                                        <tr>
                                            <td style="padding-right:12px;vertical-align:middle;">
                                                <div style="width:40px;height:40px;background:linear-gradient(135deg,#2563eb,#4f46e5);border-radius:10px;display:flex;align-items:center;justify-content:center;text-align:center;line-height:40px;">
                                                    <span style="font-size:20px;">💬</span>
                                                </div>
                                            </td>
                                            <td style="vertical-align:middle;">
                                                <p style="margin:0;font-size:13px;font-weight:700;color:#1e40af;">Réponse de l'équipe UniConnect</p>
                                                <p style="margin:4px 0 0;font-size:11px;color:#64748b;">Support · Plateforme académique</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        {{-- Greeting --}}
                        <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.3px;">
                            Bonjour {{ $recipientName }} 👋
                        </p>
                        <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.6;">
                            L'équipe UniConnect a répondu à votre message. Voici la réponse :
                        </p>

                        {{-- Reply body --}}
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
                            <tr>
                                <td style="background:#f8fafc;border-left:4px solid #2563eb;border-radius:0 12px 12px 0;padding:20px 22px;">
                                    <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:1px;">Réponse de l'équipe</p>
                                    <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.75;white-space:pre-line;">{{ $replyBody }}</p>
                                </td>
                            </tr>
                        </table>

                        {{-- Divider --}}
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
                            <tr>
                                <td style="border-top:1px dashed #e2e8f0;padding-top:20px;">
                                    <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Votre message original</p>
                                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;font-style:italic;white-space:pre-line;">{{ $originalMessage }}</p>
                                </td>
                            </tr>
                        </table>

                        {{-- CTA --}}
                        <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
                            <tr>
                                <td style="border-radius:12px;background:linear-gradient(135deg,#2563eb,#4f46e5);">
                                    <a href="{{ config('app.url') }}/contact"
                                       style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:0.2px;">
                                        Répondre ou contacter l'équipe →
                                    </a>
                                </td>
                            </tr>
                        </table>

                        {{-- Note --}}
                        <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
                            Vous recevez cet email car vous avez soumis un message via le formulaire de contact UniConnect.<br>
                            Ne répondez pas directement à cet email — utilisez le formulaire sur la plateforme.
                        </p>

                    </td>
                </tr>

                {{-- Footer --}}
                <tr>
                    <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 40px;text-align:center;">
                        <p style="margin:0;font-size:11px;color:#94a3b8;">
                            © {{ date('Y') }} UniConnect · Plateforme académique éthique · Conforme RGPD
                        </p>
                    </td>
                </tr>
            </table>

        </td>
    </tr>
</table>

</body>
</html>
