<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $recipientName,
        public string $replyBody,
        public string $originalMessage,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[UniConnect] Réponse à votre message',
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.contact-reply',
            text: 'emails.contact-reply-text',
        );
    }
}
