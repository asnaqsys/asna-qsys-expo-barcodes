import PDF417Reader from '../../core/pdf417/PDF417Reader.js';
import { BrowserCodeReader } from './BrowserCodeReader.js';
/**
 * QR Code reader to use from browser.
 */
export class BrowserPDF417Reader extends BrowserCodeReader {
    /**
     * Creates an instance of BrowserPDF417Reader.
     */
    constructor(hints, options) {
        super(new PDF417Reader(), hints, options);
    }
}
