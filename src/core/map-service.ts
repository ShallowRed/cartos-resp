import * as d3 from 'd3'

interface InputEntry { label: string, key: string }

export default class MapService {
  title: string
  dataFile: string
  data: any[] = []
  entries: Map<string, InputEntry[]>
  selectedEntries: Map<string, string> = new Map() // key: entry key, value: selected entry key

  constructor({
    title,
    dataFile,
    entries,
  }: {
    title: string
    dataFile: string
    entries: Record<string, InputEntry[]>
  }) {
    this.title = title
    this.dataFile = dataFile
    this.entries = new Map(Object.entries(entries))
    for (const [entryKey, entryOptions] of this.entries) {
      if (entryOptions?.[0] != null) {
        this.selectedEntries.set(entryKey, entryOptions[0].key)
      }
    }
  }

  async loadData() {
    this.data = await d3.csv(this.dataFile)
  }

  getSelectedEntry(entryKey: string): string | undefined {
    return this.selectedEntries.get(entryKey)
  }

  setSelectedEntry(entryKey: string, selectedKey: string) {
    this.selectedEntries.set(entryKey, selectedKey)
  }

  getSelectedEntryLabel(entryKey: string): string | undefined {
    const selectedKey = this.getSelectedEntry(entryKey)
    if (!selectedKey) {
      return undefined
    }
    const entryOptions = this.entries.get(entryKey)
    return entryOptions?.find(e => e.key === selectedKey)?.label
  }

  get filteredData(): any[] {
    const selectedFacility = this.selectedEntries.get('facility')
    if (!selectedFacility) {
      return this.data
    }

    return this.data.filter((d) => {
      // For couverture data: filter by "Libelle" column
      if (d.Libelle !== undefined) {
        return d.Libelle === selectedFacility
      }
      // For duree data: filter by "Source" column
      if (d.Source !== undefined) {
        return d.Source === selectedFacility
      }
      return true
    })
  }
}
