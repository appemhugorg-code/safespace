<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Services\GroupPermissionService;
use Illuminate\Foundation\Http\FormRequest;

class AddGroupMemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $group = $this->route('group');
        $permissionService = app(GroupPermissionService::class);

        return $this->user() && $permissionService->canAddMembers($this->user(), $group);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'role' => 'sometimes|in:member,admin',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $group = $this->route('group');
            $userToAdd = User::find($this->user_id);
            $permissionService = app(GroupPermissionService::class);

            if ($userToAdd) {
                // Check if user is already a member
                if ($group->hasMember($userToAdd)) {
                    $validator->errors()->add('user_id', 'User is already a member of this group.');
                }

                // Check if the current user can add this specific user
                if (! $permissionService->canAddUserToGroup($this->user(), $userToAdd, $group)) {
                    $validator->errors()->add('user_id', 'You cannot add this user to the group.');
                }
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'User ID is required.',
            'user_id.exists' => 'The selected user does not exist.',
            'role.in' => 'Role must be either member or admin.',
        ];
    }
}
