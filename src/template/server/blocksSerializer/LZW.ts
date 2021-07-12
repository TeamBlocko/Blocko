interface LZW {
	Compress(text: string, disableExtraEncoding: boolean): string,
	Decompress(text: string, disableExtraEncoding: boolean): string,
}

declare const LZW: LZW;
export = LZW