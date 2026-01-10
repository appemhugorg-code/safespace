
# 🧠 SafeSpace AI Development Docs

This folder provides full project context for **Kiro** and other spec-driven AI tools.

## 📄 Documents

| File | Description |
|------|--------------|
| `safespace-spec.yaml` | Formal specification for app architecture (roles, models, APIs, dashboards). |
| `SafeSpace-UseCases.pdf` | User scenario document defining onboarding, mood tracking, and child–parent–therapist workflows. |
| `branding.md` | Defines SafeSpace’s visual and emotional identity (colors, tone, imagery). |
| `ai-context.md` | Provides guidance for AI tools on how to interpret the spec and generate code consistently. |

---

## 🧭 Usage Guide (for AI Agents)

When initializing a project in **Kiro**, **Cursor**, or **Claude Artifacts**, include this in your command or context:

> Use all documents in `/docs` to generate or modify SafeSpace’s codebase.  
> Prioritize structural data from `safespace-spec.yaml` and user flow behavior from `SafeSpace-UseCases.pdf`.  
> Maintain design alignment with `branding.md`.

---

## 💡 Example Initialization Prompt

```
Analyze the contents of the /docs directory to fully understand SafeSpace.
Generate backend (Laravel 12) and frontend (React + ShadCN + Tailwind) scaffolds
that respect the role-based logic and user flows defined in the spec and use-case PDF.
```
