# Migration Guide

This guide covers breaking changes and required migration steps when upgrading between versions of `@exotel-npm-dev/signal-design-system`.

## How this file is organized

Each version that requires migration steps has its own section below, listed in reverse chronological order (newest first). Each section includes:

- **What changed** — a summary of the breaking change
- **Before / After** — code examples showing the old and new usage
- **Steps** — a checklist of actions to take when upgrading

---

## v1.1.0

### 1. `TextField` — Signal wrapper replaces MUI re-export; `EnhancedTextField` renamed

**What changed:** The package root now exports Signal’s labeled text field as `TextField` (the former `EnhancedTextField` implementation). That export overrides the MUI `TextField` previously re-exported from `@mui/material`.

- `EnhancedTextField` remains as a deprecated alias that forwards to `TextField`.
- Call sites that already used `EnhancedTextField` keep working; rename when convenient.
- Call sites that imported `TextField` expecting **raw MUI** behavior (floating label, `variant`, no `FieldWrapper`) must migrate to the Signal API.

**Before (v1.0.19) — Signal field:**

```tsx
import { EnhancedTextField } from '@exotel-npm-dev/signal-design-system';

<EnhancedTextField label="Email" />
```

**After (v1.1.0):**

```tsx
import { TextField } from '@exotel-npm-dev/signal-design-system';

<TextField label="Email" />
```

**Before (v1.0.19) — MUI `TextField` from the package:**

```tsx
import { TextField } from '@exotel-npm-dev/signal-design-system';

<TextField label="Email" variant="outlined" />
```

**After (v1.1.0) — use Signal `TextField` (recommended):**

```tsx
import { TextField } from '@exotel-npm-dev/signal-design-system';

// External label via FieldWrapper; `variant` is not supported (outlined only)
<TextField label="Email" showLabel />
```

**Steps:**

- [ ] Replace `EnhancedTextField` / `EnhancedTextFieldProps` with `TextField` / `TextFieldProps`
- [ ] Search for `import { TextField }` from the package — confirm each usage matches Signal props (`showLabel`, no `variant`, `size` may be `large`, placeholder may auto-derive from `label`)
- [ ] Remove unsupported MUI-only props (`variant`, floating-label-only patterns) or switch to `FormField` where a lighter outlined input is enough
- [ ] Prefer `TextField` over deprecated `Input` for labeled product fields
- [ ] Optional: nest under `FormControl` — `TextField` inherits `required` / `error` / `disabled` / `fullWidth` unless set explicitly

---

## v1.0.19

### 1. `ChatInputBox` — `label` renamed to `banner`

**What changed:** The optional status text rendered above the input was renamed from `label` to `banner` to avoid confusion with form field labels.

**Before (v1.0.18):**

```tsx
<ChatInputBox label="Thinking…" onSend={handleSend} />
```

**After (v1.0.19):**

```tsx
<ChatInputBox banner="Thinking…" onSend={handleSend} />
```

**Steps:**

- [ ] Replace every `label=` prop on `ChatInputBox` with `banner=`
- [ ] Search for `ChatInputBox` usages that spread props containing `label` and rename the key



### 2. `MessageComposer` — `sx` prop removed

**What changed:** `MessageComposer` no longer accepts an `sx` prop. Style the surrounding layout instead.

**Before (v1.0.18):**

```tsx
<MessageComposer
  question="Which queue?"
  options={options}
  onSelect={handleSelect}
  sx={{ mb: 2 }}
/>
```

**After (v1.0.19):**

```tsx
<Box sx={{ mb: 2 }}>
  <MessageComposer
    question="Which queue?"
    options={options}
    onSelect={handleSelect}
  />
</Box>
```

**Steps:**

- [ ] Remove `sx` from `MessageComposer` call sites
- [ ] Wrap the composer in a `Box` (or parent) and apply styles there

---


## v1.0.16

### 1. `AppBar` — flat props replace bag-of-props

**What changed:** `appLauncherProps` and `avatarMenuProps` removed. All sub-component configuration is now passed as flat props on `AppBar` directly, making the API surface explicit and discoverable.

**Before (v1.0.15):**

```tsx
<AppBar
  appLauncherProps={{ type: 'default', products, iconName: 'squares-four' }}
  avatarMenuProps={{
    avatarName: 'Jane Doe',
    menuGroups: groups,
    footerInfo: info,
    selectedTheme: 'system',
    onThemeChange: handleTheme,
    onLogout: handleLogout,
  }}
  brandLogo="/logo.svg"
/>
```

**After (v1.0.16):**

```tsx
<AppBar
  appLauncherType="default"
  appLauncherProducts={products}
  appLauncherIconName="squares-four"
  avatarName="Jane Doe"
  avatarMenuGroups={groups}
  avatarFooterInfo={info}
  avatarSelectedTheme="system"
  onAvatarThemeChange={handleTheme}
  onAvatarLogout={handleLogout}
  brandLogo="/logo.svg"
/>
```

