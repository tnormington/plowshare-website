# Google Analytics Setup Instructions

Google Analytics 4 (GA4) tracking has been added to all pages of the Plowshare website.

## Setup Steps

1. **Create a Google Analytics 4 Property**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Sign in with your Google account
   - Click "Admin" in the bottom left
   - Click "Create Property"
   - Follow the setup wizard to create a GA4 property

2. **Get Your Measurement ID**
   - After creating your property, you'll receive a Measurement ID (format: `G-XXXXXXXXXX`)
   - You can also find it in: Admin > Property > Data Streams > Select your stream

3. **Replace the Placeholder ID**
   - Search for `G-XXXXXXXXXX` in all HTML files
   - Replace it with your actual Measurement ID

   Files that need updating:
   - `index.html`
   - `privacy.html`
   - `terms.html`
   - `cookies.html`
   - `accessibility.html`

   You can use this command to replace all instances at once:
   ```bash
   # Linux/Mac
   find . -name "*.html" -type f -exec sed -i 's/G-XXXXXXXXXX/G-YOUR-ACTUAL-ID/g' {} +

   # Windows PowerShell
   Get-ChildItem -Path . -Filter *.html -Recurse | ForEach-Object { (Get-Content $_.FullName) -replace 'G-XXXXXXXXXX', 'G-YOUR-ACTUAL-ID' | Set-Content $_.FullName }
   ```

4. **Verify Installation**
   - Visit your website
   - Open browser developer tools (F12)
   - Go to the Network tab
   - Look for requests to `google-analytics.com` or `googletagmanager.com`
   - Or install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) Chrome extension

5. **Check Real-Time Reports**
   - Go to Google Analytics
   - Navigate to Reports > Realtime
   - Visit your website and verify that your visit appears in real-time reports

## What's Been Implemented

The following Google Analytics code has been added to all HTML pages:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

This code:
- Loads the Google Analytics tracking library asynchronously
- Initializes the data layer
- Configures tracking with your Measurement ID
- Automatically tracks page views

## Features Tracked

By default, Google Analytics 4 will track:
- Page views
- User engagement
- Session duration
- Traffic sources
- Device information
- Geographic location
- And more

## Privacy Considerations

The Cookie Policy page (`cookies.html`) already mentions Google Analytics. Make sure your Privacy Policy accurately reflects your data collection practices.

## Additional Configuration (Optional)

You can enhance tracking by adding:

1. **Enhanced Measurement** (enabled by default in GA4 Admin)
   - Scroll tracking
   - Outbound link clicks
   - Site search
   - Video engagement
   - File downloads

2. **Custom Events** - Add custom tracking for specific actions:
   ```javascript
   gtag('event', 'button_click', {
     'button_name': 'join_waitlist',
     'location': 'hero'
   });
   ```

3. **Conversion Tracking** - Set up conversion events in GA4 to track:
   - Waitlist signups
   - Form submissions
   - Button clicks

## Support

For more information, visit:
- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
