import QRCodeReader from '../../core/qrcode/QRCodeReader.js';
import { BrowserCodeReader } from './BrowserCodeReader.js';
/**
 * QR Code reader to use from browser.
 */
export class BrowserQRCodeReader extends BrowserCodeReader {
    /**
     * Creates an instance of BrowserQRCodeReader.
     */
    constructor(hints, options) {
        super(new QRCodeReader(), hints, options);
    }
}
