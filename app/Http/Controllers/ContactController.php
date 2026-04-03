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
}
