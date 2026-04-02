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
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'avatar' => ['nullable', 'image', 'max:4096'],
            'avatar_builder' => ['nullable', 'array'],
            // Couleurs
            'avatar_builder.skin' => ['nullable', 'string', 'max:32'],
            'avatar_builder.hair' => ['nullable', 'string', 'max:32'],
            'avatar_builder.top' => ['nullable', 'string', 'max:32'],
            'avatar_builder.bottom' => ['nullable', 'string', 'max:32'],
            'avatar_builder.eyeColor' => ['nullable', 'string', 'max:32'],
            'avatar_builder.accent' => ['nullable', 'string', 'max:32'],
            'avatar_builder.lipColor' => ['nullable', 'string', 'max:32'],
            'avatar_builder.facialHairColor' => ['nullable', 'string', 'max:32'],
            // Styles
            'avatar_builder.preset' => ['nullable', 'string', 'max:32'],
            'avatar_builder.expression' => ['nullable', 'string', 'max:32'],
            'avatar_builder.eyeShape' => ['nullable', 'string', 'max:32'],
            'avatar_builder.hairStyle' => ['nullable', 'string', 'max:32'],
            'avatar_builder.topStyle' => ['nullable', 'string', 'max:32'],
            'avatar_builder.bottomStyle' => ['nullable', 'string', 'max:32'],
            'avatar_builder.accessory' => ['nullable', 'string', 'max:32'],
            'avatar_builder.nose' => ['nullable', 'string', 'max:32'],
            'avatar_builder.facialHair' => ['nullable', 'string', 'max:32'],
            'avatar_builder.skinDetails' => ['nullable', 'string', 'max:32'],
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
