import { CompressionService, TYPES, container } from "../../../core";

const compressionService = container.get<CompressionService>(
    TYPES.CompressionService
);

const compressToBase64Legacy = val =>
    btoa(compressionService.deflateString(val));
const decompressFromBase64Legacy = val =>
    compressionService.inflateString(atob(val));

export { compressToBase64Legacy, decompressFromBase64Legacy };
