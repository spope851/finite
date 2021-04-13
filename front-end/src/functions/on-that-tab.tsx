export const onThatTab = (path: string, exact?: boolean) => {
  return exact ? window.location.pathname === path : window.location.pathname.indexOf(path) > -1
}