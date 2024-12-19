import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import InvoiceDialog from "./InvoiceDialog";
import InvoiceList from "./InvoiceList";
import PaymentSummary from "./PaymentSummary";

interface PaymentManagementTabProps {
  projectId: string;
  projectConsultants: Array<{
    id: string;
    quote?: number | null;
    consultant: {
      name: string;
    };
  }>;
  readOnly?: boolean;
}

const PaymentManagementTab = ({ 
  projectId, 
  projectConsultants,
  readOnly = false 
}: PaymentManagementTabProps) => {
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["consultant_invoices", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultant_invoices")
        .select(`
          *,
          project_consultant:project_consultants(
            id,
            consultant:consultants(
              name
            )
          )
        `)
        .in(
          'project_consultant_id',
          projectConsultants.map(pc => pc.id)
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEditInvoice = (invoice: any) => {
    if (readOnly) return;
    setSelectedInvoice(invoice);
    setInvoiceDialogOpen(true);
  };

  const handleCloseInvoiceDialog = () => {
    setSelectedInvoice(null);
    setInvoiceDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Management</h2>
        {!readOnly && (
          <Button onClick={() => setInvoiceDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        )}
      </div>

      <PaymentSummary
        projectConsultants={projectConsultants}
        invoices={invoices}
      />

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceList
            invoices={invoices}
            isLoading={isLoading}
            onEdit={handleEditInvoice}
            readOnly={readOnly}
          />
        </CardContent>
      </Card>

      {!readOnly && (
        <InvoiceDialog
          open={invoiceDialogOpen}
          onOpenChange={handleCloseInvoiceDialog}
          invoice={selectedInvoice}
          projectConsultants={projectConsultants}
        />
      )}
    </div>
  );
};

export default PaymentManagementTab;