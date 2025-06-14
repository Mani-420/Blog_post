export default function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '');
}

export function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
