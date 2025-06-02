// Add this helper at the top of your file
export default function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '');
}
