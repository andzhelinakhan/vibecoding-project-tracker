# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · fill in the **`<TODO>`** sections before you tag `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

Focused and simplistic to allow the users to stay organised.


Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):


- `<TODO>`
- `<TODO>`
- `<TODO>`

Anti-references — what we are explicitly **not** trying to look like:

- `<TODO>`

Cluttered websites

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#323232` | Header, "+" button, focus rings |
| `brand-accent` | `#0F766E` | Highlights, hover states, links |
| `surface-page` | `#F5F0EC` | Page background |
| `surface-card` | `#FFFFFF` | Card background |
| `surface-column` | `#DDD0C8` | Kanban column backgrounds and borders |
| `text-primary` | `#232323` | Body text |
| `text-muted` | `#5E5750` | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `<TODO>` | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | `<TODO>` | Cards tagged `bug` (accent stripe + icon) |


### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#DCE9E4` | More than 2 days out |
| `due-warning` | `#F6E3B4` | Less than 24 hours |
| `due-overdue` | `#F3CFC6` | Past due |
| `due-neutral` | `#E9E4DF` | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | Inter | Clean and neutral, very legible at small sizes. |
| Body | Inter | One family keeps the interface consistent and professional. |
| Monospace (tags, badges, code) | JetBrains Mono | Makes task IDs, tags and prompts easy to tell apart. |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** White with a 1px light border and a thin coloured stripe for task type; shadow only on hover.
- **Buttons:** Solid dark grey fill, no gradient, consistent padding, rounded-md.
- **Modal:** Centered, max-width-md, dark grey backdrop at 50% opacity, one place for create, edit and delete.
- **Empty states:** Dashed beige border and muted text, short and neutral.
- **Drag affordance (if used):** None — we use a status dropdown.

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | Add task |
| Empty column placeholder | No tasks yet |
| Toast after "Copy as Prompt Context" | Copied to clipboard. |
| Confirm-delete message | Delete this task? This can't be undone. |
| Handoff toast (M7 `task-owner`) | Reassigned to {name}. |


## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** `ProjectTracker` (match PRD §11 team identity)
- **Wordmark style:** `Just the name in Inter semibold, brand-primary color, no icon` (e.g. "Just the name in the heading font, brand-primary color, no icon.")

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
