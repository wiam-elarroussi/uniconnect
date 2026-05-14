<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $selectedUserId = (int) $request->query('user_id');
        $selectedConversationId = (int) $request->query('conversation_id');

        $visibleContactsScope = function ($q) use ($user) {
            $q->whereHas('followers', fn ($f) => $f->where('follower_id', $user->id))
                ->orWhereExists(function ($sub) use ($user) {
                    $sub->select(DB::raw(1))
                        ->from('conversations')
                        ->whereColumn('conversations.university_id', 'users.university_id')
                        ->where('conversations.type', 'direct')
                        ->where(function ($m) use ($user) {
                            $m->where(function ($a) use ($user) {
                                $a->where('conversations.user_one_id', $user->id)
                                    ->whereColumn('conversations.user_two_id', 'users.id');
                            })->orWhere(function ($b) use ($user) {
                                $b->where('conversations.user_two_id', $user->id)
                                    ->whereColumn('conversations.user_one_id', 'users.id');
                            });
                        });
                });
        };

        $contacts = User::where('university_id', $user->university_id)
            ->where('id', '!=', $user->id)
            ->where($visibleContactsScope)
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'avatar_path', 'avatar_builder']);

        foreach ($contacts as $c) {
            $conv = Conversation::where('university_id', $user->university_id)
                ->where('type', 'direct')
                ->where(function ($q) use ($user, $c) {
                    $q->where(function ($q2) use ($user, $c) {
                        $q2->where('user_one_id', $user->id)->where('user_two_id', $c->id);
                    })->orWhere(function ($q2) use ($user, $c) {
                        $q2->where('user_one_id', $c->id)->where('user_two_id', $user->id);
                    });
                })
                ->first();

            $c->last_message = $conv?->messages()->latest()->first();
            $c->unread_count = $conv
                ? Message::where('conversation_id', $conv->id)
                    ->where('sender_id', '!=', $user->id)
                    ->whereNull('read_at')
                    ->count()
                : 0;
            $c->conversation_id = $conv?->id;
        }

        $contacts = $contacts->sortByDesc(function ($c) {
            $t = $c->last_message?->created_at?->timestamp ?? 0;

            return ($c->unread_count * 1000000000) + $t;
        })->values();

        $groupConversations = Conversation::query()
            ->where('university_id', $user->university_id)
            ->where('type', 'group')
            ->whereHas('members', fn ($q) => $q->where('user_id', $user->id))
            ->withCount([
                'messages as unread_count' => fn ($q) => $q
                    ->where('sender_id', '!=', $user->id)
                    ->whereNull('read_at'),
            ])
            ->with(['members:id,name'])
            ->get()
            ->map(function (Conversation $g) {
                $g->last_message = $g->messages()->latest()->first();

                return $g;
            })
            ->sortByDesc(function ($g) {
                $t = $g->last_message?->created_at?->timestamp ?? 0;

                return ($g->unread_count * 1000000000) + $t;
            })
            ->values();

        $conversation = null;
        $selectedUser = null;

        if ($selectedConversationId) {
            $conversation = Conversation::where('university_id', $user->university_id)
                ->where('id', $selectedConversationId)
                ->where('type', 'group')
                ->whereHas('members', fn ($q) => $q->where('user_id', $user->id))
                ->first();

            if ($conversation) {
                Message::where('conversation_id', $conversation->id)
                    ->where('sender_id', '!=', $user->id)
                    ->whereNull('read_at')
                    ->update(['read_at' => now()]);

                $conversation->load([
                    'messages' => fn ($q) => $q->oldest(),
                    'messages.sender:id,name',
                    'members:id,name',
                ]);
            }
        } elseif ($selectedUserId) {
            $selectedUser = User::where('university_id', $user->university_id)
                ->where('id', $selectedUserId)
                ->first(['id', 'name', 'email', 'avatar_path', 'avatar_builder']);

            $conversation = Conversation::where('university_id', $user->university_id)
                ->where('type', 'direct')
                ->where(function ($q) use ($user, $selectedUserId) {
                    $q->where(function ($q2) use ($user, $selectedUserId) {
                        $q2->where('user_one_id', $user->id)->where('user_two_id', $selectedUserId);
                    })->orWhere(function ($q2) use ($user, $selectedUserId) {
                        $q2->where('user_one_id', $selectedUserId)->where('user_two_id', $user->id);
                    });
                })
                ->first();

            if ($conversation) {
                Message::where('conversation_id', $conversation->id)
                    ->where('sender_id', '!=', $user->id)
                    ->whereNull('read_at')
                    ->update(['read_at' => now()]);

                $conversation->load([
                    'messages' => fn ($q) => $q->oldest(),
                    'messages.sender:id,name',
                ]);
            }
        }

        $allCampusPeers = User::where('university_id', $user->university_id)
            ->where('id', '!=', $user->id)
            ->where($visibleContactsScope)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('Messages/Index', [
            'contacts' => $contacts,
            'groupConversations' => $groupConversations,
            'selectedUserId' => $selectedUserId ?: null,
            'selectedConversationId' => $selectedConversationId ?: null,
            'selectedUser' => $selectedUser,
            'conversation' => $conversation,
            'campusPeers' => $allCampusPeers,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => ['nullable', 'exists:users,id'],
            'conversation_id' => ['nullable', 'exists:conversations,id'],
            'body' => ['nullable', 'string', 'max:5000'],
            'media' => ['nullable', 'file', 'max:15360', 'mimes:jpeg,jpg,png,gif,webp,mp3,wav,m4a,ogg,aac,webm,opus,flac'],
        ]);

        if (empty($data['receiver_id']) && empty($data['conversation_id'])) {
            throw ValidationException::withMessages([
                'receiver_id' => 'Choisissez un destinataire ou une conversation de groupe.',
            ]);
        }

        if (! empty($data['receiver_id']) && ! empty($data['conversation_id'])) {
            throw ValidationException::withMessages([
                'receiver_id' => 'Envoyez soit un message direct, soit un message de groupe.',
            ]);
        }

        $hasMedia = $request->hasFile('media');
        $body = trim($data['body'] ?? '');
        if (! $hasMedia && $body === '') {
            throw ValidationException::withMessages([
                'body' => 'Écrivez un message ou joignez un fichier.',
            ]);
        }

        /** @var \App\Models\User $sender */
        $sender = Auth::user();

        $contentType = 'text';
        $mediaPath = null;
        if ($hasMedia) {
            $file = $request->file('media');
            $mime = (string) $file->getMimeType();
            if (str_starts_with($mime, 'image/')) {
                $contentType = 'image';
            } elseif (str_starts_with($mime, 'audio/') || $mime === 'video/webm') {
                // video/webm is reported by PHP finfo for WebM containers even when audio-only
                $contentType = 'audio';
            } else {
                throw ValidationException::withMessages(['media' => 'Type de fichier non pris en charge.']);
            }
            $mediaPath = $file->store('message-media', 'public');
        }

        $bodyStored = $body !== '' ? $body : '';

        if (! empty($data['conversation_id'])) {
            return $this->storeGroupMessage($sender, (int) $data['conversation_id'], $bodyStored, $contentType, $mediaPath);
        }

        return $this->storeDirectMessage($sender, (int) $data['receiver_id'], $bodyStored, $contentType, $mediaPath);
    }

    public function storeGroup(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'member_ids' => ['required', 'array', 'min:1'],
            'member_ids.*' => ['integer', 'exists:users,id'],
        ]);

        /** @var \App\Models\User $sender */
        $sender = Auth::user();

        $memberIds = collect($data['member_ids'])
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->filter(fn ($id) => $id !== $sender->id)
            ->values()
            ->all();

        if ($memberIds === []) {
            throw ValidationException::withMessages([
                'member_ids' => 'Ajoutez au moins un autre membre au groupe.',
            ]);
        }

        foreach ($memberIds as $mid) {
            $peer = User::find($mid);
            abort_if(! $peer || $peer->university_id !== $sender->university_id, 403);
        }

        $conversation = Conversation::create([
            'university_id' => $sender->university_id,
            'type' => 'group',
            'title' => $data['name'],
            'created_by' => $sender->id,
            'user_one_id' => $sender->id,
            'user_two_id' => $sender->id,
        ]);

        $conversation->members()->attach(array_values(array_unique(array_merge([$sender->id], $memberIds))));

        foreach ($memberIds as $mid) {
            UserNotification::notifyUser(
                $mid,
                'message',
                'Nouveau groupe',
                $sender->name.' vous a ajouté au groupe « '.$data['name'].' ».',
                ['conversation_id' => $conversation->id, 'actor_id' => $sender->id]
            );
        }

        return redirect()->route('messages.index', ['conversation_id' => $conversation->id]);
    }

    public function destroyDirect(User $peer)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        abort_if($peer->id === $user->id, 403);
        abort_if($peer->university_id !== $user->university_id, 403);

        $conversation = Conversation::where('university_id', $user->university_id)
            ->where('type', 'direct')
            ->where(function ($q) use ($user, $peer) {
                $q->where(function ($q2) use ($user, $peer) {
                    $q2->where('user_one_id', $user->id)->where('user_two_id', $peer->id);
                })->orWhere(function ($q2) use ($user, $peer) {
                    $q2->where('user_one_id', $peer->id)->where('user_two_id', $user->id);
                });
            })
            ->first();

        if ($conversation) {
            $conversation->messages()->delete();
            $conversation->members()->detach();
            $conversation->delete();
        }

        return redirect()->route('messages.index');
    }

    public function destroyGroup(Conversation $conversation)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        abort_if($conversation->university_id !== $user->university_id, 403);
        abort_if($conversation->type !== 'group', 404);
        abort_if(! $conversation->members()->where('user_id', $user->id)->exists(), 403);

        $conversation->messages()->delete();
        $conversation->members()->detach();
        $conversation->delete();

        return redirect()->route('messages.index');
    }

    private function storeDirectMessage(User $sender, int $receiverId, string $body, string $contentType, ?string $mediaPath)
    {
        $receiver = User::findOrFail($receiverId);
        abort_if($receiver->university_id !== $sender->university_id, 403);

        $conversation = Conversation::firstOrCreate(
            [
                'university_id' => $sender->university_id,
                'type' => 'direct',
                'user_one_id' => min($sender->id, $receiver->id),
                'user_two_id' => max($sender->id, $receiver->id),
            ],
            []
        );

        $conversation->members()->syncWithoutDetaching([$sender->id, $receiver->id]);

        $conversation->messages()->create([
            'sender_id' => $sender->id,
            'body' => $body,
            'content_type' => $contentType,
            'media_path' => $mediaPath,
        ]);

        UserNotification::notifyUser(
            $receiver->id,
            'message',
            'Nouveau message',
            $sender->name.' vous a envoyé un message.',
            ['sender_id' => $sender->id]
        );

        return redirect()->route('messages.index', ['user_id' => $receiver->id]);
    }

    private function storeGroupMessage(User $sender, int $conversationId, string $body, string $contentType, ?string $mediaPath)
    {
        $conversation = Conversation::where('id', $conversationId)
            ->where('university_id', $sender->university_id)
            ->where('type', 'group')
            ->firstOrFail();

        abort_if(! $conversation->members()->where('user_id', $sender->id)->exists(), 403);

        $conversation->messages()->create([
            'sender_id' => $sender->id,
            'body' => $body,
            'content_type' => $contentType,
            'media_path' => $mediaPath,
        ]);

        $conversation->load('members');
        foreach ($conversation->members as $member) {
            if ($member->id === $sender->id) {
                continue;
            }
            UserNotification::notifyUser(
                $member->id,
                'message',
                'Groupe : '.$conversation->title,
                $sender->name.' a envoyé un message.',
                ['conversation_id' => $conversation->id, 'actor_id' => $sender->id]
            );
        }

        return redirect()->route('messages.index', ['conversation_id' => $conversation->id]);
    }
}
