import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PaymentSummaryProps {
  projectConsultants: Array<{
    id: string;
    quote?: number | null;
    consultant: {
      name: string;
    };
  }>;
  invoices: Array<{
    amount: number;
    status: string;
  }>;
}

const PaymentSummary = ({ projectConsultants, invoices }: PaymentSummaryProps) => {
  const totalQuoted = projectConsultants.reduce((sum, pc) => sum + (pc.quote || 0), 0);
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPaid = invoices
    .filter(invoice => invoice.status === 'Paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const invoicedPercentage = totalQuoted > 0 ? (totalInvoiced / totalQuoted) * 100 : 0;
  const paidPercentage = totalQuoted > 0 ? (totalPaid / totalQuoted) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quoted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalQuoted.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalInvoiced.toLocaleString()}</div>
          <Progress value={invoicedPercentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {invoicedPercentage.toFixed(1)}% of total quoted
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalPaid.toLocaleString()}</div>
          <Progress value={paidPercentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {paidPercentage.toFixed(1)}% of total quoted
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(totalInvoiced - totalPaid).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {invoices.filter(invoice => invoice.status === 'Pending').length} pending invoices
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSummary;