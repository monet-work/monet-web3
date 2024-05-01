import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { approveCompany, rejectCompany } from "@/lib/api-requests";
import { toast } from "sonner";

type Props = {
  approved: boolean;
  companyWalletAddress: string;
};

const CompanyTableRowActions: React.FC<Props> = ({
  approved,
  companyWalletAddress,
}) => {
  const queryClient = useQueryClient();
  const approveCompanyMutation = useMutation({
    mutationFn: approveCompany,
  });

  const rejectCompanyMutation = useMutation({
    mutationFn: rejectCompany,
  });

  const handleApprove = async () => {
    await approveCompanyMutation.mutate(companyWalletAddress, {
      onSuccess: () => {
        toast.success("Company approved");
        queryClient.invalidateQueries({ queryKey: ["companies"] });
      },
    });
  };

  const handleReject = async () => {
    await rejectCompanyMutation.mutate(companyWalletAddress, {
      onSuccess: () => {
        toast.success("Company rejected");
        queryClient.invalidateQueries({ queryKey: ["companies"] });
      },
    });
  };

  return (
    <div className="flex gap-4">
      {!approved && <Button onClick={handleApprove}>Approve</Button>}

      <Button onClick={handleReject}>Reject</Button>
    </div>
  );
};

export default CompanyTableRowActions;
