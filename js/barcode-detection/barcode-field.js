export { theBarcodes as Barcodes };

import { AsnaDataAttrName } from '../asna-data-attr.js';
import { Base64 } from '../base-64.js';

import { BrowserAztecCodeReader } from './zxing/browser/readers/BrowserAztecCodeReader.js';
import { BrowserCodeReader } from './zxing/browser/readers/BrowserCodeReader.js';
import { BrowserDatamatrixCodeReader } from './zxing/browser/readers/BrowserDatamatrixCodeReader.js';
import { BrowserMultiFormatOneDReader } from './zxing/browser/readers/BrowserMultiFormatOneDReader.js';
import { BrowserMultiFormatReader } from './zxing/browser/readers/BrowserMultiFormatReader.js';
import { BrowserQRCodeReader } from './zxing/browser/readers/BrowserQRCodeReader.js';
import { BrowserPDF417Reader } from './zxing/browser/readers/BrowserPDF417Reader.js';

import BarcodeFormat from './zxing/core/BarcodeFormat.js';
import DecodeHintType from './zxing/core/DecodeHintType.js';

const INPUT_ATTRIBUTES = [
    'autocomplete', 'autofocus', 'inputmode', 'maxlength', 'minlength', 'name', 'pattern', 'placeholder', 'required', 'size', 'tabindex', 'title', 'value', 'data-asna-position-cursor'
];

const DEFAULT_SCANNING_TIMEOUT_SECONDS = 120; // Two minutes.
const SWITCH_VIDEO_CAMERA_WAIT = 250;

class Barcodes {
    init(options) {
        if ( ! options || ! options.formId ) { return; }
        const form = document.getElementById(options.formId);
        if ( ! form ) { return; }

        const elements = form.querySelectorAll(`input[${AsnaDataAttrName.DETECT_BARCODE}]`);

        for (let i = 0, l = elements.length; i < l; i++) {
            const input = elements[i];
            const encOptions = input.getAttribute(AsnaDataAttrName.DETECT_BARCODE);
            try {
                const options = JSON.parse(Base64.decode(encOptions));
                input.removeAttribute(AsnaDataAttrName.DETECT_BARCODE);
                Barcodes.createComponent(input, options);
            }
            catch (ex) {
                // alert(ex);
            }
        }        
    }

    static createComponent(input, options){
        const div = document.createElement('div');
        Barcodes.copyNonInputAttributes(div, input);
        div.className = 'dds-field-barcode-container';

        const btnScan = document.createElement('button');
        btnScan.className = 'dds-field-barcode-button';
        btnScan.type = 'button';

        if (options.readOnly) {
            btnScan.setAttribute('disabled', true);
        }        

        btnScan.innerHTML = `
<svg class="dds-field-barcode-button-image" xmlns="http://www.w3.org/2000/svg" width="19" height="18" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd">
    <path d="M.5001 2.5L.5.2501 3 .25M17.9999 2.5L18 .2501 15.5.25m-14.9999 15L.5 17.4999 3 17.5m12.75-.0001l2.2499.0001L18 15" fill="none" stroke-linejoin="miter" class="B C" stroke-linecap="square" stroke-width=".5"/>
    <g fill="#000" class="B" stroke-linecap="square">
        <path d="M3.00011 4.75001L3.0001 12.75" class="D" stroke-width="2"/>
        <path d="M4.50011 4.25001L4.5001 13.25" stroke="#838383"/>
        <path d="M5.25011 4.00001L5.2501 13.5" class="C" stroke-width=".5"/>
        <path d="M7.50011 4.75001L7.5001 12.75" class="D" stroke-width="2"/>
        <g class="C" stroke-width=".5">
            <path d="M8.75011 4.00001L8.7501 13.5" stroke="#e0e0e0"/>
            <path d="M9.75011 4.00001L9.7501 13.5" stroke="#c1c1c1"/>
            <path d="M10.25011 4.00001L10.2501 13.5"/>
        </g>
        <path d="M11.50011 4.25001L11.5001 13.25" stroke="#838383"/>
        <path d="M12.25011 4.00001L12.2501 13.5" class="C" stroke-width=".5"/>
        <path d="M14.50011 4.75001L14.5001 12.75" class="D" stroke-width="2"/>
        <g class="C" stroke-width=".5">
            <path d="M15.75011 4.00001L15.7501 13.5" stroke="#e0e0e0"/>
            <path d="M16.50011 4.00001L16.5001 13.5"/>
        </g>
    </g>
    <path fill="red" d="M.5 8.7501h13.1595L17.5 8.75" stroke="red"/>
</svg>`;
        
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'dds-field-barcode-input';
        Barcodes.copyInputAttributes(inputField,input);

        if (options.readOnly) {
            inputField.setAttribute('disabled', true);
        }
        else {
            const hintsMap = Barcodes.barcodeOptionsToZxingHintMap(options);
            btnScan._asna = {
                input: inputField, hints: hintsMap, timeout: options.scanningTimeoutSeconds, pushKey: options.pushKeyAfterDetection
            };
            btnScan.addEventListener('click', Barcodes.handleScanButtonClick);
        }

        div.appendChild(inputField);
        div.appendChild(btnScan);

        input.parentNode.replaceChild(div, input); // Note: input will be destroyed during DOM's garbage collection.
    }

