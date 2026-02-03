# Unified Parameter Handler - GTM Template

A Google Tag Manager Custom Template that captures tracking parameters (fbclid, gclid, UTMs, etc.) from URLs and cookies, then injects them into hidden form fields for CRM submission.

## Features

- **Facebook Parameters**
  - `fbclid` capture with automatic `_fbc` cookie formatting
  - `_fbp` (Facebook Browser ID) cookie reading
  - Preserves existing Meta Pixel cookies when present

- **Google Parameters**
  - `gclid` (Google Click ID)
  - `wbraid` (Web-to-App)
  - `gbraid` (App-to-Web)

- **UTM Parameters**
  - Configurable field mappings for any UTM parameter
  - Supports: utm_source, utm_medium, utm_campaign, utm_term, utm_content, utm_id

- **Browser Information**
  - User Agent capture
  - Client IP via JSONP (using ipify.org)

- **Persistence**
  - localStorage storage for cross-page tracking
  - Configurable key prefix and cookie expiry

- **Custom Parameters**
  - Define custom handlers for any URL parameter or cookie

## Installation

### From Community Template Gallery

1. In GTM, go to **Templates** > **Tag Templates** > **Search Gallery**
2. Search for "Unified Parameter Handler"
3. Click **Add to workspace**

### Manual Import

1. Download `template.tpl` from this repository
2. In GTM, go to **Templates** > **Tag Templates** > **New**
3. Click the three-dot menu > **Import**
4. Select the downloaded `template.tpl` file

## Configuration

### Basic Setup

1. Create a new tag using the "Unified Parameter Handler" template
2. Configure which parameters to capture:
   - **Facebook Parameters**: Enable FBC and/or FBP with form field names
   - **Google Parameters**: Enable GCLID, WBRAID, and/or GBRAID
   - **UTM Parameters**: Add mappings from UTM param to form field name

3. Set a trigger (recommended: **DOM Ready** or **Page View**)

### Field Configuration

#### Facebook Parameters

| Setting | Description | Default |
|---------|-------------|---------|
| Enable FBC | Capture fbclid and format as _fbc | true |
| FBC Form Field Name | Hidden input name attribute | "fbc" |
| Enable FBP | Read _fbp cookie from Meta Pixel | true |
| FBP Form Field Name | Hidden input name attribute | "fbp" |

#### Google Parameters

| Setting | Description | Default |
|---------|-------------|---------|
| Enable GCLID | Capture Google Click ID | true |
| GCLID Form Field Name | Hidden input name attribute | "gclid" |
| Enable WBRAID | Capture Web-to-App ID | false |
| Enable GBRAID | Capture App-to-Web ID | false |

#### UTM Parameters

Add rows to the mapping table:

| UTM Parameter | Form Field Name |
|---------------|-----------------|
| utm_source | source |
| utm_medium | medium |
| utm_campaign | campaign |

#### Advanced Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Enable Persistence | Store values in localStorage | true |
| Persistence Prefix | Key prefix for localStorage | "uph_" |
| Cookie Expiry Days | Days until tracking cookies expire | 90 |
| Enable Debug | Log to console in preview mode | false |

### Custom Parameters

For parameters not covered by built-in handlers, add custom handlers:

| Field | Description |
|-------|-------------|
| Parameter ID | Unique identifier for this handler |
| Source Type | Where to look: URL Parameter, Cookie, or Both |
| URL Param Name | The URL query parameter name |
| Cookie Name | The cookie name to read/write |
| Form Field Name | The hidden input field name |

## Form Setup

### Step 1: Add Hidden Form Fields

Your forms need hidden input fields with matching `name` attributes:

```html
<form id="lead-form">
  <!-- Visible fields -->
  <input type="text" name="email" placeholder="Email">

  <!-- Hidden tracking fields -->
  <input type="hidden" name="fbc">
  <input type="hidden" name="fbp">
  <input type="hidden" name="gclid">
  <input type="hidden" name="source">
  <input type="hidden" name="medium">
  <input type="hidden" name="campaign">
</form>
```

### Step 2: Add DOM Helper Tag (Required)

Due to GTM sandbox restrictions, the template cannot directly access the DOM. You must add a **Custom HTML tag** that populates form fields from the captured values.

1. In GTM, create a new **Custom HTML** tag
2. Paste this code:

