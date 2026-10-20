# VBP-102 visual QA

final result: passed

Source visual truth: `docs/design/VBP-102-avatar-settings/selected-reference.png` (1254×1254), the third displayed Image Gen result selected by the user. Implementation: `http://127.0.0.1:3101/canvas` and `/settings`.

Combined comparison input: `docs/design/VBP-102-avatar-settings/evidence/icon-comparison.png`. Left is a crop of the selected character; right is the actual rendered navigation icon enlarged for inspection; bottom preserves the full navigation context. This is an icon reference rather than a full page mockup. The source character is normalized into a 34px CSS slot; the enlarged actual screenshot necessarily exposes small-pixel antialiasing. The production icon uses the generated transparent asset, not a code approximation. Its96px optimized response is2000bytes in the local check.

Implementation screenshots: `docs/design/VBP-102-avatar-settings/evidence/guest-header.png`, `account-menu.png`, `settings-page.png`, and `settings-mobile.png`. Desktop viewport1093×737 (the initial guest capture was1280×720); mobile390×844; captures are at1× CSS density. State: guest icon, signed-in default avatar/menu, and settings with automatic sync enabled.

## Findings and fixes

- Fixed `BUG-B351BA51`: first-click focus and click updates cancelled one another. Explicit opening and Escape focus restoration passed real browser navigation into settings.
- Fixed `BUG-F5A8B755`: the mobile brand text displaced the account control beyond the viewport. Mobile now uses the existing brand mark; all five controls remain visible. Revised390×844 capture passed.
- Corrected the account surface separators to use the existing `--hairline` token; the final desktop capture shows restrained dividers.
- No remaining actionable P0/P1/P2 visual mismatch. Hair, smile, face tilt, raised hand and wave marks retain the selected character. Raster detail at34px is intentionally less textured than the large sketch.

## Required surfaces

- Typography: existing site font and weights retained; no font is present in the icon reference. Settings uses32px desktop/28px mobile heading,16px switch label,13px supporting text. Username wraps rather than clipping.
- Spacing/layout: centered640px settings column, lightweight rows and dividers; no enclosing app card. The avatar menu is directly below the44px target. Mobile screenshot has no clipped persistent control.
- Color/tokens: original paper/surface/accent/ink variables retained; the transparent mask uses currentColor so the icon follows the active theme. No cream rectangle is embedded in the icon.
- Image fidelity: generated transparent PNG is loaded through the existing Next optimization pipeline; real upload, refresh persistence and restore-default succeeded. The combined focused comparison documents the selected character at actual navigation scale.
- Copy/content: settings contains avatar, cloud sync and sign-out only, with concise preservation/guest-upload explanations. Xiaobei activation and account binding remain available in their existing flows.

Primary real-browser checks: login/registration, first-click menu, keyboard activation, settings navigation, image upload and persistence, default restoration, sync off/on reflected by cloud canvas status, and sign-out returning to the guest canvas. Captured console errors: none. Viewport override is reset after verification. Remaining test gap: every theme palette and every supported input image codec were not separately exercised; masks use existing tokens and successful PNG upload plus boundary checks cover this change.
