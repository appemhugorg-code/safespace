<?php

namespace App\Http\Requests;

use App\Services\GroupPermissionService;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGroupRequest extends FormRequest
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
        $groupId = $this->route('group')->id;

        return [
            'name' => 'sometimes|required|string|max:255|unique:groups,name,'.$groupId,
            'description' => 'sometimes|nullable|string|max:1000',
            'is_active' => 'sometimes|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Group name is required.',
            'name.unique' => 'A group with this name already exists.',
        ];
    }
}
