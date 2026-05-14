<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'body' => ['required', 'string', 'max:5000'],
        ]);

        ContactMessage::create($data);

        $to = config('contact.mail_to');
        if (is_string($to) && $to !== '') {
            try {
                Mail::to($to)->send(new ContactFormMail(
                    $data['name'],
                    $data['email'],
                    $data['body'],
                ));
            } catch (\Throwable $e) {
                Log::error('contact.mail_failed', [
                    'message' => $e->getMessage(),
                    'to' => $to,
                ]);
            }
        }

        return back()->with('success', 'Message envoyé. L’équipe UniConnect vous répondra bientôt.');
    }

    /**
     * Message au super admin, libellé « anonyme » vis-à-vis des autres utilisateurs (traçage interne modération user_id).
     */
    public function storeAnonymous(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $user = $request->user();
        $email = 'a'.$user->id.'@anonyme.uniconnect';

        ContactMessage::create([
            'name' => 'Anonyme',
            'email' => $email,
            'body' => $data['body'],
            'user_id' => $user->id,
            'is_anonymous' => true,
        ]);

        $to = config('contact.mail_to');
        if (is_string($to) && $to !== '') {
            $mailBody = $data['body']."\n\n[Message anonyme — compte n°{$user->id} — e-mail inscrit : {$user->email}]";
            try {
                Mail::to($to)->send(new ContactFormMail('Anonyme (dashboard)', $user->email, $mailBody));
            } catch (\Throwable $e) {
                Log::error('contact.anonymous_mail_failed', [
                    'message' => $e->getMessage(),
                    'to' => $to,
                ]);
            }
        }

        return back()->with('success', 'Votre message a été transmis en mode anonyme au super administrateur.');
    }

    /**
     * Message libre vers le super admin — ouvert à tous (connectés ou non), sans champs identité.
     */
    public function storeOpen(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $user = $request->user();
        $token = bin2hex(random_bytes(6));
        $email = "open+{$token}@visiteurs.uniconnect";

        ContactMessage::create([
            'name' => 'Message ouvert',
            'email' => $email,
            'body' => $data['body'],
            'user_id' => $user?->id,
            'is_anonymous' => true,
        ]);

        $to = config('contact.mail_to');
        if (is_string($to) && $to !== '') {
            $prefix = $user
                ? "Message ouvert (compte n°{$user->id} — {$user->email})"
                : 'Message ouvert (visiteur, sans compte)';
            $mailBody = $data['body']."\n\n[{$prefix}]";
            $reply = $user?->email;
            try {
                if ($reply) {
                    Mail::to($to)->send(new ContactFormMail('Message ouvert', $reply, $mailBody));
                } else {
                    Mail::to($to)->send(new ContactFormMail('Message ouvert (visiteur)', 'noreply@uniconnect.local', $mailBody));
                }
            } catch (\Throwable $e) {
                Log::error('contact.open_failed', [
                    'message' => $e->getMessage(),
                    'to' => $to,
                ]);
            }
        }

        return back()->with('success', 'Votre message a bien été transmis à l’équipe de direction.');
    }
}
