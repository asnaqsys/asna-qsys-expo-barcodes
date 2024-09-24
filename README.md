# asna-qsys-expo-barcodes
The Library `asna-qsys-expo-barcodes` is the *Client-side* Barcode Detection support for Monarch Applications.

The Library may be used by either:

* [Monarch Base](https://asnaqsys.github.io/manuals/configuration/expo-client-side-barcode-scan-config.html) Clients. 
* [Monarch Framework 11.1](https://docs.asna.com/documentation/Help170/MonarchFX/_HTML/amfUnderstandingBarcodes.htm) Clients


For all supported Clients, the Library is delivered to the Application website using a [Libman](https://learn.microsoft.com/en-us/aspnet/core/client-side/libman/libman-vs?view=aspnetcore-8.0) [JSON](https://www.json.org/json-en.html) configuration file. 

The reference to the Library as well as the supporting [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) is added to the [ASP.NET](https://dotnet.microsoft.com/en-us/learn/aspnet/what-is-aspnet) in a slightly different way.

Please refer to the appropriate [ASP.NET](https://dotnet.microsoft.com/en-us/learn/aspnet/what-is-aspnet) version below:

### A. [Monarch Base](https://asnaqsys.github.io/manuals/configuration/expo-client-side-barcode-scan-config.html) Clients
Monarch Base clients already contain a libman.json file to restore the [Client Side Content](https://asnaqsys.github.io/manuals/configuration/expo-client-side-library.html).

In addition to the [Basic Expo Web Content](https://www.jsdelivr.com/package/gh/asnaqsys/asna-qsys-expo-web-content?tab=files), the [Expo Barcodes Web Content](https://www.jsdelivr.com/package/gh/asnaqsys/asna-qsys-expo-barcodes?tab=files) needs to be added to the libraries needed to be delivered (or [restored](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-restore) - using `dotnet` terminology -) to the website.

This is done by adding a new JSON entry into the `libraries` array property. 

The modified `libman.json` file looks like the following :

```json
{
  "version": "1.0",
  "libraries": [
    {
      "provider": "jsdelivr",
      "library": "asnaqsys/asna-qsys-expo-web-content@5.0.3",
      "destination": "wwwroot/lib/asna-expo",
      "files": [
        "**/*", "!.github/**/*", "!css/*.min.*", "!js/*.min.*", "!js/**/*.min.*"
      ]
    },
    {
      "provider": "jsdelivr",
      "library": "asnaqsys/asna-qsys-expo-barcodes@5.0.0",
      "destination": "wwwroot/lib/asna-expo",
      "files": [
        "**/*", "!.github/**/*", "!css/*.min.*", "!js/*.min.*", "!js/**/*.min.*"
      ]
    }
  ]
}
```

>Note: Library `asnaqsys/asna-qsys-expo-barcodes` has been added to the `libraries` array (same destination as `asna-qsys-expo-web-content`).

When the Website is re-built, the new `asnaqsys/asna-qsys-expo-barcodes` files will appear on the website.

For the [Razor Pages](https://learn.microsoft.com/en-us/aspnet/core/razor-pages/?view=aspnetcore-8.0&tabs=visual-studio) to reference the `barcode` [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) and the [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) support, 
the `_Layout.cshtml` file needs to be updated.

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

   a)  A new reference to CSS was added in the `head` HTML: 
     
      <link rel="stylesheet" href="~/lib/asna-expo/css/barcodes.css" />

   b) A new symbol `Barcodes` has been imported inside the `module` script section at the bottom: 
    
      import { Barcodes } from '../lib/asna-expo/js/barcode-detection/barcode-field.js';

   c) A call to initialize the Barcode engine has been added inside the script section: 
     
     Barcodes.init({ formId: 'MonarchForm' });

<br/>
<br/>
<br/>

### B. [Monarch Framework 11.1](https://docs.asna.com/documentation/Help170/MonarchFX/_HTML/amfUnderstandingBarcodes.htm) Clients.  

Applications using Monarch Monarch Framework 11.1 do not use the [libman](https://learn.microsoft.com/en-us/aspnet/core/client-side/libman/libman-vs?view=aspnetcore-8.0) Web-content delivery mechanism (rather use JavaScript injected at runtime stored in the `WebDspf.dll` assembly *as static resources* ).

To enable [libman](https://learn.microsoft.com/en-us/aspnet/core/client-side/libman/libman-vs?view=aspnetcore-8.0), create a new text-file (extension.json) at the root of the Website project in Visual Studio 2022 (or later). Add the following contents to this new file:

`Libman.json:`

```javascript
{
  "version": "1.0",
  "libraries": [
    {
      "provider": "jsdelivr",
      "library": "asnaqsys/asna-qsys-expo-web-content@5.0.3",
      "destination": "lib/asna-expo/",
      "files": [
        "js/asna-data-attr.js",
        "js/base-64.js",
        "!.github/**/*",
        "!css/*.min.*",
        "!js/*.min.*",
        "!js/**/*.min.*"
      ]
    },
    {
      "provider": "jsdelivr",
      "library": "asnaqsys/asna-qsys-expo-barcodes@5.0.0",
      "destination": "lib/asna-expo",
      "files": [
        "**/*",
        "!.github/**/*",
        "!css/*.min.*",
        "!js/*.min.*",
        "!js/**/*.min.*"
      ]
    }
  ]
}
```

As soon as you save the new file, the `asna-qsys-expo-barcodes` web contents will be [restored](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-restore) to your local file system.

You can [Enable Restore on Build](https://devblogs.microsoft.com/dotnet/library-manager-client-side-content-manager-for-web-apps/) following the easy steps on this [link](https://devblogs.microsoft.com/dotnet/library-manager-client-side-content-manager-for-web-apps/).

For the [ASPX Pages](https://learn.microsoft.com/en-us/previous-versions/aspnet/dd566231(v=vs.140)) that will contain [Barcode Reader Web Controls](https://docs.asna.com/documentation/Help170/MonarchFX/_HTML/amfUnderstandingBarcodes.htm) the following [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) style `class` needs to be defined, to complete the style for the `camera video-frame viewer`, which will apear while the barcode is being scanned.

```css
<style>
    .dds-field-barcode-video-frame {
        position: absolute;
        left:0px;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
```
>Note: If more than one Page will contain **Barcode Reader Web controls**, this style can be added to the [ASPX MasterPage](https://learn.microsoft.com/en-us/previous-versions/aspnet/wtxbf3hh(v=vs.100)) or to the user-define `site.css` that the Application uses to deine the Application global style.

For the [ASPX Pages](https://learn.microsoft.com/en-us/previous-versions/aspnet/dd566231(v=vs.140)) that will contain [Barcode Reader Web Controls](https://docs.asna.com/documentation/Help170/MonarchFX/_HTML/amfUnderstandingBarcodes.htm) the script reference should be added at the end of the Page:

```html
<script type="module">
    import { Barcodes } from '../../lib/asna-expo/js/barcode-detection/barcode-field.js';

    Barcodes.init({ formId: 'form1' });
</script>
```

>Note: If more than one Page will contain [Barcode Reader Web Controls](https://docs.asna.com/documentation/Help170/MonarchFX/_HTML/amfUnderstandingBarcodes.htm), this script reference can be added to the [ASPX MasterPage](https://learn.microsoft.com/en-us/previous-versions/aspnet/wtxbf3hh(v=vs.100)). When adding the script to the **MasterPage**, Pages that do not use *Barcode scanning* feature will be unaffected. 
 