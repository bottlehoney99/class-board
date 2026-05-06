document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
    event.preventDefault();
    location.href = document.body.dataset.next;
  }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp' || event.key === 'Backspace') {
    event.preventDefault();
    location.href = document.body.dataset.prev;
  }
  if (event.key === 'Home') {
    event.preventDefault();
    location.href = '../index.html';
  }
});
