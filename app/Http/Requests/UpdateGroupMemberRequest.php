<?php

namespace App\Http\Requests;

use App\Services\GroupPermissionService;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGroupMemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $group = $this->route('group');
        $permissionService = app(GroupPermissionService::class);

        return $this->user() && $permissionService->canManageGroup($this->user(), $group);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'role' => 'required|in:member,admin',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $group = $this->route('group');
            $user = $this->route('user');

            // Check if user is a member of the group
            if (! $group->hasMember($user)) {
                $validator->errors()->add('user', 'User is not a member of this group.');
            }

            // Prevent removing the last admin (unless user is system admin)
            if ($this->role === 'member' && $group->hasAdmin($user)) {
                $adminCount = $group->admins()->count();
                if ($adminCount <= 1 && ! $this->user()->hasRole('admin')) {
                    $validator->errors()->add('role', 'Cannot demote the last admin of the group.');
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
            'role.required' => 'Role is required.',
            'role.in' => 'Role must be either member or admin.',
        ];
    }
}
