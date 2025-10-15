import type { InputEntry, MapServiceOptions, ServiceDataRow } from '@/types/service.types'
import { ref } from 'vue'
import { loadCachedCSVData } from '@/data/data-cache'

export default class MapService {
  title: string
  dataFile: string
  data: ServiceDataRow[] = []
  formControls: Map<string, InputEntry[]>
  selectedFormControls: Map<string, string> = new Map() // key: entry key, value: selected entry key
  version = ref(0) // Reactive trigger for UI updates

  constructor({
    title,
    dataFile,
    formControls,
  }: MapServiceOptions) {
    this.title = title
    this.dataFile = dataFile
    this.formControls = new Map(Object.entries(formControls))
    for (const [entryKey, entryOptions] of this.formControls) {
      if (entryOptions?.[0] != null) {
        this.selectedFormControls.set(entryKey, entryOptions[0].key)
      }
    }
  }

  async loadData(): Promise<void> {
    this.data = await loadCachedCSVData(this.dataFile)
  }

  getSelectedEntry(entryKey: string): string | undefined {
    return this.selectedFormControls.get(entryKey)
  }

  setSelectedEntry(entryKey: string, selectedKey: string) {
    this.selectedFormControls.set(entryKey, selectedKey)
    this.version.value++
  }

  getSelectedEntryLabel(entryKey: string): string | undefined {
    const selectedKey = this.getSelectedEntry(entryKey)
    if (!selectedKey) {
      return undefined
    }
    const entryOptions = this.formControls.get(entryKey)
    return entryOptions?.find(e => e.key === selectedKey)?.label
  }

  get filteredData(): ServiceDataRow[] {
    const selectedFacility = this.selectedFormControls.get('facility')
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
