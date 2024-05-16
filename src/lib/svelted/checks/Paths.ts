export function isRelativePath(url: string): boolean {
    var pattern = /(\.\.\/|\.\.\\|\.\/|\.\\)/;
    return pattern.test(url);
}

export function isValidPath(url: string): boolean {
    if (url == "/") {
        return true;
    } else {
        const pattern = /^[a-zA-Z0-9\-_~:/?#[\]@!$&'()*+,;=.]+$/;
        return pattern.test(url);
    }
}

export function isInternalPath(url: string): boolean {
    const pattern = /^\/?svelted(\/.*)?$/;
    return pattern.test(url);
}