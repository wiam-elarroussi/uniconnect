<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Rules\ValidDisplayName;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', new ValidDisplayName],
            'bio' => ['nullable', 'string', 'max:280'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'avatar' => ['nullable', 'image', 'max:4096'],
            'avatar_builder' => ['nullable'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $raw = $this->input('avatar_builder');
        if (is_string($raw) && $raw !== '') {
            $decoded = json_decode($raw, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $this->merge(['avatar_builder' => $decoded]);
            }
        }
    }
}
