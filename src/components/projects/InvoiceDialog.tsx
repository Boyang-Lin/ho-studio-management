import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: any;
  projectConsultants: Array<{
    id: string;
    quote?: number | null;
    consultant: {
      name: string;
    };
  }>;
  preSelectedConsultantId?: string;
}

const InvoiceDialog = ({
  open,
  onOpenChange,
  invoice,
  projectConsultants,
  preSelectedConsultantId,
}: InvoiceDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      project_consultant_id: preSelectedConsultantId || "",
      amount: "",
      invoice_number: "",
      due_date: "",
      status: "Pending",
      notes: "",
    },
  });

  // Reset form with invoice data when editing
  useEffect(() => {
    if (invoice) {
      form.reset({
        project_consultant_id: invoice.project_consultant_id,
        amount: invoice.amount,
        invoice_number: invoice.invoice_number || "",
        due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : "",
        status: invoice.status,
        notes: invoice.notes || "",
      });
    } else {
      form.reset({
        project_consultant_id: preSelectedConsultantId || "",
        amount: "",
        invoice_number: "",
        due_date: "",
        status: "Pending",
        notes: "",
      });
    }
  }, [invoice, form, preSelectedConsultantId]);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...values,
        due_date: values.due_date ? new Date(values.due_date).toISOString() : null,
        invoice_date: invoice?.invoice_date || new Date().toISOString(),
      };

      if (invoice) {
        const { error } = await supabase
          .from("consultant_invoices")
          .update(formattedData)
          .eq("id", invoice.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Invoice updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("consultant_invoices")
          .insert(formattedData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Invoice created successfully",
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["consultant_invoices"],
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save invoice",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{invoice ? "Edit Invoice" : "New Invoice"}</DialogTitle>
          <DialogDescription>
            {invoice ? "Update the invoice details below." : "Create a new invoice by filling out the form below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="project_consultant_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={Boolean(invoice)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select consultant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectConsultants.map((pc) => (
                        <SelectItem key={pc.id} value={pc.id}>
                          {pc.consultant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoice_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter invoice number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter notes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {invoice ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;