    static barcodeOptionsToZxingHintMap(options) {
        const hintsMap = new Map();
        if (options.hintPossibleFormats && options.hintPossibleFormats.length>0 ) { hintsMap.set(DecodeHintType.POSSIBLE_FORMATS, options.hintPossibleFormats); }
        if (options.hintTryHarder) { hintsMap.set(DecodeHintType.TRY_HARDER, options.hintTryHarder); }
        if (options.pureBarcode) { hintsMap.set(DecodeHintType.PURE_BARCODE, options.pureBarcode); }
        if (options.hintCharacterSet) { hintsMap.set(DecodeHintType.CHARACTER_SET, options.hintCharacterSet); }
        if (options.hintAllowedLengths && options.hintAllowedLengths.length>0) { hintsMap.set(DecodeHintType.ALLOWED_LENGTHS, options.hintAllowedLengths); }
        if (options.hintAssumeCode39CheckDigit) { hintsMap.set(DecodeHintType.ASSUME_CODE_39_CHECK_DIGIT, options.hintAssumeCode39CheckDigit); }
        if (options.hintEnableCode39ExtendedMode) { hintsMap.set(DecodeHintType.ENABLE_CODE_39_EXTENDED_MODE, options.hintEnableCode39ExtendedMode); }
        if (options.hintAssumeGS1) { hintsMap.set(DecodeHintType.ASSUME_GS1, options.hintAssumeGS1); }
        // Not used:  hintsMap.set(DecodeHintType.RETURN_CODABAR_START_END, ... );
        if (options.hintAllowedEAN_Extensions && options.hintAllowedEAN_Extensions.length>0 ) { hintsMap.set(DecodeHintType.ALLOWED_EAN_EXTENSIONS, options.hintAllowedEAN_Extensions); }
        return hintsMap;
    }

    static copyNonInputAttributes(target, source) {
        if (!source.attributes) { return; }

        for (let i = 0, l = source.attributes.length; i < l; i++) {
            const attr = source.attributes[i];
            if (attr.name && ! INPUT_ATTRIBUTES.includes(attr.name) ) {
                target.setAttribute(attr.name, attr.value);
            }
        }
    }

    static copyInputAttributes(target, source) {
        if (!source.attributes) { return; }

        for (let i = 0, l = source.attributes.length; i < l; i++) {
            const attr = source.attributes[i];
            if (attr.name && INPUT_ATTRIBUTES.includes(attr.name)) {
                target.setAttribute(attr.name, attr.value);
            }
        }
    }

    static copyTabIndexAttr(target, source) {
        const tabIndex = source.getAttribute('tabindex');
        if (tabIndex) {
            target.setAttribute('tabindex', tabIndex);
        }
    }

    static handleScanButtonClick(e) {
        const target = e.target;

        if (!target) { return };

        const btn = (target.tagName === 'button' && target.className === 'button.dds-field-barcode-button') ? target :
            target.closest('button.dds-field-barcode-button');
        if (!btn._asna || !btn._asna.input) { return };

        const input = btn._asna.input; 
        const form = input.form;

        const audio = new Audio('/lib/asna-expo/audio/barcode-identified-alarm.mp3');
        audio.load();
        input._asna = { audio: { shouldPlay: false, intervalID: null } };
        audio.addEventListener('canplaythrough', (event) => {
            input._asna.audio.intervalID = setInterval(() => {
                if (input._asna && input._asna.audio.shouldPlay) {
                    audio.play();
                    clearInterval(input._asna.audio.intervalID);
                    input._asna.audio.intervalID = null;
                }
            }, 500);
        });

        Barcodes.scanStart(form, btn, -1);
    }

    static handleScanToolboxOptionClick(e) {
        const btn = e.target;
        if (!btn || !btn._asna) { return };    

        const form = btn._asna.form;
        const scanBtn = btn._asna.scanBtn;
        const index = btn._asna.index;

        const videoElement = form.querySelector('video.dds-field-barcode-video');
        if ( ! videoElement || ! videoElement._asna ) {
            return;
        }
        const controls = videoElement._asna.controls;

        if ( controls ) {
            Barcodes.scanEnd(controls, form, scanBtn._asna.input);
            if ( index > 0 ) {
                setTimeout( ()=> {
                    Barcodes.scanStart(form, scanBtn, index-1);                
                }, SWITCH_VIDEO_CAMERA_WAIT);
            }
        }
    }


