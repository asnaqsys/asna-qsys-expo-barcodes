import AztecCodeReader from '../../core/aztec/AztecReader.js';
import { BrowserCodeReader } from './BrowserCodeReader.js';
/**
 * Aztec Code reader to use from browser.
 *
 * @class BrowserAztecCodeReader
 * @extends {BrowserCodeReader}
 */
export class BrowserAztecCodeReader extends BrowserCodeReader {
    /**
     * Creates an instance of BrowserAztecCodeReader.
     */
    constructor(hints, options) {
        super(new AztecCodeReader(), hints, options);
    }
}
