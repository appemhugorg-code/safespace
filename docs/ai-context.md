
# 🤖 AI Context for Kiro / Cursor

## Purpose
Guide AI-based generation so that SafeSpace remains both technically correct and emotionally aligned with its purpose.

## Interpretation Priorities
1. Follow `safespace-spec.yaml` for backend structure and role logic.
2. Follow `SafeSpace-UseCases.pdf` for user journeys.
3. Use `branding.md` for UI styling and color direction.

## Code Conventions
- Backend: Laravel 12, Livewire 3 optional, Spatie Roles + Permissions.
- Frontend: React 18 +, ShadCN UI, TailwindCSS 3 +, TypeScript.
- Folder structure should maintain clear separation between roles (admin, therapist, guardian, child).

## Output Expectations
- Generate migrations, models, and controllers that match the YAML spec.
- Build React pages using ShadCN components for each dashboard.
- Add minimal, consistent UX elements (spinners, cards, alerts).
