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
      "library": "asnaqsys/asna-qsys-expo-barcodes@5.0.1",
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

Here is a typical instance of DdsBarcode Web Control in an ASPX Page:

```html
<mdf:DdsBarcode ID="UNIQUE_ID_BARCODE" runat="server"
    AidKey="Enter"
    Usage="Both"
    BarcodeFormat="Any"
    ValueField="TARGET_FIELD"
    ValueFieldLength="15" />
```

>Note: the `ValueField` and `ValueFieldLength` properties should match the names for the field that will receive the scanned barcode value and its length.

STEPS TO UPDATE THE APPLICATION WEBSITE

1. Enable libman.json.

To enable [libman](https://learn.microsoft.com/en-us/aspnet/core/client-side/libman/libman-vs?view=aspnetcore-8.0), create a new text-file (using file extension `.json`) at the root of the Website project in Visual Studio 2022 (or later). Add the following contents to this new file:

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
      "library": "asnaqsys/asna-qsys-expo-barcodes@6.0.1-beta",
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

>Note: Use the latest release of `asnaqsys/asna-qsys-expo-barcodes` to get the correct implementation.

As soon as you save the new file, the `asna-qsys-expo-barcodes` web contents will be [restored](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-restore) to your local file system.

You can [Enable Restore on Build](https://devblogs.microsoft.com/dotnet/library-manager-client-side-content-manager-for-web-apps/) following the easy steps on this [link](https://devblogs.microsoft.com/dotnet/library-manager-client-side-content-manager-for-web-apps/).

2. Add a reference to the external stylesheet `barcodes.css`

Wherever you include external stylesheet references ( typically in the [ASPX MasterPage](https://learn.microsoft.com/en-us/previous-versions/aspnet/wtxbf3hh(v=vs.100)) ):

```html
<head runat="server">
   <meta charset="utf-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <title>ASNA App</title>
   <meta name="apple-mobile-web-app-capable" content="yes" />
   <meta name="mobile-web-app-capable" content="yes">
.
.
.
   <link rel="stylesheet" type="text/css" href="~/Themes/Current/Styles/Framework.css">
   <link rel="stylesheet" type="text/css" href="~/Themes/Current/Styles/Theme.css">

   <link rel="stylesheet" type="text/css" href="~/lib/asna-expo/css/barcodes.css" />
.
.
.
</head>
```

>Note: the new link element with href = "~/lib/asna-expo/css/barcodes.css".

3. Add a small script to load the `JavaScript` module that implements the barcode detection logic.


For the [ASPX Pages](https://learn.microsoft.com/en-us/previous-versions/aspnet/dd566231(v=vs.140)) that will contain [Barcode Reader Web Controls](https://docs.asna.com/documentation/Help170/MonarchFX/_HTML/amfUnderstandingBarcodes.htm) the script reference should be added at the end of the Page:

```html
<script type="module">
    import { Barcodes } from '../../lib/asna-expo/js/barcode-detection/barcode-field.js';

    Barcodes.init({ formId: 'form1' });
</script>
```

>Note: If more than one Page will contain [Barcode Reader Web Controls](https://docs.asna.com/documentation/Help170/MonarchFX/_HTML/amfUnderstandingBarcodes.htm), this script reference can be added to the [ASPX MasterPage](https://learn.microsoft.com/en-us/previous-versions/aspnet/wtxbf3hh(v=vs.100)). When adding the script to the **MasterPage**, Pages that do not use *Barcode scanning* feature will be unaffected. 
 
 <br>

 ## Framework DdsBarcode Properties

| Property Name | Description |
|---|---|
| `ScanningTimeoutSeconds` | Timeout in seconds for the barcode to be identified. If no detection succeeds within the timeout since the scan started, the Preview User Interface is removed, canceling the scan. Set to `0` to make it indefinite. |
| `BarcodeFormat` | Specifies the expected barcode format. See the `BarcodeFormats` table below for available values. |
| `HintFormatOrderedList` | For advanced hint format configuration, a list of string names indicating the possible formats the barcode reader may encounter. The order may optimize scanning performance, with the most likely formats listed first. Valid names are `AZTEC`, `CODABAR`, `CODE_39`, `CODE_93`, `CODE_128`, `DATA_MATRIX`, `EAN_8`, `EAN_13`, `ITF`, `MAXICODE`, `PDF_417`, `QR_CODE`, `RSS_14`, `RSS_EXPANDED`, `UPC_A`, `UPC_E`, `UPC_EAN_EXTENSION`. Use blanks, commas, or semicolons to separate identifiers. |
| `HintTryHarder` | When `true`, spend more time trying to find a barcode; optimize for accuracy rather than speed. |
| `HintPureBarcode` | When `true`, indicates that barcodes are “pure,” meaning monochrome images containing only an unrotated, unskewed barcode with some white border around it. Enabling this hint, when applicable, significantly optimizes detection performance. |
| `HintCharacterSet` | Specifies the character encoding to use where applicable, such as `SJIS`, `GB2312`, `ISO8859_1`, `EUC_JP`, or `UTF8`. Defaults to `UTF8`. |
| `HintAllowedITF_Lengths` | When barcode format `ITF` is detected, only encoded data lengths in this comma-separated list are considered valid. If not set, the valid ITF lengths are assumed to be `6, 8, 10, 12, 14`. |
| `HintAllowEAN_Extensions` | Comma-separated list of allowed extension lengths for `EAN` or `UPC` barcodes, for example `2, 5`. If extensions are optional, do not set this hint. If set and a `UPC` or `EAN` barcode is found without an extension, no result will be returned. |
| `HintAssumeCode39CheckDigit` | When barcode format `CODE_39` is detected and this property is `true`, the last data character is treated as a check digit rather than data, and the checksum is verified. |
| `HintEnableCODE39_ExtendedMode` | When `true`, enables `CODE 39` Extended Mode. When enabled, the Code 39 reader attempts to decode extended sequences in the text. |
| `HintAssumeGS1_CODE_128` | When `true`, assumes the barcode is being processed as a `GS1` barcode and modifies behavior as needed. Affects `FNC1` handling for `CODE 128` (`GS1-128`). |

## BarcodeFormats Enum Values

| Enum Value | Description |
|---|---|
| `Any` | Accept any supported barcode format. |
| `OnlyAztec_2D_barcode` | Only Aztec 2D barcodes. |
| `OnlyCODABAR_1D` | Only CODABAR 1D barcodes. |
| `OnlyCode_39_1D` | Only Code 39 1D barcodes. |
| `OnlyCode_93_1D` | Only Code 93 1D barcodes. |
| `OnlyCode_128_1D` | Only Code 128 1D barcodes. |
| `OnlyData_Matrix_2D` | Only Data Matrix 2D barcodes. |
| `OnlyEAN_8_1D` | Only EAN-8 1D barcodes. |
| `OnlyEAN_13_1D` | Only EAN-13 1D barcodes. |
| `OnlyITF_1D` | Only ITF 1D barcodes; ITF stands for Interleaved Two of Five. |
| `OnlyMaxiCode_2D` | Only MaxiCode 2D barcodes. |
| `OnlyPDF417` | Only PDF417 barcodes. |
| `OnlyQR_Code_2D` | Only QR Code 2D barcodes. |
| `OnlyRSS_14` | Only RSS-14 barcodes. |
| `OnlyRSS_EXPANDED` | Only RSS Expanded barcodes. |
| `OnlyUPC_A_1D` | Only UPC-A 1D barcodes. |
| `OnlyUPC_E_1D` | Only UPC-E 1D barcodes. |
| `OnlyUPC_EAN_Extension` | Only UPC/EAN Extension barcodes. |