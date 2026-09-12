# HackRice26 Design System

## Visual thesis

The product should feel like a friendly, modern SaaS workspace: vivid violet controls on a warm cream canvas, a restrained dot grid, and rounded, welcoming typography. The UI is boxy and purposeful without feeling rigid, clinical, or intimidating.

## Core principles

1. **Product first.** Put the user’s task, controls, and results in the first viewport. Avoid marketing-style hero sections inside the app.
2. **Use hierarchy before containers.** Separate content with spacing, typography, alignment, and rules. Add a card only when a group needs a distinct boundary or interaction context.
3. **Keep geometry crisp.** Buttons, fields, menus, panels, and cards use square corners. Avoid pills except for statuses or compact tags where the shape carries meaning.
4. **Stay proportional.** Use a 4px spacing grid, consistent control heights, and balanced padding. Dense interfaces should still have clear breathing room.
5. **Make one action dominant.** Use vivid violet for the main action and reserve strong color for meaningful states.
6. **Keep the tone welcoming.** Rounded type, plain language, and warm supporting colors should make focused work feel approachable rather than severe.

## Color system

| Role | Token | Light value | Usage |
| --- | --- | --- | --- |
| App background | `--background` | `#fbf7ed` | Root canvas and page background |
| Main text | `--foreground` | `#271a38` | Body copy and headings |
| Primary | `--primary` | `#5003c0` | Main actions, active navigation, key emphasis |
| Primary text | `--primary-foreground` | `#fffaf0` | Text and icons on violet |
| Surface | `--card` | `#fffdf7` | Elevated or bounded working regions only |
| Secondary | `--secondary` | `#eee7fb` | Secondary actions and subtle selected states |
| Muted | `--muted` | `#f0e9df` | Quiet regions, disabled states, separators |
| Border | `--border` | `#d6cce3` | Structural borders and dividers |
| Focus ring | `--ring` | `#7a3ee0` | Keyboard focus and field emphasis |
| Destructive | `--destructive` | `#b42318` | Destructive actions and critical errors |

`#5003c0` is the brand anchor. Cream should occupy most of the screen, while vivid violet should be concentrated in navigation, primary controls, and important data. Soft lilac supports selected and secondary states. Avoid adding unrelated accent colors; use the chart tokens for data visualization only.

## Root background

Apply `.bg-dot-pattern` to the root `<body>`. It layers a subtle violet dot grid over the cream `--background` color. The pattern is ambient structure, not decoration: keep its contrast low and do not place another competing page-wide texture or gradient above it.

Working surfaces may use an opaque `bg-background`, `bg-card`, or `bg-popover` when content needs maximum legibility. Do not wrap the entire page in a card just to hide the pattern.

## Geometry and borders

- Global radius is `0`; interactive and structural elements are square.
- Default borders are 1px and use `--border`.
- Use shadows sparingly. Prefer a border or a 2–3px violet offset shadow for a single high-attention element.
- Status badges may use a small radius or pill shape, but regular buttons must remain square.
- Do not nest cards inside cards unless the inner region has an independent action or state.

## Spacing and layout

- Base unit: 4px.
- Related inline items: 8px gap.
- Control groups: 12–16px gap.
- Section padding: 20–24px on desktop, 16px on small screens.
- Major page regions: 32–48px apart.
- Main content should use a consistent max width when appropriate, while dashboards and workspaces may use the full available width.
- Align labels, fields, and actions to a shared grid. Avoid arbitrary one-off widths and padding values.

## Typography

- Nunito is the default interface typeface. Its rounded shapes keep instructions, labels, and controls warm and readable.
- Fredoka is the heading typeface. Use it for `h1`–`h3` with confident weights, but avoid cartoonish sizing or excessive letter spacing.
- Utility text, IDs, timestamps, and compact data also use Nunito so the interface never shifts into a harsh technical tone.
- Body copy is at least 16px. Frequently used labels and controls are at least 14px.
- Headings should be compact, upbeat, and confident, with moderate-to-bold weight—not oversized marketing typography.
- Use sentence case for headings, labels, and buttons.

## Components

### Buttons

- Primary: `#5003c0` fill, cream label, square corners.
- Secondary: soft lilac fill with deep-violet text.
- Outline: transparent or cream fill with a visible structural border.
- Keep button labels specific and short. Most forms should have one primary button.
- Use consistent heights: 40px default, 36px compact, and 44px large.

### Fields

- Use cream or surface-colored inputs with a visible gray-blue border.
- Labels sit above fields unless horizontal alignment clearly improves a dense workflow.
- Focus uses the violet `--ring`; errors use `--destructive` and include text, not color alone.

### Cards and panels

- A card must group information that belongs together and benefits from a boundary.
- Prefer one main working surface plus dividers over a grid of small cards.
- Avoid decorative stat cards when the same information reads better as a compact row, table, or summary strip.

### Navigation

- Keep navigation compact and stable.
- Show the active destination with violet text, fill, or a strong left/bottom rule.
- Avoid oversized logos, excessive empty chrome, and redundant navigation labels.

## Motion and interaction

- Transitions should be quick and functional: 120–180ms for color, border, and small position changes.
- Avoid floating, bouncing, or large entrance animations in core workflows.
- Every interactive element needs a clear hover, focus-visible, active, and disabled state.

## Review checklist

- The cream canvas and violet dot pattern are visible at the root.
- Primary actions use `#5003c0` and are visually dominant without overwhelming the page.
- Nunito body text and Fredoka headings make the product feel rounded and friendly.
- Buttons and standard components are square.
- Spacing follows the 4px grid and controls use consistent heights.
- The first viewport exposes the actual product workflow.
- Cards are used only where a real boundary is needed.
- Text remains readable and controls remain usable at narrow widths and 200% text zoom.
