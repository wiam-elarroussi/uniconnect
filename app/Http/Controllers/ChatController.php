<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function message(Request $request): JsonResponse
    {
        $user = Auth::user();
        abort_if(! $user, 403);

        $request->validate([
            'message' => ['nullable', 'string', 'max:8000'],
            'image' => ['nullable', 'image', 'max:8192'],
        ]);

        if (! $request->filled('message') && ! $request->hasFile('image')) {
            return response()->json(['error' => 'Message ou image requis.'], 422);
        }

        $key = self::normalizeOpenAiKey((string) config('services.openai.key'));
        if ($key === '') {
            return response()->json([
                'reply' => 'L’assistant IA n’est pas configuré. Ajoutez OPENAI_API_KEY dans le fichier .env du serveur (clé API OpenAI).',
                'configured' => false,
            ]);
        }

        $system = 'Tu es l’assistant UniConnect, réseau social étudiant académique et éthique. Réponds en français, de façon concise, bienveillante et utile (cours, organisation, vie étudiante). Ne donne pas de contenus illégaux ou nuisibles.';

        $hasImage = $request->hasFile('image');

        // Texte seul : `content` en chaîne (meilleure compatibilité API). Avec image : tableau multimodal.
        if (! $hasImage) {
            $messages = [
                ['role' => 'system', 'content' => $system],
                ['role' => 'user', 'content' => (string) $request->input('message')],
            ];
        } else {
            $userContent = [];

            if ($request->filled('message')) {
                $userContent[] = ['type' => 'text', 'text' => $request->input('message')];
            }

            $file = $request->file('image');
            $b64 = base64_encode((string) $file->getContent());
            $mime = $file->getMimeType() ?: 'image/jpeg';
            $userContent[] = [
                'type' => 'image_url',
                'image_url' => [
                    'url' => 'data:'.$mime.';base64,'.$b64,
                ],
            ];
            if (! $request->filled('message')) {
                $userContent[] = ['type' => 'text', 'text' => 'Décris cette image ou réponds à une question visuelle si l’utilisateur n’a pas écrit de texte.'];
            }

            $messages = [
                ['role' => 'system', 'content' => $system],
                ['role' => 'user', 'content' => $userContent],
            ];
        }

        try {
            $response = Http::withToken($key)
                ->timeout(90)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o-mini',
                    'messages' => $messages,
                    'max_tokens' => 1200,
                ]);

            if (! $response->successful()) {
                return response()->json([
                    'reply' => self::friendlyOpenAiError($response->body()),
                    'error' => true,
                ], 502);
            }

            $reply = data_get($response->json(), 'choices.0.message.content', 'Réponse vide.');

            return response()->json(['reply' => trim((string) $reply), 'configured' => true]);
        } catch (\Throwable $e) {
            return response()->json([
                'reply' => 'Impossible de joindre le service IA pour le moment. Réessayez plus tard.',
                'error' => true,
            ], 503);
        }
    }

    /**
     * Nettoie la clé (.env : guillemets, BOM, préfixe Bearer, espaces).
     */
    public static function normalizeOpenAiKey(string $key): string
    {
        $key = trim($key);
        $key = preg_replace('/^\xEF\xBB\xBF/', '', $key) ?? $key;
        $key = trim($key, " \t\n\r\x0B\"'");

        if (preg_match('/^Bearer\s+/i', $key)) {
            $key = (string) preg_replace('/^Bearer\s+/i', '', $key);
        }

        return trim($key);
    }

    /**
     * Message lisible pour l’utilisateur (évite d’afficher le JSON brut OpenAI).
     */
    private static function friendlyOpenAiError(string $body): string
    {
        $json = json_decode($body, true);
        $code = is_array($json) ? data_get($json, 'error.code') : null;
        $type = is_array($json) ? data_get($json, 'error.type') : null;
        $detail = is_array($json) ? (string) data_get($json, 'error.message', '') : '';
        $detail = trim($detail);

        if ($code === 'insufficient_quota' || $type === 'insufficient_quota') {
            return 'Le quota OpenAI de ce service est épuisé ou la facturation n’est pas activée sur le compte API. '
                .'L’administrateur doit vérifier le solde et la facturation sur https://platform.openai.com/account/billing';
        }

        $suffix = $detail !== '' ? ' Détail technique : '.$detail : '';

        return match ($code) {
            'invalid_api_key' => 'OpenAI refuse la clé API utilisée par le serveur (clé incorrecte, révoquée, ou pas celle du compte qui paie). '
                .'Vérifie OPENAI_API_KEY dans .env sans guillemets ni « Bearer », puis exécute : php artisan config:clear'
                .$suffix,
            'rate_limit_exceeded' => 'Trop de requêtes vers l’IA en ce moment. Réessaie dans une minute.'.$suffix,
            'context_length_exceeded' => 'Ton message (ou l’image) est trop volumineux pour le modèle. Raccourcis le texte ou envoie une image plus légère.'.$suffix,
            default => ($detail !== ''
                ? 'L’assistant IA a renvoyé une erreur. '.$detail
                : 'L’assistant IA est temporairement indisponible. Si le problème continue, contacte l’équipe UniConnect.'),
        };
    }
}
