export function load (url, callback) {
  const script = document.createElement('script');
  script.onload = callback;
  script.src = url;
  document.head.appendChild(script);
}
