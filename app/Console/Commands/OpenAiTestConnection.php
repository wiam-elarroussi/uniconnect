<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class OpenAiTestConnection extends Command
{
    protected $signature = 'openai:test';

    protected $description = 'Vérifie que OPENAI_API_KEY est lue et acceptée par api.openai.com (ne affiche pas la clé)';

    public function handle(): int
    {
        $raw = (string) config('services.openai.key');
        $key = \App\Http\Controllers\ChatController::normalizeOpenAiKey($raw);

        if ($key === '') {
            $this->error('Aucune clé : OPENAI_API_KEY vide dans .env ou config/services.php.');
            $this->line('→ Ajoute la clé puis : php artisan config:clear');

            return self::FAILURE;
        }

        $this->line('Longueur de la clé (caractères) : '.strlen($key));
        $this->line('Préfixe : '.substr($key, 0, 7).'…');

        $models = Http::withToken($key)
            ->timeout(45)
            ->get('https://api.openai.com/v1/models');

        if (! $models->successful()) {
            $this->error('Échec HTTP '.$models->status().' (liste des modèles).');
            $this->line($this->formatOpenAiBody($models));

            return self::FAILURE;
        }

        $this->info('Étape 1 OK — la clé est reconnue (GET /v1/models).');
        $this->newLine();
        $this->line('Étape 2 — test du même usage que le chatbot (POST /v1/chat/completions, gpt-4o-mini)…');

        $chat = Http::withToken($key)
            ->timeout(60)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'user', 'content' => 'Réponds uniquement par : ok'],
                ],
                'max_tokens' => 8,
            ]);

        if ($chat->successful()) {
            $this->info('Étape 2 OK — le compte peut appeler le modèle de chat. Le chatbot dans l’app devrait fonctionner.');
            $this->line('Si l’interface web affiche encore une erreur : php artisan config:clear puis redémarre php artisan serve / le serveur web.');

            return self::SUCCESS;
        }

        $this->error('Échec HTTP '.$chat->status().' (chat completions).');
        $this->line($this->formatOpenAiBody($chat));
        $this->newLine();
        $this->warn('Souvent : la clé est valide mais le compte n’a pas de crédit / facturation pour l’usage API.');
        $this->line('→ https://platform.openai.com/account/billing (moyen de paiement, limite mensuelle, crédits)');
        $this->line('Note : GET /v1/models peut réussir même quand les complétions sont refusées pour quota.');

        return self::FAILURE;
    }

    private function formatOpenAiBody(\Illuminate\Http\Client\Response $response): string
    {
        $body = $response->json();
        if (is_array($body)) {
            return (string) (data_get($body, 'error.message') ?: json_encode($body));
        }

        return substr($response->body(), 0, 500);
    }
}
