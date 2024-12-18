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
import { Pencil, Loader2 } from "lucide-react";
import { format } from "date-fns";

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
              <Badge
                variant={invoice.status === 'Paid' ? 'default' : 'secondary'}
              >
                {invoice.status}
              </Badge>
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