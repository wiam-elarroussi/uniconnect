<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #1e293b;">
    <p>Bonjour {{ $user->name }},</p>
    <p>Votre compte <strong>{{ config('app.name') }}</strong> est prêt. Vous pouvez vous connecter à tout moment avec votre adresse institutionnelle.</p>
    <p>À bientôt sur le réseau.</p>
</body>
</html>
