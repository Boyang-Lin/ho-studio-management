import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Loader2, Check } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface InvoiceListProps {
  invoices: Array<{
    id: string;
    amount: number;
    invoice_date: string;
    due_date: string | null;
    status: string;
    invoice_number: string | null;
    project_consultant: {
      consultant: {
        name: string;
      };
    };
  }>;
  isLoading: boolean;
  onEdit: (invoice: any) => void;
}

const InvoiceList = ({ invoices, isLoading, onEdit }: InvoiceListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from("consultant_invoices")
        .update({ 
          status: "Paid",
          payment_date: new Date().toISOString()
        })
        .eq("id", invoiceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invoice marked as paid",
      });

      queryClient.invalidateQueries({
        queryKey: ["consultant_invoices"],
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update invoice status",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No invoices found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Consultant</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.invoice_number || '-'}</TableCell>
            <TableCell>{invoice.project_consultant.consultant.name}</TableCell>
            <TableCell>${invoice.amount.toLocaleString()}</TableCell>
            <TableCell>{format(new Date(invoice.invoice_date), 'MMM d, yyyy')}</TableCell>
            <TableCell>
              {invoice.due_date ? format(new Date(invoice.due_date), 'MMM d, yyyy') : '-'}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge
                  variant={invoice.status === 'Paid' ? 'default' : 'secondary'}
                >
                  {invoice.status}
                </Badge>
                {invoice.status !== 'Paid' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsPaid(invoice.id)}
                    className="h-7"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark Paid
                  </Button>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(invoice)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceList;