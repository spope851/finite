const crumbs = window.localStorage.getItem("crumbs")

export const storeUsage = (id: string) => {
  if (crumbs) {
    if (Array.from(JSON.parse(crumbs)).slice(0, 5).indexOf(id) === -1)
    window.localStorage.setItem("crumbs", JSON.stringify([ id, ...Array.from(JSON.parse(crumbs)) ]))
  } else {
    window.localStorage.setItem("crumbs", JSON.stringify([ id ]))
  }
}
