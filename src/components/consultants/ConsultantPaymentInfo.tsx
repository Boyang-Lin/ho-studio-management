import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import InvoiceDialog from "../projects/InvoiceDialog";
import { useState } from "react";

interface ConsultantPaymentInfoProps {
  projectConsultant: {
    id: string;
    quote?: number | null;
    consultant: {
      name: string;
    };
    preSelectedConsultantId?: string;
  };
}

export const ConsultantPaymentInfo = ({
  projectConsultant,
}: ConsultantPaymentInfoProps) => {
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  const { data: invoices = [] } = useQuery({
    queryKey: ["consultant_invoices", projectConsultant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultant_invoices")
        .select("*")
        .eq("project_consultant_id", projectConsultant.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const totalQuoted = projectConsultant.quote || 0;
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPaid = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const outstanding = totalInvoiced - totalPaid;

  const invoicedPercentage = totalQuoted > 0 ? (totalInvoiced / totalQuoted) * 100 : 0;
  const paidPercentage = totalQuoted > 0 ? (totalPaid / totalQuoted) * 100 : 0;

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Payment Information</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setInvoiceDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Quoted</p>
          <p className="text-lg font-semibold">
            ${totalQuoted.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Invoiced</p>
          <p className="text-lg font-semibold">
            ${totalInvoiced.toLocaleString()}
          </p>
          <Progress value={invoicedPercentage} className="mt-1" />
          <p className="text-xs text-muted-foreground">
            {invoicedPercentage.toFixed(1)}% of quote
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Amount Paid</p>
          <p className="text-lg font-semibold">${totalPaid.toLocaleString()}</p>
          <Progress value={paidPercentage} className="mt-1" />
          <p className="text-xs text-muted-foreground">
            {paidPercentage.toFixed(1)}% of quote
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Outstanding</p>
          <p className="text-lg font-semibold">
            ${outstanding.toLocaleString()}
          </p>
        </div>
      </div>

      {invoices.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Recent Invoices</h5>
          <div className="space-y-2">
            {invoices.slice(0, 3).map((invoice) => (
              <div
                key={invoice.id}
                className="flex justify-between items-center text-sm"
              >
                <div>
                  <p>
                    {invoice.invoice_number || "Invoice"}:{" "}
                    ${invoice.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(invoice.invoice_date).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={invoice.status === "Paid" ? "default" : "secondary"}
                >
                  {invoice.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        projectConsultants={[{
          id: projectConsultant.id,
          quote: projectConsultant.quote,
          consultant: projectConsultant.consultant
        }]}
        preSelectedConsultantId={projectConsultant.preSelectedConsultantId}
      />
    </div>
  );
};