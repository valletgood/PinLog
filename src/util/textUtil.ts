/**
 * HTML 태그를 제거하고 순수 텍스트만 반환
 * @param html - HTML이 포함된 문자열
 * @returns 순수 텍스트
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';

  // DOMParser를 사용하여 안전하게 HTML 파싱 (브라우저 환경)
  if (typeof window !== 'undefined' && window.DOMParser) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  // 폴백: 정규식으로 태그 제거 (서버 환경 또는 DOMParser 미지원)
  return html
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/&nbsp;/g, ' ') // &nbsp; → 공백
    .replace(/&amp;/g, '&') // &amp; → &
    .replace(/&lt;/g, '<') // &lt; → <
    .replace(/&gt;/g, '>') // &gt; → >
    .replace(/&quot;/g, '"') // &quot; → "
    .replace(/&#39;/g, "'") // &#39; → '
    .trim();
}
