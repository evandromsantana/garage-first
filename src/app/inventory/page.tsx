import { getInventoryItems } from "@/app/actions"
import { PageHeader } from "@/components/page-header"
import { InventoryList } from "@/components/inventory/inventory-list"
import { AddInventoryItemForm } from "@/components/inventory/add-item-form"
import { Box } from "lucide-react"

export default async function InventoryPage() {
  const items = await getInventoryItems()

  return (
    <div className="kindle-page">
      <PageHeader 
        title="Almoxarifado" 
        icon={<Box className="h-8 w-8" />}
        backHref="/"
      />

      <main className="max-w-2xl mx-auto space-y-8 p-4">
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
            <h2 className="text-sm font-black uppercase tracking-widest">
              Controle de Estoque
            </h2>
            <span className="text-[10px] font-bold uppercase opacity-60">
              {items.length} itens cadastrados
            </span>
          </div>
          
          <AddInventoryItemForm />
        </section>

        <section className="space-y-4">
          <InventoryList items={items} />
        </section>

        <footer className="pt-12 pb-8 text-center border-t-2 border-dashed border-foreground/20">
          <p className="text-[10px] font-black uppercase opacity-40 italic">
            Garage Ninja Inventory System • v1.0
          </p>
        </footer>
      </main>
    </div>
  )
}