**Steps:**

- [ ] Replace `appLauncherProps={{ type, products, iconName }}` with `appLauncherType`, `appLauncherProducts`, `appLauncherIconName` as separate props
- [ ] Replace `avatarMenuProps={{ avatarName, menuGroups, footerInfo, selectedTheme, onThemeChange, onLogout }}` with `avatarName`, `avatarMenuGroups`, `avatarFooterInfo`, `avatarSelectedTheme`, `onAvatarThemeChange`, `onAvatarLogout`
- [ ] Omit `appLauncherProducts` entirely to hide the app launcher (previously the launcher always rendered)

### 2. Tonal palette — hybrid light/dark resolution

**What changed:** Tonal surfaces (Chip, Badge, tonal Button, standard Alert) resolve via `resolveTonalColor(theme, color)`. The API shape (`TonalColorTokens`: `bg`, `text`, `hoverBg`, `disabledBg`) is unchanged.

**Light mode:** Static solid tokens on `theme.palette.tonal` (`LIGHT_TONAL_PALETTE`).

**Dark mode:** Alpha-tinted backgrounds via `theme.palette.tonalSurface` (`backgroundOpacity: 0.32`) and lighter foreground text via `TONAL_TEXT_RAMP`.

**Before (direct palette access):**

```tsx
const tokens = theme.palette.tonal.primary;
```

**After (always use resolver):**

```tsx
import { resolveTonalColor } from '@exotel-npm-dev/signal-design-system';

const tokens = resolveTonalColor(theme, 'primary');
```

**Steps:**

- [ ] Replace every `theme.palette.tonal[color]` access with `resolveTonalColor(theme, color)`
- [ ] Import `resolveTonalColor` from the package root
- [ ] Custom theme overrides: set `tonal` for light scheme and `tonalSurface` for dark scheme — do not apply both to the same mode

### 3. `stringToColor` deprecated

**What changed:** `stringToColor(name)` now delegates to `getAvatarColors(name).bgcolor` internally and is marked `@deprecated`. The old hash-based colours could fail WCAG contrast; the new `getAvatarColors()` returns both `bgcolor` and `color` from a curated palette with ≥ 4.5:1 contrast.

**Before (v1.0.15):**

```tsx
import { stringToColor } from '@exotel-npm-dev/signal-design-system';

<Avatar sx={{ bgcolor: stringToColor(name) }}>
  {getInitials(name)}
</Avatar>
```

**After (v1.0.16):**

```tsx
import { getAvatarColors } from '@exotel-npm-dev/signal-design-system';

<Avatar sx={getAvatarColors(name)}>
  {getInitials(name)}
</Avatar>
```

**Steps:**

- [ ] Replace `stringToColor(name)` with `getAvatarColors(name)` and spread the result (provides both `bgcolor` and `color`)
- [ ] `stringToColor` still works but will be removed in a future version

---

## v1.0.15

### 1. `Select` — new underlying implementation

**What changed:** `Select` was rewritten from a thin `MuiSelect` wrapper to an `EnhancedTextField`-based component (using MUI's `select` mode). It now renders an external label above an outlined field — consistent with `Autocomplete` and `EnhancedTextField`.

`SelectProps` extends `EnhancedTextFieldProps` instead of `MuiSelectProps`. MUI Select-specific props that were previously accepted are no longer part of the type.

**Before (v1.0.14):**

```tsx
import { Select } from '@exotel-npm-dev/signal-design-system';

<Select
  label="Country"
  value={country}
  onChange={handleChange}
  native
  autoWidth
  variant="filled"
>
  <option value="IN">India</option>
</Select>
```

**After (v1.0.15):**

```tsx
import { Select, MenuItem } from '@exotel-npm-dev/signal-design-system';

<Select
  label="Country"
  value={country}
  onChange={handleChange}
>
  <MenuItem value="IN">India</MenuItem>
</Select>
```

**Steps:**

- [ ] Remove `native` prop — native selects are no longer supported; use `MenuItem` children instead of `<option>`
- [ ] Remove `autoWidth` prop — width is now controlled via `sx` or `fullWidth`
- [ ] Remove `variant` prop — Select always renders as `outlined` (matching the design system)
- [ ] If you were spreading `MuiSelectProps`-specific fields (e.g. `MenuProps`, `renderValue`), pass them through `slotProps.select` instead:
  ```tsx
  <Select
    label="Country"
    slotProps={{
      select: { MenuProps: { ... }, renderValue: (val) => ... }
    }}
  />
  ```
- [ ] If you relied on `InputProps` or `InputLabelProps`, these are now handled by `EnhancedTextField` — use `slotProps` or standard `EnhancedTextField` props