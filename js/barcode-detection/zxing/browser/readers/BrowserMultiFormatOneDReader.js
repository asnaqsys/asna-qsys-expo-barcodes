import MultiFormatOneDReader from '../../core/MultiFormatReader.js';
import { BrowserCodeReader } from './BrowserCodeReader.js';
/**
 * Reader to be used for any One Dimension type barcode.
 */
export class BrowserMultiFormatOneDReader extends BrowserCodeReader {
    /**
     * Creates an instance of BrowserBarcodeReader.
     * @param {Map<DecodeHintType, any>} hints?
     * @param options
     */
    constructor(hints, options) {
        super(new MultiFormatOneDReader(hints), hints, options);
    }
}
