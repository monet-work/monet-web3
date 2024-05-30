import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { approveCompany, rejectCompany } from "@/lib/api-requests";
import { toast } from "sonner";
import { apiService } from "@/services/api.service";

type Props = {
  approved: boolean;
  companyUserId: string;
};

const CompanyTableRowActions: React.FC<Props> = ({
  approved,
  companyUserId,
}) => {
  const queryClient = useQueryClient();
  const approveCompanyMutation = useMutation({
    mutationFn: apiService.approveAdminCompany,
  });

  const rejectCompanyMutation = useMutation({
    mutationFn: apiService.rejectAdminCompany,
  });

  const handleApprove = async () => {
    await approveCompanyMutation.mutate(companyUserId, {
      onSuccess: () => {
        toast.success("Company approved");
        queryClient.invalidateQueries({ queryKey: ["companies"] });
      },
    });
  };

  const handleReject = async () => {
    await rejectCompanyMutation.mutate(companyUserId, {
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
