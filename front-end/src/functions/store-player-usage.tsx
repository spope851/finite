const crumbs = window.localStorage.getItem("crumbs")
const recentInterests = crumbs && Array.from(JSON.parse(crumbs)).slice(0,5) as { id:string, name:string }[]

export const storeUsage = (id: string, name: string) => {
  if (crumbs) {
    let bool = true
    recentInterests && recentInterests.forEach((value: { id: string, name: string }) => { if (value.id === id) { bool = false } })
    if (bool) window.localStorage.setItem("crumbs", JSON.stringify([ { id, name }, ...Array.from(JSON.parse(crumbs)).slice(0, 4) ]))
  } else {
    window.localStorage.setItem("crumbs", JSON.stringify([ { id, name } ]))
  }
}