    static async listVideoInputDevices() {
        return await BrowserCodeReader.listVideoInputDevices();
    }

    static async decodeFromVideoDevice(codeReader, selectedDeviceId, videoElement, form, targetInput ) {
        return await codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, error, controls) => {
            if (result) {
                let scanText = result.text;
                const maxLength = targetInput.getAttribute('maxlength');
                if (maxLength && scanText.length > maxLength) {
                    scanText = scanText.substring(0, scanText);
                }
                targetInput.setAttribute('value', scanText);
                if (targetInput._asna && targetInput._asna.audio) {
                    targetInput._asna.audio.shouldPlay = true;
                }

                Barcodes.scanEnd(controls, form, null /* Note: we avoid passing targetInput: interval is cleared after playing */ );

                const pushKey = videoElement._asna ? videoElement._asna.pushKey : null;

                if (!pushKey || !pushKey.aidKey ) { return; }

                Barcodes.pushKey(pushKey);
            }
            else if ( controls ) {
                if ( videoElement._asna && ! videoElement._asna.controls ) {
                    videoElement._asna.controls = controls; 
                }
            }
        });
    }

    static pushKey(pushKey) {
        if (window._00) { // Legacy JavaScript implementation (backward-compatibility)
            const fwPushKeyFocus = window._01;
            const fwPushKeyCursor = window._02;
            const fwPushKeyField = window._03;

            if (pushKey.vRowCol) {
                if (pushKey.fmt) {
                    fwPushKeyFocus(pushKey.aidKey, pushKey.fieldname, pushKey.vRowCol, pushKey.fmt);
                } else {
                    fwPushKeyCursor(pushKey.aidKey, pushKey.vRowCol);
                }
            } else {
                fwPushKeyField(pushKey.aidKey, pushKey.fieldname);
            }

            return;
        }

        if (window.asnaExpo && window.asnaExpo.page && window.asnaExpo.page.pushKey) {
            window.asnaExpo.page.pushKey(pushKey.aidKey, pushKey.fieldname, '', pushKey.vRowCol);
        }
    }

    static scanStart(form, btn, preferredDeviceIndex ) {
        const activeScanning = form.querySelectorAll('div.dds-field-barcode-video-containter');
        if ( ! btn || ! btn._asna || ! btn._asna.input || activeScanning && activeScanning.length ) {
            return;
        }

        const targetInput = btn._asna.input;
        const hintsMap = btn._asna.hints;
        const timeoutSeconds = (typeof btn._asna.timeout === 'undefined') ?
            DEFAULT_SCANNING_TIMEOUT_SECONDS :
            btn._asna.timeout;

        targetInput.setAttribute('value', '');

        const scanFrame = document.createElement('div');
        scanFrame.className = 'dds-field-barcode-video-frame';
        scanFrame.tabIndex = '0'; // Make it focusable (so that dds-field-barcode-video-frame:focus can be applied.)

        const scanContainer = document.createElement('div');
        scanContainer.className = 'dds-field-barcode-video-containter';

        const videoElement = document.createElement('video');
        videoElement.className = 'dds-field-barcode-video';

        const toolboxControls = document.createElement('div');
        toolboxControls.className = 'dds-field-barcode-controls';
       
        scanContainer.appendChild(videoElement);
        scanContainer.appendChild(toolboxControls);

        scanFrame.appendChild(scanContainer);

        const row = targetInput.closest('div.dds-grid-row');
        if (row && row.nextElementSibling) {
            const parent = row.parentElement;
            parent.insertBefore(scanFrame, row.nextElementSibling);
        }
        else {
            form.appendChild(scanFrame);
            scanFrame.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const codeReader = Barcodes.createCodeReader(hintsMap);
        Barcodes.listVideoInputDevices().then(
            (videoDevices) => {
                if (!videoDevices || !videoDevices.length) {
                    alert('Failed to find video camera to start scanning.');
                    Barcodes.scanEnd(null, form, btn._asna.input);
                }
                else {
                    toolboxControls.appendChild(Barcodes.createScanToolboxOption(form, btn, 0, 'x', 'Stop scan'));

                    let deviceIndex = 0;
                    if (videoDevices.length > 1) {
                        for (let i = 0; i < videoDevices.length; i++) {
                            toolboxControls.appendChild(Barcodes.createScanToolboxOption(form, btn, i + 1, `${i + 1}`, videoDevices[i].label));

                            if (preferredDeviceIndex < 0 &&
                                (videoDevices[i].label.includes('Back') || videoDevices[i].label.includes('back'))) {
                                deviceIndex = i;
                            }
                        }
                    }
                    if (preferredDeviceIndex >= 0 && preferredDeviceIndex < videoDevices.length) {
                        deviceIndex = preferredDeviceIndex;
                    }
                    const selectedDeviceId = videoDevices[deviceIndex].deviceId;
                    videoElement._asna = { pushKey: btn._asna.pushKey };
                    Barcodes.decodeFromVideoDevice(codeReader, selectedDeviceId, videoElement, form, targetInput);

                    if (timeoutSeconds > 0) {
                        videoElement._asna.scanTimeoutID = setTimeout(() => {
                            if (videoElement._asna.controls) {
                                Barcodes.scanEnd(videoElement._asna.controls, form, btn._asna.input);
                            }
                        },
                        timeoutSeconds * 1000);
                    }
                }
            }
        ).catch((error)=>{
            Barcodes.scanEnd(null, form, btn._asna.input);
            alert(error);
        });
    }

    static createCodeReader(hintsMap) {
        if (!hintsMap || hintsMap.length === 0) {  // No hints: use defaults and look for ANY barcode format. (Slow)
            return new BrowserMultiFormatReader();
        }

        const possibleFormats = hintsMap.get(DecodeHintType.POSSIBLE_FORMATS);
        if (!possibleFormats || possibleFormats.length > 1) { // No possible formats or more than one barcode format. Use the given possible formats (or ANY).
            return new BrowserMultiFormatReader(hintsMap);
        }

        if (possibleFormats.includes(BarcodeFormat.AZTEC)) { // Only AZTEC barcode format. (Fast)
            return new BrowserAztecCodeReader(hintsMap);
        }

        if (possibleFormats.includes(BarcodeFormat.DATA_MATRIX)) { // Only DATA_MATRIX barcode format. (Fast)
            return new BrowserDatamatrixCodeReader(hintsMap);
        }

        if (possibleFormats.includes(BarcodeFormat.CODABAR) ||
            possibleFormats.includes(BarcodeFormat.CODE_39) || 
            possibleFormats.includes(BarcodeFormat.CODE_93) || 
            possibleFormats.includes(BarcodeFormat.CODE_128) || 
            possibleFormats.includes(BarcodeFormat.EAN_8) ||
            possibleFormats.includes(BarcodeFormat.EAN_13) ||
            possibleFormats.includes(BarcodeFormat.ITF) || 
            possibleFormats.includes(BarcodeFormat.RSS_14) || 
            possibleFormats.includes(BarcodeFormat.RSS_EXPANDED) ||
            possibleFormats.includes(BarcodeFormat.UPC_A) || 
            possibleFormats.includes(BarcodeFormat.UPC_E) || 
            possibleFormats.includes(BarcodeFormat.UPC_EAN_EXTENSION)) {
            return new BrowserMultiFormatOneDReader(hintsMap); // Any One Dimensional Barcode format.
        }

        if (possibleFormats.includes(BarcodeFormat.QR_CODE)) { // Only QR-CODE Barcode format.
            return new BrowserQRCodeReader(hintsMap);
        }

        if (possibleFormats.includes(BarcodeFormat.PDF_417)) { // Only PDF-417 Barcode format.
            return new BrowserPDF417Reader(hintsMap);
        }

        return new BrowserMultiFormatReader(hintsMap); // Unexpected (possible format). Try ANY (good-luck!).
    }

    static scanEnd( videoControls, form, targetInput) {
        console.assert(form, 'Unexpected form null or undefined');

        if ( videoControls ) {
            videoControls.stop();
        }
        const scanFrame = form.querySelector('div.dds-field-barcode-video-frame');
        const videoElement = form.querySelector('video.dds-field-barcode-video');

        if ( videoElement && videoElement._asna && videoElement._asna.scanTimeoutID ) {
            clearTimeout(videoElement._asna.scanTimeoutID);
        }
        if (scanFrame && scanFrame.parentNode) {
            scanFrame.parentNode.removeChild(scanFrame);
        }

        if (targetInput && targetInput._asna && targetInput._asna.audio && targetInput._asna.audio.intervalID) {
            clearInterval(targetInput._asna.audio.intervalID);
            targetInput._asna.audio.intervalID = null;
        }
    }

    static createScanToolboxOption(form, scanBtn, index, textContent, tooltip) {
        const toolOpt = document.createElement('button');
        toolOpt.type = 'button';
        toolOpt.className = 'dds-field-barcode-control-option';
        toolOpt.textContent = textContent; 
        toolOpt.title = tooltip;

        toolOpt._asna = {form, scanBtn, index };

        toolOpt.addEventListener('click', Barcodes.handleScanToolboxOptionClick);

        return toolOpt;
    }
}

const theBarcodes = new Barcodes();
