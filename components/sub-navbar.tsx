"use client";

import { useCustomerStore } from "@/store/customerStore";

const SubNavbar = () => {
  const customerStore = useCustomerStore();
  return (
    <div className="sticky top-[70px] z-30 px-8 py-2 bg-teal-700 text-white flex justify-end">
      <div className="flex gap-4 text-slate-200 text-sm">
        <span>Your points:</span>
        <span>
          Off-Chain:{" "}
          <span className="font-bold text-white">
            {customerStore?.customer?.points || 0}
          </span>
        </span>
        <span>
          On-Chain: <span className="font-bold text-white">0 $ELP</span>
        </span>
      </div>
    </div>
  );
};

export default SubNavbar;
