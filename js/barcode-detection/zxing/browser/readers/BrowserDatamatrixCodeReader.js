import DataMatrixReader from '../../core/datamatrix/DataMatrixReader.js';
import { BrowserCodeReader } from './BrowserCodeReader.js';
/**
 * QR Code reader to use from browser.
 */
export class BrowserDatamatrixCodeReader extends BrowserCodeReader {
    /**
     * Creates an instance of BrowserQRCodeReader.
     */
    constructor(hints, options) {
        super(new DataMatrixReader(), hints, options);
    }
}
