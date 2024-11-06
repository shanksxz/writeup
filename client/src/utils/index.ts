export function stripHtmlAndTruncate(content: string, length = 100) {
    const plainText = content.replace(/<\/?[^>]+(>|$)/g, "");
    return plainText.length > length ? `${plainText.substring(0, length)}...` : plainText;
}
