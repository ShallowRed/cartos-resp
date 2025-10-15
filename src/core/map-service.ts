import type { InputEntry, MapServiceOptions, ServiceDataRow } from '@/types/service.types'
import { ref } from 'vue'
import { loadCachedCSVData } from './data-cache'

export default class MapService {
  title: string
  dataFile: string
  data: ServiceDataRow[] = []
  entries: Map<string, InputEntry[]>
  selectedEntries: Map<string, string> = new Map() // key: entry key, value: selected entry key
  version = ref(0) // Reactive trigger for UI updates

  constructor({
    title,
    dataFile,
    entries,
  }: MapServiceOptions) {
    this.title = title
    this.dataFile = dataFile
    this.entries = new Map(Object.entries(entries))
    for (const [entryKey, entryOptions] of this.entries) {
      if (entryOptions?.[0] != null) {
        this.selectedEntries.set(entryKey, entryOptions[0].key)
      }
    }
  }

  async loadData(): Promise<void> {
    this.data = await loadCachedCSVData(this.dataFile)
  }

  getSelectedEntry(entryKey: string): string | undefined {
    return this.selectedEntries.get(entryKey)
  }

  setSelectedEntry(entryKey: string, selectedKey: string) {
    this.selectedEntries.set(entryKey, selectedKey)
    this.version.value++
  }

  getSelectedEntryLabel(entryKey: string): string | undefined {
    const selectedKey = this.getSelectedEntry(entryKey)
    if (!selectedKey) {
      return undefined
    }
    const entryOptions = this.entries.get(entryKey)
    return entryOptions?.find(e => e.key === selectedKey)?.label
  }

  get filteredData(): ServiceDataRow[] {
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
