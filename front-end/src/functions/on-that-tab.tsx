export const onThatTab = (path: string) => {
  return window.location.pathname.indexOf(path) > -1
}