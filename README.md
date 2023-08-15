# asna-qsys-expo-barcodes
Client side Barcode Detection logic for Monarch Base Applications.

To install on existing Monarch Base Application:

1. Modify libman.json :
```json
{
  "version": "1.0",
  "libraries": [
    {
      "provider": "jsdelivr",
      "library": "asnaqsys/asna-qsys-expo-web-content@4.0.7",
      "destination": "wwwroot/lib/asna-expo",
      "files": [
        "**/*", "!.github/**/*", "!css/*.min.*", "!js/*.min.*", "!js/**/*.min.*"
      ]
    },
    {
      "provider": "jsdelivr",
      "library": "asnaqsys/asna-qsys-expo-barcodes@latest",
      "destination": "wwwroot/lib/asna-expo",
      "files": [
        "**/*", "!.github/**/*", "!css/*.min.*", "!js/*.min.*", "!js/**/*.min.*", "!js/*.md"
      ]
    }
  ]
}
```

   >Note: Library `asnaqsys/asna-qsys-expo-barcodes` is now requested (same destination as asnaqsys/asna-qsys-expo-web-content).

2. Add reference to the library (_Layout.cshtml) :
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
    <meta name="google" content="notranslate" />
    <title>@ViewData["Title"] - ExpoSite</title>

    <link rel="stylesheet" href="~/lib/asna-expo/css/expo.css" />
    <link rel="stylesheet" href="~/lib/asna-expo/css/barcodes.css" />
    <link rel="stylesheet" href="~/css/site.css" />
</head>
<body>
    @RenderBody()

    <script type="module">
        import { Barcodes } from '../lib/asna-expo/js/barcode-detection/barcode-field.js';
        import { Page } from '../lib/asna-expo/js/asna.js';

        Barcodes.init({ formId: 'MonarchForm' });
        Page.init({ formId: 'MonarchForm' });
    </script>

    @RenderSection("Scripts", required: false)
</body>
</html>
```

>Notes: 

   a) `<link rel="stylesheet" href="~/lib/asna-expo/css/barcodes.css" />`

   b) `import { Barcodes } from '../lib/asna-expo/js/barcode-detection/barcode-field.js';`

   c) `Barcodes.init({ formId: 'MonarchForm' });`