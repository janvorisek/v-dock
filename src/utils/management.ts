export function findParentElementWithClass(element: HTMLElement, className: string): HTMLElement | null {
  if (element.classList.contains(className))
    return element

  let parent = element.parentElement
  while (parent && !parent.classList.contains(className))
    parent = parent.parentElement

  return parent
}

interface Item {
  id: string
  children: Item[]
}

export function getItemRecursive(item: Item, uuid: string): Item | null {
  if ('children' in item === false)
    return null

  const index = item.children.find(child => child.id === uuid)
  if (index)
    return index

  for (const child of item.children) {
    const ret = getItemRecursive(child, uuid)
    if (ret)
      return ret
  }

  return null
}

export function deleteItem(item: Item, uuid: string): Item | null {
  if ('children' in item === false)
    return null

  let tmp = null

  const index = item.children.findIndex(child => child.id === uuid)
  if (index !== -1)
    return item.children.splice(index, 1)[0]

  for (const child of item.children) {
    tmp = deleteItem(child, uuid)
    if (tmp)
      return tmp
  }

  return null
}

export function addItem(item: Item, uuid: string, what: Item) {
  if ('children' in item === false)
    return

  const index = item.children.findIndex(child => child.id === uuid)
  if (index !== -1) {
    item.children.splice(index, 0, what)
    return
  }

  for (const child of item.children)
    addItem(child, uuid, what)
}
