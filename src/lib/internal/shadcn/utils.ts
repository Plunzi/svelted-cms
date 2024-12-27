import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getEnvirement() {
	function isChromeExtension() {
		// @ts-ignore
		return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
	}
	
	if (isChromeExtension()) {
		return "extension";
	} else {
		return "website";
	}
}