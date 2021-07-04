
export function isInView(targetDOM: any): boolean {
  const scrollPosition = window.scrollY || window.pageYOffset;

  const targetPosition = targetDOM.getBoundingClientRect().top;

  if (scrollPosition > targetPosition) {
    return true;
  }
  return false;
}
