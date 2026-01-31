# Unified Parameter Handler - Roadmap

## Planned

### GTM Custom Template
Convert the library from inline Custom HTML deployment to a GTM Custom Template.

**Benefits:**
- Sandboxed JavaScript environment for better security
- Native Content Security Policy (CSP) compliance
- Version control within GTM
- Shareable across GTM containers via Template Gallery
- Built-in permission model for APIs (cookies, localStorage, etc.)

**Considerations:**
- Requires learning GTM Template API (sandboxed JS subset)
- Some APIs differ from standard browser APIs
- Need to test IE11/ES5 compatibility in template sandbox

**References:**
- [Custom Tags - Tag Manager Help](https://support.google.com/tagmanager/answer/6107167?hl=en)
- [GTM Template API Documentation](https://developers.google.com/tag-platform/tag-manager/templates)

---

## Completed

### FBC Formatter + Cookie Preservation (v1.8.3)
- Fixed `formatFbClickId` formatter not applied in davinci build
- Added cookie preservation for Meta's `_fbc` cookie in In-App browsers
- Added build-time validation for function references in configs
- Added runtime error logging for unknown formatters

See: [PLAN-fix-fbc-formatter.md](./PLAN-fix-fbc-formatter.md)