```html
<script>
(function() {
  // Define the DOM helper function
  window._uphSetField = function(fieldName, value) {
    if (!fieldName || value === null || value === undefined) return false;
    var elements = document.querySelectorAll(
      'input[name="' + fieldName + '"], textarea[name="' + fieldName + '"]'
    );
    if (elements.length === 0) return false;
    for (var i = 0; i < elements.length; i++) {
      elements[i].value = value;
    }
    return true;
  };

  // Populate forms from stored values
  function populateForms() {
    var values = window._uphValues || {};
    var config = window._uphConfig || {};

    // Populate standard tracked values
    for (var fieldName in values) {
      if (values.hasOwnProperty(fieldName)) {
        window._uphSetField(fieldName, values[fieldName]);
      }
    }

    // Handle User Agent (can't be captured in GTM sandbox)
    if (config.userAgentField && navigator.userAgent) {
      window._uphSetField(config.userAgentField, navigator.userAgent);
      // Persist if enabled
      if (config.enablePersistence && config.persistencePrefix) {
        try {
          localStorage.setItem(config.persistencePrefix + 'userAgent', navigator.userAgent);
        } catch (e) {}
      }
    }
  }

  // Run immediately and also on DOM ready
  populateForms();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', populateForms);
  }
})();
</script>
```

3. Set the trigger to fire on **All Pages** (or same trigger as the UPH tag)
4. **Important**: Use tag sequencing to ensure this tag fires **after** the UPH template tag

### Alternative: Access Values Programmatically

If you prefer to handle form population yourself (e.g., in your own scripts), the captured values are available in `window._uphValues`:

```javascript
// Access captured values directly
console.log(window._uphValues);
// { fbc: "fb.2.1234567890.abc123", gclid: "EAIaIQob...", ... }

// Or access individual values
var fbc = window._uphValues && window._uphValues.fbc;
```

## Trigger Recommendations

### Standard Page View

Use **DOM Ready** or **Page View** trigger for forms that exist on page load.

### Single Page Applications (SPAs)

For SPAs where forms may be dynamically loaded:
1. Create a Custom Event trigger
2. Fire the tag when your form component mounts
3. Consider using the History Change trigger for route changes

### After Meta Pixel

If you're also using Meta Pixel and want to ensure UPH preserves Meta's _fbc cookie:
1. Set up tag sequencing
2. Configure Meta Pixel tag to fire first
3. Set UPH tag to fire after Meta Pixel completes

## How It Works

### FBC (Facebook Click ID) Flow

1. User clicks a Facebook ad with `fbclid` parameter
2. UPH checks if Meta Pixel already set `_fbc` cookie
3. If Meta cookie exists: preserve it and use that value
4. If no Meta cookie: format fbclid as `fb.{subdomain}.{timestamp}.{fbclid}`
5. Store in localStorage for cross-page persistence
6. Populate all matching hidden form fields

### Persistence Flow

1. On page load, check URL for parameters
2. If found: store in localStorage with prefix (e.g., `uph_gclid`)
3. If not in URL: check localStorage for previously stored value
4. Populate form fields with whichever value is found

## Limitations

Compared to the webpack-bundled library version:

| Feature | GTM Template | Webpack Build |
|---------|--------------|---------------|
| DOM access | Via helper tag | Direct |
| Retry mechanism | Not available | Available |
| MutationObserver | Not available | Available |
| IP fetch | Async (JSONP) | Async (fetch) |
| setTimeout | Not available | Available |

**Key differences:**

- **DOM Helper Required**: GTM's sandbox cannot access `document` directly. A separate Custom HTML tag is required to populate form fields (see Form Setup section).
- **No Retry**: The GTM sandbox does not support `setTimeout`, so the retry mechanism for waiting on cookies set by other scripts is not available. Ensure your trigger fires after other tracking pixels.

## Debugging

1. Enable "Debug Logging" in Advanced Settings
2. Open GTM Preview mode
3. Check the browser console for `[UPH]` prefixed messages

## Privacy & Consent

This template reads and writes cookies. Ensure you:

1. Have appropriate cookie consent mechanisms in place
2. Document the cookies in your privacy policy
3. Consider using GTM's Consent Mode for GDPR compliance

### Cookies Used

| Cookie | Purpose | Default Expiry |
|--------|---------|----------------|
| _fbc | Facebook Click ID (formatted) | 90 days |
| gclid | Google Click ID | 90 days |
| wbraid | Google Web-to-App | 90 days |
| gbraid | Google App-to-Web | 90 days |

## Support

For issues and feature requests, please open an issue at:
https://github.com/atomicagility/unified-param-handler/issues

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.
